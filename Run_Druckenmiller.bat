@echo off
cd /d "%~dp0"

echo ======================================
echo Druckenmiller 272 Dashboard Server
echo ======================================
echo Starting server (auto refresh + options API)...
python server.py
pause
