#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

echo "======================================"
echo "Druckenmiller 272 Dashboard Server"
echo "======================================"
echo "Starting server (auto refresh + options API)..."
python3 server.py
