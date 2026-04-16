"""
Stanley Dashboard - Professional analytical server for US Stock Options and Macro Indicators.
- Serves static files from the current directory.
- Exposes High-Quality Max Pain API: /api/maxpain (with MaxPain.com fallback).
- Scraper status tracking and atomic data generation.
"""

import http.server
import json
import math
import os
import re
import socketserver
import sys
import threading
import time
import webbrowser
from datetime import datetime
from urllib.parse import parse_qs, urlparse

import pandas as pd
import requests
import yfinance as yf

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", line_buffering=True)
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", line_buffering=True)

# Configuration
PORT = 8080
REFRESH_INTERVAL = 60  # Background scraper interval in seconds
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AUTO_OPEN_BROWSER = os.getenv("STANLEY_NO_BROWSER", "").lower() not in {"1", "true", "yes", "on"}

# Scraper State
SCRAPER_RUNNING = False
SCRAPER_LOCK = threading.Lock()


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
    return value


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
    """Executes the external scraper logic safely within a background thread."""
    global SCRAPER_RUNNING
    with SCRAPER_LOCK:
        if SCRAPER_RUNNING:
            return
        SCRAPER_RUNNING = True

    try:
        sys.path.insert(0, SCRIPT_DIR)
        import importlib
        import scraper

        importlib.reload(scraper)
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"\n[{timestamp}] 🔄 Background Scraping Started...")
        scraper.main()
        print(f"[{timestamp}] ✅ Data Generation Complete.")
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ Scraper Error: {e}")
    finally:
        with SCRAPER_LOCK:
            SCRAPER_RUNNING = False


def background_refresh():
    """Infinite loop for automatic data updates."""
    while True:
        time.sleep(REFRESH_INTERVAL)
        run_scraper()


def fetch_alternative_options_data(ticker_symbol):
    """
    Fetches high-quality option data from MaxPain.com (Lambda API).
    Parses OCC tickers for expiration dates and strikes.
    """
    ticker_symbol = ticker_symbol.strip().upper()
    try:
        url = f"https://hcapr4ndhwksq5dq7ird3yujpq0edbbt.lambda-url.us-east-1.on.aws/api/options/straddle/{ticker_symbol}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        if not data or "straddles" not in data or not data["straddles"]:
            return None

        expiries = set()
        for s in data["straddles"]:
            ot = s.get("ot", "")
            if not ot:
                continue

            # OCC format: SYMBOL + YYMMDD + C/P + STRIKE
            m = re.search(r"(\d{6})([CP])(\d{8})", ot)
            if m:
                yymmdd, _, strike_raw = m.groups()
                date_str = f"20{yymmdd[0:2]}-{yymmdd[2:4]}-{yymmdd[4:6]}"
                s["parsed_date"] = date_str
                s["parsed_strike"] = float(strike_raw) / 1000.0
                expiries.add(date_str)

        return {
            "source": "MaxPain.com",
            "stock_price": data.get("stockPrice"),
            "expiries": sorted(list(expiries)),
            "raw_data": data["straddles"],
        }
    except Exception as e:
        print(f"Error fetching alt data for {ticker_symbol}: {e}")
        return None


