"""
Stanley Dashboard - Auto-Refresh Server
=========================================
HTTP 서버 + 백그라운드 스레드에서 5분마다 scraper.py 자동 실행.
data.js를 갱신하여 프론트엔드가 최신 데이터를 받을 수 있도록 합니다.
"""

import http.server
import socketserver
import threading
import time
import os
import sys
import webbrowser
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs

import pandas as pd
import yfinance as yf

# 서버 설정
PORT = 8080
REFRESH_INTERVAL = 60  # 1분 (초)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AUTO_OPEN_BROWSER = os.getenv("STANLEY_NO_BROWSER", "").lower() not in {"1", "true", "yes", "on"}

def run_scraper():
    """scraper.py의 main() 함수를 호출하여 data.js를 갱신합니다."""
    try:
        # scraper 모듈을 동적 임포트
        sys.path.insert(0, SCRIPT_DIR)
        import scraper
        # 모듈 리로드 (이전 실행 캐시 방지)
        import importlib
        importlib.reload(scraper)
        
        print(f"\n{'='*50}")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 스크래핑 시작...")
        print(f"{'='*50}")
        scraper.main()
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ 데이터 갱신 완료!")
    except Exception as e:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ❌ 스크래핑 오류: {e}")

def background_refresh():
    """1분마다 스크래퍼를 실행하는 백그라운드 루프."""
    while True:
        time.sleep(REFRESH_INTERVAL)
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ⏰ {REFRESH_INTERVAL // 60}분 주기 자동 갱신 시작")
        run_scraper()

def calculate_max_pain_payload(ticker_symbol, selected_expiry=None):
    ticker_symbol = ticker_symbol.strip().upper()
    if not ticker_symbol:
        return {"error": "티커를 입력해 주세요."}

    ticker = yf.Ticker(ticker_symbol)

    try:
        history = ticker.history(period="1d")
        if history.empty:
            return {"error": f"{ticker_symbol}의 가격 데이터를 불러올 수 없습니다."}
        current_price = float(history["Close"].iloc[-1])
    except Exception as e:
        return {"error": f"가격 데이터 조회 중 오류: {e}"}

    try:
        expirations = list(ticker.options)
    except Exception as e:
        return {"error": f"만기일 조회 중 오류: {e}"}

    if not expirations:
        return {"error": f"{ticker_symbol}의 옵션 만기일 데이터가 없습니다."}

    target_expiry = selected_expiry if selected_expiry in expirations else expirations[0]

    try:
        chain = ticker.option_chain(target_expiry)
        calls = chain.calls.copy()
        puts = chain.puts.copy()
    except Exception as e:
        return {"error": f"옵션 체인 조회 중 오류: {e}"}

    if calls.empty and puts.empty:
        return {"error": f"{ticker_symbol}의 {target_expiry} 옵션 체인 데이터가 비어 있습니다."}

    calls["openInterest"] = pd.to_numeric(calls.get("openInterest"), errors="coerce").fillna(0)
    puts["openInterest"] = pd.to_numeric(puts.get("openInterest"), errors="coerce").fillna(0)

    strikes = sorted(set(calls.get("strike", pd.Series(dtype=float)).tolist() + puts.get("strike", pd.Series(dtype=float)).tolist()))
    if not strikes:
        return {"error": "유효한 행사가 데이터가 없습니다."}

    pain_rows = []
    for spot in strikes:
        call_loss = ((spot - calls.loc[calls["strike"] < spot, "strike"]) * calls.loc[calls["strike"] < spot, "openInterest"]).sum()
        put_loss = ((puts.loc[puts["strike"] > spot, "strike"] - spot) * puts.loc[puts["strike"] > spot, "openInterest"]).sum()
        pain_rows.append((spot, float(call_loss + put_loss)))

    max_pain_price, _ = min(pain_rows, key=lambda row: row[1])
    disparity_rate = ((max_pain_price - current_price) / current_price) * 100 if current_price else 0

    total_call_oi = float(calls["openInterest"].sum()) if not calls.empty else 0.0
    total_put_oi = float(puts["openInterest"].sum()) if not puts.empty else 0.0
    pcr_value = (total_put_oi / total_call_oi) if total_call_oi > 0 else 0.0

    iv_values = []
    lower_iv = current_price * 0.95
    upper_iv = current_price * 1.05
    if "impliedVolatility" in calls:
        iv_values.extend(pd.to_numeric(calls.loc[(calls["strike"] >= lower_iv) & (calls["strike"] <= upper_iv), "impliedVolatility"], errors="coerce").dropna().tolist())
    if "impliedVolatility" in puts:
        iv_values.extend(pd.to_numeric(puts.loc[(puts["strike"] >= lower_iv) & (puts["strike"] <= upper_iv), "impliedVolatility"], errors="coerce").dropna().tolist())
    atm_iv = (sum(iv_values) / len(iv_values) * 100) if iv_values else 0.0

    lower_chart = current_price * 0.8
    upper_chart = current_price * 1.2
    chart_strikes = [s for s in strikes if lower_chart <= s <= upper_chart]
    chart_calls_oi = []
    chart_puts_oi = []
    for strike in chart_strikes:
        call_oi = calls.loc[calls["strike"] == strike, "openInterest"].sum()
        put_oi = puts.loc[puts["strike"] == strike, "openInterest"].sum()
        chart_calls_oi.append(int(call_oi) if pd.notna(call_oi) else 0)
        chart_puts_oi.append(int(put_oi) if pd.notna(put_oi) else 0)

    return {
        "ticker": ticker_symbol,
        "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "current_price": round(current_price, 2),
        "expiry_date": target_expiry,
        "available_expirations": expirations,
        "max_pain_price": round(float(max_pain_price), 2),
        "disparity_rate": round(float(disparity_rate), 2),
        "pcr_value": round(float(pcr_value), 2),
        "atm_iv": round(float(atm_iv), 2),
        "chart_data": {
            "strikes": chart_strikes,
            "calls_oi": chart_calls_oi,
            "puts_oi": chart_puts_oi
        }
    }

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """로그를 줄인 HTTP 핸들러."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)
    
    def log_message(self, format, *args):
        # data.js 요청만 로그 (나머지 정적 파일 로그 생략)
        if 'data.js' in str(args[0]) or '/api/maxpain' in str(args[0]):
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"[{timestamp}] 📡 {args[0]}")

    def end_headers(self):
        # data.js에 대해 캐시 방지 헤더 추가
        path_only = urlparse(self.path).path
        if (
            path_only.endswith('data.js')
            or path_only.endswith('.js')
            or path_only.endswith('.css')
            or path_only.endswith('.html')
            or path_only == '/'
        ):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def _write_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
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
        if parsed.path == "/api/maxpain":
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

def main():
    print(f"""
╔══════════════════════════════════════════════════╗
║     거인의 어깨 - 매크로 대시보드 서버           ║
║     Auto-Refresh: {REFRESH_INTERVAL // 60}분 주기                        ║
╚══════════════════════════════════════════════════╝
    """)

    # 1) 백그라운드 자동 갱신 스레드 시작
    refresh_thread = threading.Thread(target=background_refresh, daemon=True)
    refresh_thread.start()
    print(f"🔄 {REFRESH_INTERVAL // 60}분 주기 자동 갱신 활성화됨")

    # 2) 서버 시작 시 즉시 1회 초동 스크래핑을 백그라운드에서 실행
    # (서버 응답성을 위해 백그라운드로 전환하여 즉각적인 페이지 접속이 가능하게 함)
    print("🚀 초기 데이터 수집 중... (백그라운드 실행)")
    initial_scraper_thread = threading.Thread(target=run_scraper, daemon=True)
    initial_scraper_thread.start()

    # 3) HTTP 서버 시작
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        url = f"http://localhost:8080"
        print(f"🌐 대시보드: {url}")
        print(f"   종료: Ctrl+C\n")
        
        # 브라우저 자동 오픈
        if AUTO_OPEN_BROWSER:
            webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n서버를 종료합니다.")
            httpd.shutdown()

if __name__ == "__main__":
    main()
