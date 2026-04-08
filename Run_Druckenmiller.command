#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

echo "======================================"
echo "Druckenmiller 272 Dashboard Updater"
echo "======================================"
echo "Fetching latest market data from Yahoo Finance..."
python3 scraper.py

echo "Data fetch complete! Opening Dashboard..."
open index.html