def calculate_max_pain_payload(ticker_symbol, selected_expiry=None):
    """
    Calculates Max Pain value and returns persona-based AI analysis.
    - Tries High Quality MaxPain.com data first.
    - Falls back to yfinance.
    """
    ticker_symbol = (ticker_symbol or "").strip().upper()
    if not ticker_symbol:
        return {"error": "티커를 입력해 주세요."}

    # --- 1. Attempt High Quality Data Fetch ---
    alt_data = fetch_alternative_options_data(ticker_symbol)
    data_source = "Yahoo Finance"
    current_price = 0
    expirations = []
    metric_col = "openInterest"

    if alt_data and alt_data["raw_data"]:
        data_source = alt_data["source"]
        current_price = alt_data["stock_price"]
        expirations = alt_data["expiries"]

        target_expiry = (
            selected_expiry
            if selected_expiry in expirations
            else (expirations[0] if expirations else None)
        )
        if not target_expiry:
            return {"error": f"{ticker_symbol}의 유효한 만기일이 없습니다."}

        relevant = [s for s in alt_data["raw_data"] if s.get("parsed_date") == target_expiry]
        calls_list = []
        puts_list = []
        for s in relevant:
            strike = s.get("parsed_strike")
            if strike is None:
                continue
            calls_list.append(
                {
                    "strike": strike,
                    "openInterest": s.get("coi", 0),
                    "volume": s.get("cv", 0),
                    "impliedVolatility": s.get("civ", 0),
                }
            )
            puts_list.append(
                {
                    "strike": strike,
                    "openInterest": s.get("poi", 0),
                    "volume": s.get("pv", 0),
                    "impliedVolatility": s.get("piv", 0),
                }
            )
        calls = pd.DataFrame(calls_list)
        puts = pd.DataFrame(puts_list)
    else:
        # --- 2. Fallback to yfinance ---
        ticker = yf.Ticker(ticker_symbol)
        try:
            hist = ticker.history(period="1d")
            if hist.empty:
                return {"error": f"{ticker_symbol} 가격 조회 실패"}
            current_price = float(hist["Close"].iloc[-1])
            expirations = list(ticker.options)
            if not expirations:
                return {"error": "옵션 데이터 없음"}

            target_expiry, calls, puts, metric_col, _, _ = _pick_best_expiry_chain(
                ticker, expirations, selected_expiry
            )
        except Exception as e:
            return {"error": f"데이터 로드 오류: {e}"}

    if calls.empty and puts.empty:
        return {"error": "옵션 데이터를 구성할 수 없습니다."}

    # --- 3. Calculations ---
    calls[metric_col] = pd.to_numeric(calls.get(metric_col), errors="coerce").fillna(0)
    puts[metric_col] = pd.to_numeric(puts.get(metric_col), errors="coerce").fillna(0)

    strikes = sorted(set(calls["strike"].tolist() + puts["strike"].tolist()))
    pain_rows = []

    # Restrict strikes to prevent outliers (70% - 130% range)
    reasonable_lower, reasonable_upper = current_price * 0.7, current_price * 1.3
    filtered_strikes = [s for s in strikes if reasonable_lower <= s <= reasonable_upper]
    if not filtered_strikes:
        filtered_strikes = strikes  # fallback

    for spot in filtered_strikes:
        call_loss = (
            (spot - calls.loc[calls["strike"] < spot, "strike"])
            * calls.loc[calls["strike"] < spot, metric_col]
        ).sum()
        put_loss = (
            (puts.loc[puts["strike"] > spot, "strike"] - spot)
            * puts.loc[puts["strike"] > spot, metric_col]
        ).sum()
        pain_rows.append((spot, float(call_loss + put_loss)))

    max_pain_price, _ = min(pain_rows, key=lambda r: r[1])

    # PCR & IV
    total_call_metric = calls[metric_col].sum()
    total_put_metric = puts[metric_col].sum()
    pcr_value = total_put_metric / total_call_metric if total_call_metric > 0 else 0

    iv_vals = []
    atm_l, atm_u = current_price * 0.95, current_price * 1.05
    if "impliedVolatility" in calls:
        iv_vals.extend(
            pd.to_numeric(
                calls.loc[(calls["strike"] >= atm_l) & (calls["strike"] <= atm_u), "impliedVolatility"],
                errors="coerce",
            )
            .dropna()
            .tolist()
        )
    if "impliedVolatility" in puts:
        iv_vals.extend(
            pd.to_numeric(
                puts.loc[(puts["strike"] >= atm_l) & (puts["strike"] <= atm_u), "impliedVolatility"],
                errors="coerce",
            )
            .dropna()
            .tolist()
        )

    # Fix IV Scale
    if not iv_vals:
        atm_iv_pct = 0
    else:
        avg_raw = sum(iv_vals) / len(iv_vals)
        atm_iv_pct = avg_raw * 100 if avg_raw < 5 else avg_raw

    # Chart Data (80% - 120% range)
    cl, cu = current_price * 0.8, current_price * 1.2
    chart_strikes = [s for s in strikes if cl <= s <= cu]
    c_oi, p_oi = [], []
    for s in chart_strikes:
        c_oi.append(int(calls.loc[calls["strike"] == s, metric_col].sum()))
        p_oi.append(int(puts.loc[puts["strike"] == s, metric_col].sum()))

    disparity_rate = ((max_pain_price - current_price) / current_price) * 100

    return {
        "ticker": ticker_symbol,
        "calc_version": "v3_merged",
        "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "current_price": _safe_round(current_price),
        "expiry_date": target_expiry,
        "available_expirations": expirations,
        "data_source": data_source,
        "max_pain_price": _safe_round(max_pain_price),
        "disparity_rate": _safe_round(disparity_rate),
        "pcr_value": _safe_round(pcr_value),
        "atm_iv": _safe_round(atm_iv_pct, 1),
        "is_reliable": True,
        "chart_data": {"strikes": chart_strikes, "calls_oi": c_oi, "puts_oi": p_oi},
        "ai_analysis": generate_persona_opinions(
            current_price, max_pain_price, pcr_value, atm_iv_pct, disparity_rate
        ),
    }


