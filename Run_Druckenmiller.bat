@echo off
cd /d "%~dp0"

echo ======================================
echo Druckenmiller 272 Dashboard Updater
echo ======================================
echo Fetching latest market data from Yahoo Finance...
python scraper.py

echo Data fetch complete! Opening Dashboard...
start index.html
pause
