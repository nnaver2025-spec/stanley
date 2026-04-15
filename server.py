"""
Stanley Dashboard local server.
- Serves static files
- Exposes options API: /api/maxpain
- Refreshes data.js in background by running scraper.py
"""

import http.server
import json
import math
import os
import socketserver
import sys
import threading
import time
import webbrowser
from datetime import datetime
from urllib.parse import parse_qs, urlparse

import pandas as pd
import yfinance as yf

if sys.platform == "win32":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)


PORT = 8080
REFRESH_INTERVAL = 60
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AUTO_OPEN_BROWSER = os.getenv("STANLEY_NO_BROWSER", "").lower() not in {"1", "true", "yes", "on"}


def sanitize_for_json(value):
    if isinstance(value, dict):
        return {k: sanitize_for_json(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [sanitize_for_json(v) for v in value]
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if hasattr(value, "item") and callable(getattr(value, "item")):
        try:
            return sanitize_for_json(value.item())
        except Exception:
            return str(value)
    return value


def _safe_round(value, digits=2):
    try:
        f = float(value)
        if math.isfinite(f):
            return round(f, digits)
    except Exception:
        pass
    return None


def _prepare_option_frame(df):
    if df is None or df.empty:
        return pd.DataFrame(columns=["strike", "openInterest", "volume", "impliedVolatility"])
    out = df.copy()
    out["strike"] = pd.to_numeric(out.get("strike"), errors="coerce")
    out["openInterest"] = pd.to_numeric(out.get("openInterest"), errors="coerce").fillna(0)
    out["volume"] = pd.to_numeric(out.get("volume"), errors="coerce").fillna(0)
    out["impliedVolatility"] = pd.to_numeric(out.get("impliedVolatility"), errors="coerce")
    out = out.dropna(subset=["strike"])
    return out


def _select_metric_column(calls, puts):
    call_oi = float(calls["openInterest"].sum()) if not calls.empty else 0.0
    put_oi = float(puts["openInterest"].sum()) if not puts.empty else 0.0
    total_oi = call_oi + put_oi
    if total_oi > 0:
        return "openInterest", call_oi, put_oi

    call_vol = float(calls["volume"].sum()) if "volume" in calls else 0.0
    put_vol = float(puts["volume"].sum()) if "volume" in puts else 0.0
    total_vol = call_vol + put_vol
    if total_vol > 0:
        return "volume", call_vol, put_vol

    return "openInterest", 0.0, 0.0


def _load_chain_for_expiry(ticker, expiry):
    chain = ticker.option_chain(expiry)
    calls = _prepare_option_frame(chain.calls)
    puts = _prepare_option_frame(chain.puts)
    return calls, puts


def _pick_best_expiry_chain(ticker, expirations, selected_expiry=None):
    ordered = []
    if selected_expiry and selected_expiry in expirations:
        ordered.append(selected_expiry)
    ordered.extend([e for e in expirations if e not in ordered])

    last_calls = pd.DataFrame()
    last_puts = pd.DataFrame()
    last_expiry = ordered[0] if ordered else None

    for expiry in ordered:
        try:
            calls, puts = _load_chain_for_expiry(ticker, expiry)
        except Exception:
            continue

        metric_col, call_sum, put_sum = _select_metric_column(calls, puts)
        total = call_sum + put_sum
        if total > 0 and (not calls.empty or not puts.empty):
            return expiry, calls, puts, metric_col, call_sum, put_sum

        last_calls, last_puts, last_expiry = calls, puts, expiry

    metric_col, call_sum, put_sum = _select_metric_column(last_calls, last_puts)
    return last_expiry, last_calls, last_puts, metric_col, call_sum, put_sum


def run_scraper():
    try:
        sys.path.insert(0, SCRIPT_DIR)
        import importlib
        import scraper

        importlib.reload(scraper)
        print(f"\n{'=' * 50}")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 스크래핑 시작...")
        print(f"{'=' * 50}")
        scraper.main()
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 데이터 갱신 완료")
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 스크래핑 오류: {e}")


def background_refresh():
    while True:
        time.sleep(REFRESH_INTERVAL)
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] {REFRESH_INTERVAL // 60}분 주기 자동 갱신")
        run_scraper()


def calculate_max_pain_payload(ticker_symbol, selected_expiry=None):
    """
    Core formula aligned with the user's original script:
    - nearest expiry default (expirations[0])
    - all strikes used for max-pain loss minimization
    - current price from history(period='1d')['Close'].iloc[-1]
    """
    ticker_symbol = (ticker_symbol or "").strip().upper()
    if not ticker_symbol:
        return {"error": "티커를 입력해 주세요."}

    ticker = yf.Ticker(ticker_symbol)

    try:
        history = ticker.history(period="1d")
        if history.empty:
            return {"error": f"{ticker_symbol}의 가격 데이터를 불러올 수 없습니다."}
        close_series = pd.to_numeric(history.get("Close"), errors="coerce").dropna()
        if close_series.empty:
            return {"error": f"{ticker_symbol}의 현재가가 유효하지 않습니다."}
        current_price = float(close_series.iloc[-1])
        if not math.isfinite(current_price) or current_price <= 0:
            return {"error": f"{ticker_symbol}의 현재가가 유효하지 않습니다."}
    except Exception as e:
        return {"error": f"가격 데이터 조회 중 오류: {e}"}

    try:
        expirations = list(ticker.options)
    except Exception as e:
        return {"error": f"만기일 조회 중 오류: {e}"}

    if not expirations:
        return {"error": f"{ticker_symbol}의 옵션 데이터가 없습니다."}

    try:
        target_expiry, calls, puts, metric_col, call_metric_sum, put_metric_sum = _pick_best_expiry_chain(
            ticker, expirations, selected_expiry
        )
    except Exception as e:
        return {"error": f"옵션 체인 조회 중 오류: {e}"}

    if calls.empty and puts.empty:
        return {"error": f"{ticker_symbol}의 {target_expiry} 옵션 체인 데이터가 비어 있습니다."}

    strikes = sorted(set(calls["strike"].tolist() + puts["strike"].tolist()))
    if not strikes:
        return {"error": "유효한 행사가 데이터가 없습니다."}

    pain_rows = []
    for spot_price in strikes:
        call_loss = (
            (spot_price - calls.loc[calls["strike"] < spot_price, "strike"])
            * calls.loc[calls["strike"] < spot_price, metric_col]
        ).sum()
        put_loss = (
            (puts.loc[puts["strike"] > spot_price, "strike"] - spot_price)
            * puts.loc[puts["strike"] > spot_price, metric_col]
        ).sum()
        total_pain = float(call_loss + put_loss)
        if math.isfinite(total_pain):
            pain_rows.append((spot_price, total_pain))

    if not pain_rows:
        return {"error": "Max Pain 계산에 필요한 유효 데이터가 부족합니다."}

    max_pain_price, _ = min(pain_rows, key=lambda row: row[1])
    disparity_rate = ((max_pain_price - current_price) / current_price) * 100 if current_price else None

    pcr_value = (put_metric_sum / call_metric_sum) if call_metric_sum > 0 else None

    # ATM IV: nearest strike to current price.
    atm_strike = min(strikes, key=lambda s: abs(s - current_price))
    iv_values = []
    iv_values.extend(calls.loc[calls["strike"] == atm_strike, "impliedVolatility"].dropna().tolist())
    iv_values.extend(puts.loc[puts["strike"] == atm_strike, "impliedVolatility"].dropna().tolist())
    atm_iv = (sum(iv_values) / len(iv_values) * 100) if iv_values else None

    # Chart keeps nearby strikes for readability.
    lower_chart = current_price * 0.8
    upper_chart = current_price * 1.2
    chart_strikes = [s for s in strikes if lower_chart <= s <= upper_chart]
    chart_calls_oi = []
    chart_puts_oi = []
    for strike in chart_strikes:
        call_oi = calls.loc[calls["strike"] == strike, metric_col].sum()
        put_oi = puts.loc[puts["strike"] == strike, metric_col].sum()
        chart_calls_oi.append(int(call_oi) if pd.notna(call_oi) else 0)
        chart_puts_oi.append(int(put_oi) if pd.notna(put_oi) else 0)

    return {
        "ticker": ticker_symbol,
        "calc_version": "v3_prompt_aligned",
        "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "price_source": "history_close_1d",
        "current_price": _safe_round(current_price, 2),
        "expiry_date": target_expiry,
        "available_expirations": expirations,
        "metric_source": metric_col,
        "max_pain_price": _safe_round(max_pain_price, 2),
        "disparity_rate": _safe_round(disparity_rate, 2),
        "pcr_value": _safe_round(pcr_value, 2),
        "atm_iv": _safe_round(atm_iv, 2),
        "atm_strike": _safe_round(atm_strike, 2),
        "meta": {
            "total_call_metric": int(call_metric_sum),
            "total_put_metric": int(put_metric_sum),
            "strike_count": len(strikes),
            "pain_points": len(pain_rows),
        },
        "chart_data": {
            "strikes": chart_strikes,
            "calls_oi": chart_calls_oi,
            "puts_oi": chart_puts_oi,
        },
    }


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)

    def log_message(self, fmt, *args):
        msg = str(args[0]) if args else ""
        if "data.js" in msg or "/api/maxpain" in msg or "/api/ping" in msg:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] {msg}")

    def end_headers(self):
        path_only = urlparse(self.path).path
        if (
            path_only.endswith("data.js")
            or path_only.endswith(".js")
            or path_only.endswith(".css")
            or path_only.endswith(".html")
            or path_only == "/"
        ):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def _write_json(self, payload, status=200):
        safe_payload = sanitize_for_json(payload)
        body = json.dumps(safe_payload, ensure_ascii=False, allow_nan=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        parsed = urlparse(self.path)
        if parsed.path in ["/api/maxpain", "/api/ping"]:
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        super().do_OPTIONS()

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/ping":
            self._write_json({"status": "ok", "message": "Server is running"})
            return

        if parsed.path == "/api/maxpain":
            params = parse_qs(parsed.query)
            ticker = (params.get("ticker", [""])[0] or "").strip().upper()
            expiry = (params.get("expiry", [""])[0] or "").strip()
            if not ticker:
                self._write_json({"error": "티커를 입력해 주세요."}, status=400)
                return
            result = calculate_max_pain_payload(ticker, expiry if expiry else None)
            status = 400 if "error" in result else 200
            self._write_json(result, status=status)
            return

        super().do_GET()


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


def main():
    print(
        f"""
+--------------------------------------------------+
|     거인의 어깨 - 매크로 대시보드 서버            |
|     Auto-Refresh: {REFRESH_INTERVAL // 60}분 주기                      |
+--------------------------------------------------+
"""
    )

    refresh_thread = threading.Thread(target=background_refresh, daemon=True)
    refresh_thread.start()
    print(f"✔ {REFRESH_INTERVAL // 60}분 주기 자동 갱신 활성화")

    print("🔄 초기 데이터 수집 시작... (백그라운드)")
    threading.Thread(target=run_scraper, daemon=True).start()

    with ThreadedTCPServer(("", PORT), QuietHandler) as httpd:
        url = f"http://127.0.0.1:{PORT}"
        print(f"🌐 대시보드: {url}")
        print("   종료: Ctrl+C\n")
        if AUTO_OPEN_BROWSER:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n서버를 종료합니다.")
            httpd.shutdown()


if __name__ == "__main__":
    main()