def generate_persona_opinions(price, max_pain, pcr, iv, disparity):
    """Generates three distinct AI viewpoints based on options data."""

    # 1. Professional Analyst
    prof_tone = "neutral"
    if abs(disparity) > 5:
        prof_msg = f"현재가는 Max Pain($ {max_pain}) 대비 {abs(disparity):.1f}% 괴리되어 있습니다. 통계적으로 만기 시점에는 이 지점으로의 '회귀 중력'이 작용할 가능성이 높으므로, 기관의 포지셔닝을 고려한 보수적 대응이 필요합니다."
        if disparity < 0:
            prof_tone = "bearish"
        else:
            prof_tone = "bullish"
    else:
        prof_msg = f"현재가가 Max Pain과 밀접하게 붙어 있는 '핀닝(Pinning)' 국면입니다. 특별한 모멘텀이 없다면 현재가 수준에서 변동성이 억제된 채 만기를 맞이할 확률이 높습니다."

    # 2. Aggressive Day Trader
    trader_tone = "neutral"
    if iv > 40:
        trader_msg = f"변동성(IV)이 {iv:.1f}%로 매우 높습니다! 이는 옵션 프리미엄이 비싸다는 뜻이며, 급격한 가격 변동을 이용한 변동성 매도 전략이나 돌파 매매에 적합한 환경입니다. 과감한 대응이 수익을 극대화할 수 있습니다."
        trader_tone = "bullish"  # Assuming volatility = opportunity
    else:
        trader_msg = f"변동성이 낮아 프리미엄이 저렴합니다. 방향성이 확실하다면 옵션 매수(Long) 전략으로 레버리지를 극대화하기 좋은 시점입니다. Max Pain 방항으로의 단기 추세 추종을 권장합니다."

    # 3. Conservative Manager
    cons_tone = "neutral"
    if iv > 50 or abs(disparity) > 10:
        cons_msg = f"시장 변동성과 가격 괴리가 모두 과도합니다. 자산 보호를 위해 신규 진입을 자제하고, 기존 포지션은 수익 실현을 통해 현금 비중을 높여야 합니다. 무리한 추격보다는 안정성을 최우선으로 하십시오."
        cons_tone = "bearish"  # Caution is slightly bearish/neutral
    else:
        cons_msg = f"지표들이 비교적 안정적인 범위 내에 있습니다. 급격한 변화보다는 만기일까지의 시간 가치 하락(Theta)을 염두에 둔 안정적인 전략이 유효하며, 분할 진입을 통해 리스크를 분산하십시오."

    return {
        "professional": {"name": "냉철한 전문 분석가", "opinion": prof_msg, "tone": prof_tone},
        "trader": {"name": "공격적인 데이트레이더", "opinion": trader_msg, "tone": trader_tone},
        "manager": {"name": "보수적인 자산가", "opinion": cons_msg, "tone": cons_tone},
    }


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)

    def log_message(self, fmt, *args):
        msg = str(args[0])
        if "data.js" in msg or "/api/" in msg:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 📡 {msg}")

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
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        parsed = urlparse(self.path)
        if parsed.path in ["/api/maxpain", "/api/ping", "/api/status"]:
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

        if parsed.path == "/api/status":
            self._write_json(
                {
                    "scraper_running": SCRAPER_RUNNING,
                    "data_exists": os.path.exists(os.path.join(SCRIPT_DIR, "data.js")),
                    "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            )
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
        print(f"🌐 대시보드 서버 실행 중: {url}")
        print("   종료: Ctrl+C\n")
        if AUTO_OPEN_BROWSER:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping...")


if __name__ == "__main__":
    main()
