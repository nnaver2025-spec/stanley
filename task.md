# 작업 기록

## 2026-04-17 scraper.py 정적 점검

- 확인 범위: `AGENT_GUIDE.md`, `scraper.py`
- 발견한 문제 후보: `scraper.py`가 `data.js`를 직접 열어 덮어쓴다.
- 근거: `main()` 마지막에서 `open(output_path, 'w')`로 기존 `data.js`를 바로 truncate한 뒤 JS 문자열을 기록한다.
- 영향: `server.py`가 백그라운드에서 주기적으로 scraper를 실행하는 동안 브라우저가 동시에 `data.js`를 요청하면, 부분 작성된 파일을 읽어 `window.DASHBOARD_DATA` 파싱 실패나 일시적인 빈 화면/로딩 실패가 발생할 수 있다.
- 권장 후속 작업: 임시 파일에 먼저 쓰고 `os.replace()`로 교체하는 atomic write 방식으로 바꾸는 것이 안전하다.
- 검증: 코드 경로 정적 확인만 수행했다. 런타임 재현 테스트는 하지 않았다.
