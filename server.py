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
from datetime import datetime

# 서버 설정
PORT = 8080
REFRESH_INTERVAL = 60  # 1분 (초)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

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

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """로그를 줄인 HTTP 핸들러."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)
    
    def log_message(self, format, *args):
        # data.js 요청만 로그 (나머지 정적 파일 로그 생략)
        if 'data.js' in str(args[0]):
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"[{timestamp}] 📡 data.js 요청 → 최신 데이터 응답")

    def end_headers(self):
        # data.js에 대해 캐시 방지 헤더 추가
        if self.path.endswith('data.js'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

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
        webbrowser.open(url)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n서버를 종료합니다.")
            httpd.shutdown()

if __name__ == "__main__":
    main()
