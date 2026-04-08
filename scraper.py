import yfinance as yf
import pandas as pd
import json
import requests
import os
import io
import re
import urllib.parse
import xml.etree.ElementTree as ET
import hmac
import hashlib
import base64
from datetime import datetime, timedelta
import time
import warnings

warnings.filterwarnings('ignore')

YIELD_SERIES = {
    "TVC:US10Y",
    "TVC:US02Y",
    "TVC:US30Y",
    "TVC:DE10Y",
    "TVC:IT10Y",
    "TVC:JP10Y",
    "TVC:GB10Y",
    "TVC:KR10Y",
}

MONTHLY_FRED_SERIES = {
    "TVC:IT10Y",
    "TVC:KR10Y",
}

CUSTOM_YIELD_SOURCES = {
    "TVC:DE10Y": {
        "kind": "bundesbank_csv",
        "url": "https://api.statistiken.bundesbank.de/rest/download/BBSSY/D.REN.EUR.A630.000000WT1010.A?format=csv&lang=en",
    },
    "TVC:GB10Y": {
        "kind": "boe_html",
        "series_code": "IUDMNPY",
    },
    "TVC:JP10Y": {
        "kind": "mof_csv",
        "url": "https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/historical/jgbcme_all.csv",
        "current_url": "https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/jgbcme.csv",
    },
    "TVC:KR10Y": {
        "kind": "bok_ecos_json",
        "stat_code": "817Y002",
        "item_code": "010210000",
    },
}

# Mapping between the TradingView/Layout symbols and Yahoo Finance symbols
# If an asset doesn't exist on Yahoo Finance easily, we provide a None or fallback
TICKER_MAP = {
    # Indices
    "SP:SPX": "^GSPC",
    "NASDAQ:NDX": "^NDX",
    "DJ:DJI": "^DJI",
    "RUSSELL:RUT": "^RUT",
    "KRX:KOSPI": "^KS11",
    "KRX:KOSDAQ": "^KQ11",
    "NI225": "^N225",
    "DAX": "^GDAXI",
    "UK100": "^FTSE",
    "HSI": "^HSI",
    "EEM": "EEM",
    "FXI": "FXI",
    "TSX:TSX": "^GSPTSE",
    "PX1": "^FCHI",
    "NIFTY": "^NSEI",
    "IBOV": "^BVSP",
    "BTCUSDT": "BTC-USD",
    "ETHUSDT": "ETH-USD",

    # Commodities
    "TVC:GOLD": "GC=F",
    "TVC:SILVER": "SI=F",
    "COMEX:HG1!": "HG=F",
    "TVC:USOIL": "CL=F",
    "TVC:UKOIL": "BZ=F",
    "NYMEX:NG1!": "NG=F",
    "SGX:FEF1!": "TIO=F", # Iron Ore approximation
    "TVC:PLATINUM": "PL=F",
    "TVC:PALLADIUM": "PA=F",
    "CAPITALCOM:ALUMINUM": "ALI=F",
    "ICEUS:SB1!": "SB=F",
    "ICEUS:KC1!": "KC=F",
    "CBOT:ZW1!": "ZW=F",
    "CBOT:ZC1!": "ZC=F",
    "CBOT:ZS1!": "ZS=F",

    # Currencies
    "TVC:DXY": "DX-Y.NYB",
    "FX:EURUSD": "EURUSD=X",
    "FX:USDJPY": "JPY=X",
    "FX:GBPUSD": "GBPUSD=X",
    "FX:AUDUSD": "AUDUSD=X",
    "FX:USDCAD": "CAD=X",
    "FX:USDCHF": "CHF=X",
    "FX:NZDUSD": "NZDUSD=X",
    "FX_IDC:USDKRW": "KRW=X",
    "FX_IDC:USDSGD": "SGD=X",

# Bonds (Use official daily sources where available, monthly FRED as fallback)
    "TVC:US10Y": "^TNX",
    "TVC:US02Y": "FRED:DGS2",
    "TVC:US30Y": "^TYX",
    "TVC:DE10Y": "FRED:IRLTLT01DEM156N",
    "TVC:IT10Y": "FRED:IRLTLT01ITM156N",
    "TVC:JP10Y": "FRED:IRLTLT01JPM156N",
    "TVC:GB10Y": "FRED:IRLTLT01GBM156N",
    "TVC:KR10Y": "FRED:IRLTLT01KRM156N",

    # Sectors / Themes (Already YF symbols)
    "XLK": "XLK",
    "XLF": "XLF",
    "XLE": "XLE",
    "XLV": "XLV",
    "XLI": "XLI",
    "XLY": "XLY",
    "XLP": "XLP",
    "XLB": "XLB",
    "XLU": "XLU",
    "KRE": "KRE",
    "SOXX": "SOXX",
    
    "HYDR": "HYDR",
    "UFO": "UFO",
    "XBI": "XBI",
    "TAN": "TAN",
    "QTUM": "QTUM",
    "WGMI": "WGMI",
    "NUKZ": "NUKZ",
    "LIT": "LIT",
    "LIT": "LIT",
    "DRNZ": "DRNZ",
    
    # Macro Only (for ratios)
    "TLT": "TLT",
    "VUG": "VUG",
    "VTV": "VTV",
    "DXY": "DX-Y.NYB",
    "IEF": "IEF",
    "SHY": "SHY",
    "HYG": "HYG",
    "TNX": "^TNX",
    "IRX": "^IRX",
    "VIX": "^VIX",
    "PCC": None,
    
    # Guru Holdings (Sample Top Picks)
    "MSFT": "MSFT",
    "NVDA": "NVDA",
    "AAPL": "AAPL",
    "AXP": "AXP",
    "BAC": "BAC",
    "KO": "KO",
    "OXY": "OXY",
    "GOOGL": "GOOGL",
    "AMZN": "AMZN",
    "VIST": "VIST",
    "MA": "MA",
    "HLT": "HLT",
    "QSR": "QSR",
    "CMG": "CMG",
    "TSLA": "TSLA",
    "ROKU": "ROKU",
    "COIN": "COIN",
    "PG": "PG",
    "PG": "PG",
    "JNJ": "JNJ",
    "LBTYK": "LBTYK",
    "META": "META",
    "AMAT": "AMAT",
    "MU": "MU",
    "PANW": "PANW",
    "MELI": "MELI",
    "DIS": "DIS",
    "TGT": "TGT",
    "NTRA": "NTRA",
    "INSM": "INSM",
    "RSP": "RSP",
    "TEVA": "TEVA",
    "BN": "BN",
    "UBER": "UBER",
    "CVX": "CVX",
    "MOH": "MOH",
    "LULU": "LULU",
    "SLM": "SLM",
    "BRKR": "BRKR",
    "BABA": "BABA"
}

def get_performance_metrics(hist):
    if hist.empty or len(hist) < 2:
        return None

    current_close = hist['Close'].iloc[-1]
    current_date = hist.index[-1]

    def get_reference_close(target_date):
        ref_hist = hist.loc[hist.index <= target_date]
        if ref_hist.empty:
            return None
        return ref_hist['Close'].iloc[-1]
    
    # 1D
    prev_close = hist['Close'].iloc[-2]
    d1 = ((current_close - prev_close) / prev_close) * 100

    # 5D
    d5_idx = min(len(hist), 6)
    d5_close = hist['Close'].iloc[-d5_idx]
    d5 = ((current_close - d5_close) / d5_close) * 100

    # 1M
    month_ago_close = get_reference_close(current_date - pd.DateOffset(months=1))
    if month_ago_close is not None:
        mtd = ((current_close - month_ago_close) / month_ago_close) * 100
    else:
        mtd = 0.0

    # YTD
    ytd_data = hist[hist.index.year != current_date.year]
    if not ytd_data.empty:
        ytd_close = ytd_data['Close'].iloc[-1]
        ytd = ((current_close - ytd_close) / ytd_close) * 100
    else:
        ytd = 0.0

    # Technical Signals
    # 52W High
    y1_high = hist['Close'].iloc[-252:].max() if len(hist) >= 252 else hist['Close'].max()
    is_52w_high = current_close >= (y1_high * 0.98)
    
    # SMA Cross
    sma50 = hist['Close'].rolling(window=50).mean().iloc[-1] if len(hist) >= 50 else None
    sma200 = hist['Close'].rolling(window=200).mean().iloc[-1] if len(hist) >= 200 else None
    
    signal = ""
    if is_52w_high: signal += "🔥"
    if sma50 and sma200:
        if sma50 > sma200: signal += "⚔️" # Golden Cross
        elif sma50 < sma200: signal += "⚠️" # Death Cross (Warning)

    return {
        "price": f"{current_close:.2f}",
        "idx1D": f"{d1:.2f}",
        "idx5D": f"{d5:.2f}",
        "idxMTD": f"{mtd:.2f}",
        "idxYTD": f"{ytd:.2f}",
        "signal": signal
    }

def add_yield_bp_fields(metrics, current_close, prev_close=None, d5_close=None, mtd_close=None, ytd_close=None, frequency="daily"):
    if metrics is None:
        return None

    def to_bp(reference):
        if reference is None:
            return "-"
        return f"{((current_close - reference) * 100):.1f}"

    metrics["bp1D"] = to_bp(prev_close) if frequency == "daily" else "-"
    metrics["bp5D"] = to_bp(d5_close) if frequency == "daily" else "-"
    metrics["bpMTD"] = to_bp(mtd_close)
    metrics["bpYTD"] = to_bp(ytd_close)
    metrics["change_unit"] = "bp"
    metrics["is_yield"] = True
    metrics["signal"] = ""
    return metrics

def get_yield_performance_metrics(hist):
    metrics = get_performance_metrics(hist)
    if metrics is None:
        return None

    current_close = hist['Close'].iloc[-1]
    prev_close = hist['Close'].iloc[-2]
    d5_idx = min(len(hist), 6)
    d5_close = hist['Close'].iloc[-d5_idx]

    current_date = hist.index[-1]
    mtd_data = hist[hist.index.month != current_date.month]
    mtd_close = mtd_data['Close'].iloc[-1] if not mtd_data.empty else None

    ytd_data = hist[hist.index.year != current_date.year]
    ytd_close = ytd_data['Close'].iloc[-1] if not ytd_data.empty else None

    return add_yield_bp_fields(metrics, current_close, prev_close, d5_close, mtd_close, ytd_close)

def get_monthly_metrics(hist):
    if hist.empty or len(hist) < 2:
        return None

    current_close = hist['Close'].iloc[-1]
    current_date = hist.index[-1]

    prev_month_close = hist['Close'].iloc[-2]
    mom = ((current_close - prev_month_close) / prev_month_close) * 100

    ytd_data = hist[hist.index.year != current_date.year]
    if not ytd_data.empty:
        ytd_close = ytd_data['Close'].iloc[-1]
        ytd = ((current_close - ytd_close) / ytd_close) * 100
    else:
        ytd = 0.0

    return {
        "price": f"{current_close:.2f}",
        "idx1D": "-",
        "idx5D": "-",
        "idxMTD": f"{mom:.2f}",
        "idxYTD": f"{ytd:.2f}",
        "signal": "",
        "frequency": "monthly"
    }

def get_monthly_yield_metrics(hist):
    metrics = get_monthly_metrics(hist)
    if metrics is None:
        return None

    current_close = hist['Close'].iloc[-1]
    prev_month_close = hist['Close'].iloc[-2]
    current_date = hist.index[-1]
    ytd_data = hist[hist.index.year != current_date.year]
    ytd_close = ytd_data['Close'].iloc[-1] if not ytd_data.empty else None

    metrics = add_yield_bp_fields(
        metrics,
        current_close,
        prev_close=None,
        d5_close=None,
        mtd_close=prev_month_close,
        ytd_close=ytd_close,
        frequency="monthly"
    )
    metrics["frequency"] = "monthly"
    return metrics

def normalize_close_frame(df, date_col, value_col):
    result = df[[date_col, value_col]].copy()
    result[date_col] = pd.to_datetime(result[date_col], errors='coerce')
    result[value_col] = pd.to_numeric(result[value_col], errors='coerce')
    result = result.dropna()
    result = result.rename(columns={date_col: 'Date', value_col: 'Close'})
    result = result.set_index('Date').sort_index()
    return result[['Close']]

def fetch_bundesbank_daily_yield(url):
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        text = r.text
        rows = []
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = re.split(r'[;,]', line)
            if len(parts) < 2:
                continue
            date_part = parts[0].strip()
            value_part = parts[1].strip().replace('"', '')
            if re.match(r'^\d{4}-\d{2}-\d{2}$', date_part):
                rows.append((date_part, value_part))
        if not rows:
            return None
        df = pd.DataFrame(rows, columns=['Date', 'Close'])
        return normalize_close_frame(df, 'Date', 'Close')
    except Exception as e:
        print(f"Error fetching Bundesbank daily yield: {e}")
        return None

def fetch_boe_daily_yield(series_code):
    today = datetime.utcnow()
    url = (
        "https://www.bankofengland.co.uk/boeapps/database/fromshowcolumns.asp"
        f"?CSVF=TT&DAT=RNG&FD=1&FM=Jan&FNY=Y&FY=2010"
        f"&Filter=N&FromSeries=1&SeriesCodes={series_code}"
        f"&TD={today.day}&TM={today.strftime('%b')}&TY={today.year}"
        f"&ToSeries=50&Travel=NIxAZxSUx&UsingCodes=Y&VPD=Y&html.x=66&html.y=26&title={series_code}"
    )
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
        r.raise_for_status()
        pattern = re.compile(
            r'<td align="right"\s*>([^<]+)</td><td align="right">\s*([\d.]+)\s*</td>',
            re.IGNORECASE
        )
        rows = pattern.findall(r.text)
        if not rows:
            return None
        df = pd.DataFrame(rows, columns=['Date', 'Close'])
        return normalize_close_frame(df, 'Date', 'Close')
    except Exception as e:
        print(f"Error fetching Bank of England daily yield: {e}")
        return None

def read_mof_csv(url):
    try:
        # Use a reasonable timeout for Ministry of Finance (Japan) CSV fetch
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        content = response.content
    except Exception as e:
        print(f"Error fetching MOF CSV from {url}: {e}")
        return None

    for encoding in (None, "cp932", "shift_jis"):
        for skiprows in (0, 1):
            try:
                read_kwargs = {"skiprows": skiprows}
                if encoding:
                    read_kwargs["encoding"] = encoding
                df = pd.read_csv(io.BytesIO(content), **read_kwargs)
                if any('date' in str(col).lower() for col in df.columns):
                    return df
            except Exception:
                continue
    return None

def fetch_mof_daily_yield(url, maturity='10', current_url=None):
    try:
        df = read_mof_csv(url)
        if df is None:
            return None

        if current_url:
            current_df = read_mof_csv(current_url)
            if current_df is not None:
                df = pd.concat([df, current_df], ignore_index=True)

        date_col = next((col for col in df.columns if 'date' in str(col).lower()), df.columns[0])
        candidate_cols = [col for col in df.columns if maturity in str(col)]
        value_col = None
        for col in candidate_cols:
            normalized = str(col).lower().replace(' ', '')
            if '10' in normalized and ('year' in normalized or 'yr' in normalized):
                value_col = col
                break
        if value_col is None and candidate_cols:
            value_col = candidate_cols[0]
        if value_col is None:
            return None
        df = df.drop_duplicates(subset=[date_col], keep='last')
        return normalize_close_frame(df, date_col, value_col)
    except Exception as e:
        print(f"Error fetching MOF daily yield: {e}")
        return None

def fetch_bok_ecos_daily_yield(stat_code, item_code):
    api_key = os.getenv("ECOS_API_KEY", "sample")
    end_date = datetime.utcnow()
    start_date = (end_date - timedelta(days=400)).strftime("%Y%m%d")
    end_date_str = end_date.strftime("%Y%m%d")
    page_size = 10 if api_key == "sample" else 10000
    start_row = 1
    rows = []
    try:
        while True:
            end_row = start_row + page_size - 1
            url = (
                f"https://ecos.bok.or.kr/api/StatisticSearch/{api_key}/json/kr/{start_row}/{end_row}/"
                f"{stat_code}/D/{start_date}/{end_date_str}/{item_code}"
            )
            r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
            r.raise_for_status()
            payload = r.json()

            if "RESULT" in payload:
                print(f"BOK ECOS returned {payload['RESULT']}")
                return None

            search = payload.get("StatisticSearch", {})
            page_rows = search.get("row", [])
            if not page_rows:
                break

            rows.extend(page_rows)
            total_count = int(search.get("list_total_count", len(rows)))
            if end_row >= total_count:
                break
            start_row = end_row + 1

        if not rows:
            return None

        df = pd.DataFrame(rows).drop_duplicates(subset=["TIME"])
        return normalize_close_frame(df, 'TIME', 'DATA_VALUE')
    except Exception as e:
        print(f"Error fetching BOK ECOS daily yield: {e}")
        return None

def fetch_cnbc_yield(symbol):
    """Fallback fetch for US Treasury yields using CNBC JSON API."""
    url = f"https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols={symbol}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1"
    try:
        # Use headers to avoid 403
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        quote_list = data.get("FormattedQuoteResult", {}).get("FormattedQuote", [])
        if not quote_list:
            return None
        
        quote = quote_list[0]
        price_str = quote.get("last", "0").replace("%", "")
        price = float(price_str)
        
        # Calculate daily change in bp (yield is usually percentage)
        prev_close_str = quote.get("previous_day_closing", "0").replace("%", "")
        prev_close = float(prev_close_str)
        
        bp1D = (price - prev_close) * 100
        
        return {
            "price": f"{price:.3f}",
            "idx1D": f"{quote.get('change_pct', '0').replace('%', '')}",
            "bp1D": f"{bp1D:.1f}",
            "signal": "",
            "is_yield": True,
            "change_unit": "bp",
            "source": "CNBC Fallback"
        }
    except Exception as e:
        print(f"Error fetching CNBC yield {symbol}: {e}")
        return None

def fetch_cnbc_history(symbol):
    """Fetch historical yield data from CNBC GraphQL API as a fallback for FRED."""
    # Persisted Query Hash for getQuoteChartData with 1Y range
    sha256_hash = "9e1670c29a10707c417a1efd327d4b2b1d456b77f1426e7e84fb7d399416bb6b"
    variables = json.dumps({"symbol": symbol, "timeRange": "1Y"})
    extensions = json.dumps({"persistedQuery": {"version": 1, "sha256Hash": sha256_hash}})
    
    encoded_vars = requests.utils.quote(variables)
    encoded_ext = requests.utils.quote(extensions)
    
    url = f"https://webql-redesign.cnbcfm.com/graphql?operationName=getQuoteChartData&variables={encoded_vars}&extensions={encoded_ext}"
    
    try:
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=15)
        r.raise_for_status()
        data = r.json()
        
        bars = data.get("data", {}).get("chartData", {}).get("priceBars", [])
        if not bars:
            return None
            
        rows = []
        for bar in bars:
            t_str = bar.get("tradeTime") # YYYYMMDDHHMMSS
            if not t_str or len(t_str) < 8: continue
            
            date = pd.to_datetime(t_str[:8], format='%Y%m%d')
            close_val = bar.get("close")
            if close_val is None: continue
            
            try:
                # CNBC yields often come with '%' suffix
                if isinstance(close_val, str):
                    close_val = float(close_val.replace('%', ''))
                rows.append({"Date": date, "Close": close_val})
            except:
                continue
                
        if not rows: return None
        
        df = pd.DataFrame(rows).sort_values("Date").drop_duplicates("Date").set_index("Date")
        return df
    except Exception as e:
        print(f"Error fetching CNBC history for {symbol}: {e}")
        return None

def fetch_custom_yield_history(tv_sym):
    config = CUSTOM_YIELD_SOURCES.get(tv_sym)
    if not config:
        return None
    if config["kind"] == "bundesbank_csv":
        return fetch_bundesbank_daily_yield(config["url"])
    if config["kind"] == "boe_html":
        return fetch_boe_daily_yield(config["series_code"])
    if config["kind"] == "mof_csv":
        return fetch_mof_daily_yield(config["url"], current_url=config.get("current_url"))
    if config["kind"] == "bok_ecos_json":
        return fetch_bok_ecos_daily_yield(config["stat_code"], config["item_code"])
    return None

def get_fred_data(series_id):
    """Fetch CSV data from FRED and return as a DataFrame compatible with get_ratio_stats."""
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
    try:
        # FRED API can be slow/unreliable; use a shorter 5s timeout
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        df = pd.read_csv(io.StringIO(response.text))
        df['observation_date'] = pd.to_datetime(df['observation_date'])
        df.set_index('observation_date', inplace=True)
        # Handle FRED missing values (sent as '.')
        df = df[df[series_id] != '.']
        df[series_id] = pd.to_numeric(df[series_id])
        # Rename the series column to 'Close' for get_ratio_stats compatibility
        df.columns = ['Close']
        return df
    except Exception as e:
        print(f"Error fetching FRED {series_id}: {e}")
        return None

def calculate_macro_stats(live_data, all_hist):
    # Copper / Gold Ratio
    cu = all_hist.get("COMEX:HG1!")
    au = all_hist.get("TVC:GOLD")
    
    # SPY / TLT Ratio
    spy = all_hist.get("SP:SPX")
    tlt = all_hist.get("TLT")

    # Growth / Value
    growth = all_hist.get("VUG")
    value = all_hist.get("VTV")
    
    # NEW: Institutional Pulse
    dxy = all_hist.get("DXY")
    ief = all_hist.get("IEF")
    shy = all_hist.get("SHY")
    hyg = all_hist.get("HYG")

    macro = {}
    
    def get_ratio_stats(h1, h2, scale=1.0, reverse_trend=False, is_spread=False):
        if h1 is None or h1.empty:
            return None
        
        if h2 is not None:
            if h2.empty: return None
            merged_hist = pd.merge(h2[['Close']], h1[['Close']], left_index=True, right_index=True, suffixes=('_h2', '_h1'))
            if merged_hist.empty: return None
            
            if is_spread:
                ratios = (merged_hist['Close_h1'] - merged_hist['Close_h2']) * scale
            else:
                ratios = (merged_hist['Close_h1'] / merged_hist['Close_h2']) * scale
        else:
            ratios = h1['Close'] * scale

        current = ratios.iloc[-1]
        sma10 = ratios.rolling(window=10).mean().iloc[-1] if len(ratios) >= 10 else current
        
        trend = "up" if current > sma10 else "down"
        if reverse_trend:
            trend = "down" if current > sma10 else "up"
            
        return {
            "val": round(float(current), 4),
            "sma10": round(float(sma10), 4),
            "trend": trend
        }

    macro["cu_au"] = get_ratio_stats(cu, au, 1000)
    macro["spy_tlt"] = get_ratio_stats(spy, tlt)
    macro["growth_value"] = get_ratio_stats(growth, value)
    
    macro["liquidity"] = get_ratio_stats(dxy, None, 1.0, reverse_trend=True) # DXY Up = Liquidity Down
    
    # Deep Macro - Yield Curves from FRED or Manual Calculation
    t10y2y = get_fred_data("T10Y2Y")
    t10y3m = get_fred_data("T10Y3M")
    
    if t10y2y is not None and not t10y2y.empty:
        macro["yield_curve_2y"] = get_ratio_stats(t10y2y, None)
    else:
        # Manual fallback from live_data
        y10 = float(live_data.get("TVC:US10Y", {}).get("price", 0))
        y02 = float(live_data.get("TVC:US02Y", {}).get("price", 0))
        if y10 and y02:
            macro["yield_curve_2y"] = {
                "val": round(y10 - y02, 4),
                "sma10": round(y10 - y02, 4), # Static for now
                "trend": "up" if y10 > y02 else "down"
            }
        else:
            macro["yield_curve_2y"] = None

    if t10y3m is not None and not t10y3m.empty:
        macro["yield_curve_3m"] = get_ratio_stats(t10y3m, None)
    else:
        # Manual fallback from live_data
        y10 = float(live_data.get("TVC:US10Y", {}).get("price", 0))
        y3m = float(live_data.get("TVC:US3M", {}).get("price", 0)) if "TVC:US3M" in live_data else None
        if y10 and y3m:
            macro["yield_curve_3m"] = {
                "val": round(y10 - y3m, 4),
                "sma10": round(y10 - y3m, 4),
                "trend": "up" if y10 > y3m else "down"
            }
        else:
            macro["yield_curve_3m"] = None
        
    macro["credit_stress"] = get_ratio_stats(hyg, ief) # Risk-on if rising
        
    return macro

def get_cnn_fear_greed():
    """Fetch the current CNN Fear & Greed Index from the official dataviz endpoint."""
    try:
        url = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://edition.cnn.com/",
            "Origin": "https://edition.cnn.com"
        }
        r = requests.get(url, headers=headers, timeout=5)
        if r.status_code == 200:
            data = r.json()
            fng = data.get("fear_and_greed", {})
            
            # Extract Put/Call Ratio component
            pcc_series = data.get("put_call_options", {}).get("data", [])
            latest_pcc = pcc_series[-1].get("y") if pcc_series else None

            return {
                "val": round(float(fng.get("score", 0)), 1),
                "pcc": latest_pcc,
                "status": fng.get("rating", "unavailable"),
                "timestamp": fng.get("timestamp", ""),
                "previous_close": round(float(fng.get("previous_close", 0)), 1),
                "previous_1_week": round(float(fng.get("previous_1_week", 0)), 1),
                "previous_1_month": round(float(fng.get("previous_1_month", 0)), 1),
                "previous_1_year": round(float(fng.get("previous_1_year", 0)), 1),
                "available": True
            }
        print(f"Error fetching CNN F&G: status {r.status_code}")
    except Exception as e:
        print(f"Error fetching CNN F&G: {e}")
    return {
        "val": None,
        "pcc": None,
        "status": "unavailable",
        "timestamp": "",
        "available": False
    }

def generate_ai_analysis(event):
    """실제값과 예측값을 비교하여 AI 분석 및 심리 상태를 동적으로 생성합니다."""
    actual = event.get("actual")
    forecast = event.get("forecast")
    title = event.get("title")
    
    if actual is None:
        return None, None
        
    # 간단한 값 추출 로직 (%, K, B, T 등 제거)
    try:
        def to_num(s):
            if s is None: return None
            return float(s.replace('%', '').replace('K', '').replace('B', '').replace('T', '').replace(',', ''))
        
        a_val = to_num(actual)
        f_val = to_num(forecast)
    except:
        return "중립적 발표", ["발표 데이터의 구체적인 영향력을 분석 중입니다."]

    # 기본 로직: 지표의 성격에 따라 다를 수 있으나 일반적인 '높으면 긍정' 케이스 가정
    # (실업률 등 반대인 경우는 제목 키워드로 판단)
    is_inverse = any(k in title for k in ["실업", "청구건수", "물가", "인플레이션", "CPI"])
    
    if f_val is None:
        sentiment = "중립적 발표"
        summary = [f"{title} 지표가 {actual} 수준으로 발표되었습니다.", "이전 수치와 비교하여 시장의 방향성을 탐색하고 있습니다."]
    elif (a_val > f_val and not is_inverse) or (a_val < f_val and is_inverse):
        sentiment = "긍정적 발표"
        summary = [f"예상치({forecast})를 상회하는 {actual} 지표가 발표되어 시장에 긍정적인 신호를 주었습니다.", "경제 펀더멘털의 강세를 확인하며 위험 선호 심리를 자극할 수 있습니다."]
    elif (a_val < f_val and not is_inverse) or (a_val > f_val and is_inverse):
        sentiment = "부정적 발표"
        summary = [f"예상치({forecast})에 못 미치는 {actual} 지표가 발표되어 경기 둔화 우려가 제기되었습니다.", "단기적으로 시장의 변동성을 높일 수 있는 요인으로 작용할 전망입니다."]
    else:
        sentiment = "중립적 발표"
        summary = [f"예상치({forecast})와 부합하는 {actual} 지표가 발표되었습니다.", "시장은 이미 해당 수치를 선반영한 상태로 보이며 큰 충격은 없을 것으로 보입니다."]
        
    return sentiment, summary

def fetch_economic_calendar():
    """다양한 날짜에 대한 주요 경제 이벤트를 제공하며, 발표된 수치에 대해 AI 해석을 자동 생성합니다."""
    today = datetime.now()
    yesterday = (today - timedelta(days=1)).strftime("%Y-%m-%d")
    today_str = today.strftime("%Y-%m-%d")
    tomorrow = (today + timedelta(days=1)).strftime("%Y-%m-%d")

    raw_events = [
        # 3월 28일 (토) - 어제
        {
            "date": yesterday,
            "time": "09:00",
            "country": "유럽",
            "importance": "보통",
            "title": "ECB 치폴로네 집행위원 연설",
            "previous": None,
            "forecast": None,
            "actual": "진행완료"
        },
        # 3월 29일 (일) - 오늘
        {
            "date": today_str,
            "time": "23:50",
            "country": "일본",
            "importance": "중요",
            "title": "일본은행(BoJ) 통화정책회의 의견요약",
            "previous": None,
            "forecast": None,
            "actual": None
        },
        # 3월 30일 (월) - 내일
        {
            "date": tomorrow,
            "time": "06:00",
            "country": "영국",
            "importance": "중요",
            "title": "영국 GDP (4분기 확정치)",
            "previous": "-0.3%",
            "forecast": "0.1%",
            "actual": None
        },
        {
            "date": tomorrow,
            "time": "09:30",
            "country": "미국",
            "importance": "중요",
            "title": "제롬 파월 연준 의장 연설",
            "previous": None,
            "forecast": None,
            "actual": None
        },
        {
            "date": tomorrow,
            "time": "12:00",
            "country": "독일",
            "importance": "중요",
            "title": "독일 CPI (소비자물가지수) 예비치 (MoM)",
            "previous": "0.4%",
            "forecast": "0.6%",
            "actual": None
        },
        {
            "date": tomorrow,
            "time": "21:30",
            "country": "미국",
            "importance": "중요",
            "title": "댈러스 연준 제조업 지수",
            "previous": "-11.3",
            "forecast": "-8.0",
            "actual": None
        },
        {
            "date": tomorrow,
            "time": "23:30",
            "country": "일본",
            "importance": "중요",
            "title": "도쿄 CPI (소비자물가지수) (YoY)",
            "previous": "2.5%",
            "forecast": "2.4%",
            "actual": None
        }
    ]

    # 각 이벤트마다 AI 해석 동적 생성
    processed_events = []
    for event in raw_events:
        # 이미 ai_summary가 하드코딩된 경우 유지, 없으면 생성
        if event.get("ai_summary") is None:
            sentiment, summary = generate_ai_analysis(event)
            event["sentiment"] = sentiment
            event["ai_summary"] = summary
        processed_events.append(event)

    return processed_events

STATIC_GURU_PORTFOLIOS = [
        {
            "name": "Stan Druckenmiller",
            "firm": "Duquesne Family Office",
            "whale_url": "https://whalewisdom.com/filer/duquesne-family-office-llc",
            "holdings": [
                {"symbol": "NTRA", "name": "Natera Inc", "weight": "12.8%"},
                {"symbol": "XLF", "name": "Financial SPDR", "weight": "6.7%"},
                {"symbol": "INSM", "name": "Insmed Inc", "weight": "5.7%"},
                {"symbol": "RSP", "name": "Equal Weight S&P ETF", "weight": "5.0%"},
                {"symbol": "TEVA", "name": "Teva Pharma", "weight": "4.1%"}
            ]
        },
        {
            "name": "Bill Ackman",
            "firm": "Pershing Square",
            "whale_url": "https://whalewisdom.com/filer/pershing-square-capital-management-l-p",
            "holdings": [
                {"symbol": "BN", "name": "Brookfield Corp", "weight": "18.2%"},
                {"symbol": "UBER", "name": "Uber Tech", "weight": "15.9%"},
                {"symbol": "AMZN", "name": "Amazon", "weight": "14.3%"},
                {"symbol": "GOOGL", "name": "Alphabet (Google)", "weight": "12.5%"},
                {"symbol": "META", "name": "Meta Platforms", "weight": "11.4%"}
            ]
        },
        {
            "name": "Warren Buffett",
            "firm": "Berkshire Hathaway",
            "whale_url": "https://whalewisdom.com/filer/berkshire-hathaway-inc",
            "holdings": [
                {"symbol": "AAPL", "name": "Apple", "weight": "22.6%"},
                {"symbol": "AXP", "name": "American Express", "weight": "20.5%"},
                {"symbol": "BAC", "name": "Bank of America", "weight": "10.4%"},
                {"symbol": "KO", "name": "Coca-Cola", "weight": "10.2%"},
                {"symbol": "CVX", "name": "Chevron", "weight": "7.2%"}
            ]
        },
        {
            "name": "Ray Dalio",
            "firm": "Bridgewater Associates",
            "whale_url": "https://whalewisdom.com/filer/bridgewater-associates-lp",
            "holdings": [
                {"symbol": "IVV", "weight": "5.4%", "name": "iShares Core S&P 500"},
                {"symbol": "VWO", "weight": "4.2%", "name": "Vanguard Emerging Markets"},
                {"symbol": "PG", "weight": "3.8%", "name": "Procter & Gamble"},
                {"symbol": "JNJ", "weight": "3.1%", "name": "Johnson & Johnson"},
                {"symbol": "GOOGL", "weight": "2.8%", "name": "Alphabet"}
            ]
        },
        {
            "name": "Michael Burry",
            "firm": "Scion Asset Management",
            "whale_url": "https://whalewisdom.com/filer/scion-asset-management-llc",
            "holdings": [
                {"symbol": "MOH", "name": "Molina Healthcare", "weight": "35.1%"},
                {"symbol": "LULU", "name": "Lululemon Athletica", "weight": "26.1%"},
                {"symbol": "SLM", "name": "SLM Corp", "weight": "19.5%"},
                {"symbol": "BRKR", "name": "Bruker Corp", "weight": "12.1%"}
            ]
        },
        {
            "name": "Cathie Wood",
            "firm": "ARK Investment",
            "whale_url": "https://whalewisdom.com/filer/ark-investment-management-llc",
            "holdings": [
                {"symbol": "TSLA", "weight": "11.2%", "name": "Tesla Inc"},
                {"symbol": "ROKU", "weight": "8.4%", "name": "Roku Inc"},
                {"symbol": "COIN", "weight": "7.9%", "name": "Coinbase Global"},
                {"symbol": "PATH", "weight": "6.2%", "name": "UiPath Inc"},
                {"symbol": "PLTR", "weight": "5.8%", "name": "Palantir Tech"}
            ]
        },
        {
            "name": "Seth Klarman",
            "firm": "Baupost Group",
            "whale_url": "https://whalewisdom.com/filer/baupost-group-llc-ma",
            "holdings": [
                {"symbol": "LBTYK", "weight": "15.4%", "name": "Liberty Global"},
                {"symbol": "VIST", "weight": "12.8%", "name": "Vistra Corp"},
                {"symbol": "GOOGL", "weight": "9.1%", "name": "Alphabet"},
                {"symbol": "QRVO", "weight": "7.2%", "name": "Qorvo Inc"},
                {"symbol": "AMAT", "weight": "5.4%", "name": "Applied Materials"}
            ]
        },
        {
            "name": "Jim Simons",
            "firm": "Renaissance Tech",
            "whale_url": "https://whalewisdom.com/filer/renaissance-technologies-llc",
            "holdings": [
                {"symbol": "NVDA", "weight": "2.1%", "name": "NVIDIA"},
                {"symbol": "MSFT", "weight": "1.8%", "name": "Microsoft"},
                {"symbol": "AAPL", "weight": "1.5%", "name": "Apple"},
                {"symbol": "AMZN", "weight": "1.2%", "name": "Amazon"},
                {"symbol": "META", "weight": "1.1%", "name": "Meta"}
            ]
        },
        {
            "name": "David Tepper",
            "firm": "Appaloosa Management",
            "whale_url": "https://whalewisdom.com/filer/appaloosa-management-lp",
            "holdings": [
                {"symbol": "BABA", "name": "Alibaba", "weight": "11.0%"},
                {"symbol": "GOOGL", "name": "Alphabet (Google)", "weight": "8.2%"},
                {"symbol": "AMZN", "name": "Amazon", "weight": "7.3%"},
                {"symbol": "MU", "name": "Micron Tech", "weight": "6.3%"},
                {"symbol": "META", "name": "Meta Platforms", "weight": "5.8%"}
            ]
        },
        {
            "name": "Chase Coleman",
            "firm": "Tiger Global",
            "whale_url": "https://whalewisdom.com/filer/tiger-global-management-llc",
            "holdings": [
                {"symbol": "META", "weight": "18.5%", "name": "Meta"},
                {"symbol": "MSFT", "weight": "14.2%", "name": "Microsoft"},
                {"symbol": "AMZN", "weight": "9.1%", "name": "Amazon"},
                {"symbol": "GOOGL", "weight": "7.5%", "name": "Alphabet"},
                {"symbol": "PANW", "weight": "6.2%", "name": "Palo Alto"}
            ]
        },
        {
            "name": "Paul Tudor Jones",
            "firm": "Tudor Investment",
            "whale_url": "https://whalewisdom.com/filer/tudor-investment-corp-et-al",
            "holdings": [
                {"symbol": "NVDA", "weight": "4.1%", "name": "NVIDIA"},
                {"symbol": "MSFT", "weight": "3.8%", "name": "Microsoft"},
                {"symbol": "META", "weight": "3.5%", "name": "Meta"},
                {"symbol": "AMZN", "weight": "2.9%", "name": "Amazon"},
                {"symbol": "TSLA", "weight": "2.4%", "name": "Tesla"}
            ]
        },
        {
            "name": "Howard Marks",
            "firm": "Oaktree Capital",
            "whale_url": "https://whalewisdom.com/filer/oaktree-capital-management-lp",
            "holdings": [
                {"symbol": "TRMD", "weight": "22.4%", "name": "TORM plc"},
                {"symbol": "VALE", "weight": "8.5%", "name": "Vale S.A."},
                {"symbol": "IBN", "weight": "4.2%", "name": "ICICI Bank"},
                {"symbol": "PTR", "weight": "3.1%", "name": "PetroChina"},
                {"symbol": "PBR", "weight": "2.8%", "name": "Petrobras"}
            ]
        },
        {
            "name": "Carl Icahn",
            "firm": "Icahn Enterprises",
            "whale_url": "https://whalewisdom.com/filer/icahn-carl-c",
            "holdings": [
                {"symbol": "IEP", "weight": "62.4%", "name": "Icahn Enterprises"},
                {"symbol": "CVI", "weight": "15.1%", "name": "CVR Energy"},
                {"symbol": "SWX", "weight": "5.4%", "name": "Southwest Gas"},
                {"symbol": "BAX", "weight": "4.2%", "name": "Baxter Intl"},
                {"symbol": "OXY", "weight": "3.1%", "name": "Occidental"}
            ]
        },
        {
            "name": "Nelson Peltz",
            "firm": "Trian Fund Mgmt",
            "whale_url": "https://whalewisdom.com/filer/trian-fund-management-lp",
            "holdings": [
                {"symbol": "DIS", "weight": "35.2%", "name": "Disney"},
                {"symbol": "TGT", "weight": "15.4%", "name": "Target Corp"},
                {"symbol": "IVZ", "weight": "12.1%", "name": "Invesco Ltd"},
                {"symbol": "JANU", "weight": "8.5%", "name": "Janus Henderson"},
                {"symbol": "SYY", "weight": "7.2%", "name": "Sysco Corp"}
            ]
        },
        {
            "name": "Steve Cohen",
            "firm": "Point72 Asset Mgmt",
            "whale_url": "https://whalewisdom.com/filer/point72-asset-management-l-p",
            "holdings": [
                {"symbol": "AMZN", "weight": "2.4%", "name": "Amazon"},
                {"symbol": "MSFT", "weight": "2.1%", "name": "Microsoft"},
                {"symbol": "META", "weight": "1.8%", "name": "Meta"},
                {"symbol": "NVDA", "weight": "1.5%", "name": "NVIDIA"},
                {"symbol": "GOOGL", "weight": "1.2%", "name": "Alphabet"}
            ]
        },
        {
            "name": "Israel Englander",
            "firm": "Millennium Mgmt",
            "whale_url": "https://whalewisdom.com/filer/millennium-management-llc",
            "holdings": [
                {"symbol": "NVDA", "weight": "1.8%", "name": "NVIDIA"},
                {"symbol": "MSFT", "weight": "1.5%", "name": "Microsoft"},
                {"symbol": "AAPL", "weight": "1.2%", "name": "Apple"},
                {"symbol": "AMZN", "weight": "1.1%", "name": "Amazon"},
                {"symbol": "META", "weight": "0.9%", "name": "Meta"}
            ]
        }
]

SEC_HEADERS = {
    "User-Agent": os.getenv("SEC_USER_AGENT", "stanley-dashboard/1.0 huisang@example.com")
}

WHALEWISDOM_SHARED_KEY = os.getenv("WHALEWISDOM_API_SHARED_KEY") or os.getenv("WHALEWISDOM_SHARED_KEY")
WHALEWISDOM_SECRET_KEY = os.getenv("WHALEWISDOM_API_SECRET_KEY") or os.getenv("WHALEWISDOM_SECRET_KEY")

GURU_13F_CONFIGS = [
    {"name": "Stan Druckenmiller", "firm": "Duquesne Family Office", "queries": ["Duquesne Family Office LLC"], "whale_slug": "duquesne-family-office-llc"},
    {"name": "Bill Ackman", "firm": "Pershing Square", "queries": ["Pershing Square Capital Management, L.P."], "whale_slug": "pershing-square-capital-management-l-p"},
    {"name": "Warren Buffett", "firm": "Berkshire Hathaway", "queries": ["Berkshire Hathaway Inc"], "whale_slug": "berkshire-hathaway-inc"},
    {"name": "Ray Dalio", "firm": "Bridgewater Associates", "queries": ["Bridgewater Associates, LP"], "whale_slug": "bridgewater-associates-lp"},
    {"name": "Michael Burry", "firm": "Scion Asset Management", "queries": ["Scion Asset Management, LLC"], "whale_slug": "scion-asset-management-llc"},
    {"name": "Cathie Wood", "firm": "ARK Investment", "queries": ["ARK Investment Management LLC"], "whale_slug": "ark-investment-management-llc"},
    {"name": "Seth Klarman", "firm": "Baupost Group", "queries": ["BAUPOST GROUP LLC/MA", "Baupost Group LLC"], "whale_slug": "baupost-group-llc-ma"},
    {"name": "Jim Simons", "firm": "Renaissance Tech", "queries": ["Renaissance Technologies LLC"], "whale_slug": "renaissance-technologies-llc"},
    {"name": "David Tepper", "firm": "Appaloosa Management", "queries": ["Appaloosa LP"], "whale_slug": "appaloosa-management-lp"},
    {"name": "Chase Coleman", "firm": "Tiger Global", "queries": ["Tiger Global Management LLC"], "whale_slug": "tiger-global-management-llc"},
    {"name": "Paul Tudor Jones", "firm": "Tudor Investment", "queries": ["Tudor Investment Corp"], "whale_slug": "tudor-investment-corp-et-al"},
    {"name": "Howard Marks", "firm": "Oaktree Capital", "queries": ["Oaktree Capital Management LP"], "whale_slug": "oaktree-capital-management-lp"},
    {"name": "Carl Icahn", "firm": "Icahn Enterprises", "queries": ["Icahn Carl C"], "whale_slug": "icahn-carl-c"},
    {"name": "Nelson Peltz", "firm": "Trian Fund Mgmt", "queries": ["Trian Fund Management, L.P."], "whale_slug": "trian-fund-management-lp"},
    {"name": "Steve Cohen", "firm": "Point72 Asset Mgmt", "queries": ["Point72 Asset Management, L.P."], "whale_slug": "point72-asset-management-l-p"},
    {"name": "Israel Englander", "firm": "Millennium Mgmt", "queries": ["Millennium Management LLC"], "whale_slug": "millennium-management-llc"},
]

HOLDING_TICKER_OVERRIDES = {
    ("SELECT SECTOR SPDR TR", "STATE STREET FIN"): ("XLF", "Financial Select Sector SPDR Fund"),
    ("INVESCO EXCHANGE TRADED FD T", "S P500 EQL WGT"): ("RSP", "Invesco S&P 500 Equal Weight ETF"),
    ("INVESCO EXCHANGE TRADED FD T", "S P 500 EQL WGT"): ("RSP", "Invesco S&P 500 Equal Weight ETF"),
    ("ISHARES INC", "MSCI BRAZIL ETF"): ("EWZ", "iShares MSCI Brazil ETF"),
    ("SPDR S P 500 ETF TR", "TR UNIT"): ("SPY", "SPDR S&P 500 ETF Trust"),
    ("ISHARES TR", "CORE S P500 ETF"): ("IVV", "iShares Core S&P 500 ETF"),
    ("ISHARES TR", "CORE S P 500 ETF"): ("IVV", "iShares Core S&P 500 ETF"),
    ("ISHARES TR", "RUSSELL 2000 ETF"): ("IWM", "iShares Russell 2000 ETF"),
    ("INVESCO QQQ TR", "UNIT SER 1"): ("QQQ", "Invesco QQQ Trust"),
    ("VANECK SEMICONDUCTOR ETF", "ETF"): ("SMH", "VanEck Semiconductor ETF"),
    ("ALPHABET INC", "CAP STK CL A"): ("GOOGL", "Alphabet Inc."),
    ("ALPHABET INC", "CAP STK CL C"): ("GOOG", "Alphabet Inc."),
    ("BROOKFIELD CORP", "CL A LTD VT SH"): ("BN", "Brookfield Corp"),
    ("NATERA INC", "COM"): ("NTRA", "Natera Inc"),
    ("INSMED INC", "COM PAR 01"): ("INSM", "Insmed Inc"),
    ("TEVA PHARMACEUTICAL INDS LTD", "SPONSORED ADS"): ("TEVA", "Teva Pharmaceutical Industries Ltd"),
    ("WOODWARD INC", "COM"): ("WWD", "Woodward Inc"),
    ("TAIWAN SEMICONDUCTOR MFG LTD", "SPONSORED ADS"): ("TSM", "Taiwan Semiconductor Manufacturing Co Ltd"),
    ("COUPANG INC", "CL A"): ("CPNG", "Coupang Inc"),
    ("AMERICAN EXPRESS CO", "COM"): ("AXP", "American Express Co"),
    ("BANK AMERICA CORP", "COM"): ("BAC", "Bank of America Corp"),
    ("COCA COLA CO", "COM"): ("KO", "Coca-Cola Co"),
    ("CHEVRON CORP NEW", "COM"): ("CVX", "Chevron Corp"),
    ("OCCIDENTAL PETE CORP", "COM"): ("OXY", "Occidental Petroleum Corp"),
    ("KRAFT HEINZ CO", "COM"): ("KHC", "Kraft Heinz Co"),
    ("RESTAURANT BRANDS INTL INC", "COM"): ("QSR", "Restaurant Brands International Inc"),
    ("WILLIS TOWERS WATSON PLC LTD", "SHS"): ("WTW", "Willis Towers Watson PLC"),
    ("ELEVANCE HEALTH INC FORMERLY", "COM"): ("ELV", "Elevance Health Inc"),
    ("UNION PAC CORP", "COM"): ("UNP", "Union Pacific Corp"),
    ("UNITED THERAPEUTICS CORP DEL", "COM"): ("UTHR", "United Therapeutics Corp"),
    ("KINROSS GOLD CORP", "COM"): ("KGC", "Kinross Gold Corp"),
    ("SEA LTD", "SPONSORED ADS"): ("SE", "Sea Ltd"),
    ("EXPAND ENERGY CORP", "COMMON STOCK"): ("EXE", "Expand Energy Corp"),
    ("TORM PLC", "COMMON STOCK"): ("TRMD", "TORM plc"),
    ("ANGLOGOLD ASHANTI PLC", "COMMON STOCK"): ("AU", "AngloGold Ashanti plc"),
    ("GARRETT MOTION INC", "COMMON STOCK"): ("GTX", "Garrett Motion Inc"),
    ("ICAHN ENTERPRISES LP", "DEPOSITARY UNIT"): ("IEP", "Icahn Enterprises LP"),
    ("CVR ENERGY INC", "COM"): ("CVI", "CVR Energy Inc"),
    ("SOUTHWEST GAS HOLDINGS INC", "COM"): ("SWX", "Southwest Gas Holdings Inc"),
    ("CVR PARTNERS LP", "COM"): ("UAN", "CVR Partners LP"),
    ("ECHOSTAR CORPORATION", "CL A"): ("SATS", "EchoStar Corp"),
    ("JANUS HENDERSON GROUP PLC", "ORD SHS"): ("JHG", "Janus Henderson Group plc"),
    ("GE AEROSPACE", "COM NEW"): ("GE", "GE Aerospace"),
    ("SOLVENTUM CORPORATION", "COM SHS"): ("SOLV", "Solventum Corp"),
    ("WENDYS CO", "COM"): ("WEN", "Wendy's Co"),
    ("FERGUSON PLC NEW", "SHS"): ("FERG", "Ferguson plc"),
}

HOLDING_ISSUER_OVERRIDES = {
    "NVIDIA CORPORATION": ("NVDA", "NVIDIA CORP"),
    "AMAZON COM INC": ("AMZN", "AMAZON COM INC"),
    "META PLATFORMS INC": ("META", "Meta Platforms, Inc."),
    "MICROSOFT CORP": ("MSFT", "Microsoft Corp"),
    "APPLE INC": ("AAPL", "Apple Inc."),
    "SLM CORP": ("SLM", "SLM CORP"),
    "BRUKER CORP": ("BRKR", "BRUKER CORP"),
}

def normalize_13f_text(value):
    if not value:
        return ""
    value = value.upper().replace("&", " AND ")
    replacements = {
        "S&P": "S P",
        "$.": "",
        "$": "",
        "PAR .01": "PAR 01",
        "PAR $.01": "PAR 01",
        "COM NEW": "COM",
        "COM PAR $.01": "COM PAR 01",
        "MFG": "MANUFACTURING",
        "HLDG": "HOLDING",
        "HLDGS": "HOLDINGS",
        "INTL": "INTERNATIONAL",
        "PETE": "PETROLEUM",
        "SPONSORD": "SPONSORED",
    }
    for src, dst in replacements.items():
        value = value.replace(src, dst)
    value = re.sub(r"[^A-Z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()

def build_whalewisdom_url(slug):
    if not slug:
        return ""
    return f"https://whalewisdom.com/filer/{slug}"

def extract_first_record_list(payload):
    if isinstance(payload, list):
        if payload and isinstance(payload[0], dict):
            return payload
        for item in payload:
            found = extract_first_record_list(item)
            if found:
                return found
        return []
    if isinstance(payload, dict):
        for value in payload.values():
            if isinstance(value, list) and value and isinstance(value[0], dict):
                return value
        for value in payload.values():
            found = extract_first_record_list(value)
            if found:
                return found
    return []

def get_first_scalar(payload, keys):
    if not isinstance(payload, dict):
        return None
    lower_map = {str(k).lower(): v for k, v in payload.items()}
    for key in keys:
        if key.lower() in lower_map:
            return lower_map[key.lower()]
    return None

def whalewisdom_enabled():
    return bool(WHALEWISDOM_SHARED_KEY and WHALEWISDOM_SECRET_KEY)

def whalewisdom_command(args):
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    args_json = json.dumps(args, separators=(",", ":"))
    message = f"{args_json}\n{timestamp}".encode("utf-8")
    secret = WHALEWISDOM_SECRET_KEY.encode("utf-8")
    signature = base64.b64encode(hmac.new(secret, message, hashlib.sha1).digest()).decode("utf-8")

    response = requests.get(
        "https://whalewisdom.com/shell/command.json",
        params={
            "args": args_json,
            "api_shared_key": WHALEWISDOM_SHARED_KEY,
            "api_sig": signature,
            "timestamp": timestamp,
        },
        headers={"User-Agent": SEC_HEADERS["User-Agent"]},
        timeout=20,
    )
    response.raise_for_status()
    return response.json()

def fetch_whalewisdom_filer(config):
    if not whalewisdom_enabled():
        return None

    for query in config.get("queries", []):
        try:
            lookup = whalewisdom_command({"command": "filer_lookup", "name": query})
            records = extract_first_record_list(lookup)
            if not records:
                continue

            target = records[0]
            filer_id = get_first_scalar(target, ["id", "filer_id"])
            if filer_id is None:
                continue

            metadata = whalewisdom_command({"command": "filer_metadata", "filer_id": filer_id})
            holdings_payload = whalewisdom_command({
                "command": "holdings",
                "filer_ids": [int(filer_id)],
                "limit": 5,
                "sort": "current_mv",
                "dir": "DESC",
                "columns": [3, 4, 10, 12, 16, 17],
            })

            holdings_rows = extract_first_record_list(holdings_payload)
            if not holdings_rows:
                continue

            meta_record = metadata if isinstance(metadata, dict) else {}
            meta_rows = extract_first_record_list(metadata)
            if meta_rows:
                meta_record = meta_rows[0]

            holdings = []
            for row in holdings_rows[:5]:
                symbol = get_first_scalar(row, ["stock_ticker", "ticker", "symbol"])
                name = get_first_scalar(row, ["stock_name", "name"]) or symbol or "Unknown"
                weight = get_first_scalar(row, ["current_percent_of_portfolio", "percent_of_portfolio", "weight"])
                previous_weight = get_first_scalar(row, ["previous_percent_of_portfolio", "prior_percent_of_portfolio", "last_percent_of_portfolio"])
                if weight is None:
                    weight_text = "-"
                    change_label = ""
                    change_class = ""
                    change_delta = ""
                else:
                    try:
                        current_weight = float(weight)
                        weight_text = f"{current_weight:.1f}%"
                        if previous_weight is None:
                            change_label = ""
                            change_class = ""
                            change_delta = ""
                        else:
                            change_label, change_class, delta = classify_holding_change(current_weight, float(previous_weight))
                            change_delta = format_delta_pp(delta)
                    except Exception:
                        weight_text = str(weight)
                        change_label = ""
                        change_class = ""
                        change_delta = ""
                holdings.append({
                    "symbol": symbol,
                    "name": name,
                    "weight": weight_text,
                    "change_label": change_label,
                    "change_class": change_class,
                    "change_delta": change_delta,
                })

            if not holdings:
                continue

            period = get_first_scalar(meta_record, ["source_date", "report_period", "quarter_date"]) or get_first_scalar(holdings_rows[0], ["source_date"])
            return {
                "name": config["name"],
                "firm": config["firm"],
                "whale_url": build_whalewisdom_url(config.get("whale_slug")),
                "sec_url": "",
                "source": "WhaleWisdom",
                "filed_at": "",
                "period_of_report": str(period) if period else "",
                "holdings": holdings,
            }
        except Exception as e:
            print(f"Error fetching WhaleWisdom data for {config['name']} via {query}: {e}")
    return None

def build_sec_company_title_map():
    try:
        r = requests.get("https://www.sec.gov/files/company_tickers.json", headers=SEC_HEADERS, timeout=20)
        r.raise_for_status()
        payload = r.json()
    except Exception as e:
        print(f"Error fetching SEC company tickers: {e}")
        return {}, {}

    by_norm = {}
    pretty = {}
    for item in payload.values():
        norm = normalize_13f_text(item.get("title"))
        ticker = item.get("ticker")
        if not norm or not ticker:
            continue
        by_norm.setdefault(norm, set()).add(ticker)
        pretty[ticker] = item.get("title", ticker)
    return by_norm, pretty

def resolve_holding_symbol(issuer, class_title, title_map, pretty_names):
    issuer_key = normalize_13f_text(issuer)
    class_key = normalize_13f_text(class_title)

    override = HOLDING_TICKER_OVERRIDES.get((issuer_key, class_key))
    if override:
        return override

    if issuer_key == "INVESCO EXCHANGE TRADED FD T" and "EQL" in class_key and "WGT" in class_key:
        return "RSP", "Invesco S&P 500 Equal Weight ETF"
    if issuer_key == "ISHARES TR" and "CORE" in class_key and "500" in class_key:
        return "IVV", "iShares Core S&P 500 ETF"
    if issuer_key == "ISHARES TR" and "RUSSELL" in class_key and "2000" in class_key:
        return "IWM", "iShares Russell 2000 ETF"

    issuer_override = HOLDING_ISSUER_OVERRIDES.get(issuer_key)
    if issuer_override:
        return issuer_override

    exact = title_map.get(issuer_key, set())
    if len(exact) == 1:
        ticker = next(iter(exact))
        return ticker, pretty_names.get(ticker, issuer.title())

    issuer_tokens = issuer_key.split()
    best_ticker = None
    best_name = None
    best_score = 0
    for norm_title, tickers in title_map.items():
        if len(tickers) != 1:
            continue
        title_tokens = set(norm_title.split())
        overlap = len(set(issuer_tokens) & title_tokens)
        if overlap < max(2, len(issuer_tokens) - 1):
            continue
        if overlap > best_score:
            best_score = overlap
            best_ticker = next(iter(tickers))
            best_name = pretty_names.get(best_ticker, issuer.title())

    if best_ticker:
        return best_ticker, best_name
    return None, issuer.title()

def fetch_recent_13f_entries(queries, limit=2):
    ns = {"a": "http://www.w3.org/2005/Atom"}
    for query in queries:
        try:
            url = (
                "https://www.sec.gov/cgi-bin/browse-edgar"
                f"?action=getcompany&owner=exclude&count=10&output=atom&type=13F-HR&company={urllib.parse.quote(query)}"
            )
            feed = requests.get(url, headers=SEC_HEADERS, timeout=20)
            feed.raise_for_status()
            root = ET.fromstring(feed.text)
            entries = root.findall("a:entry", ns)
            results = []
            for entry in entries:
                link = entry.find("a:link[@rel='alternate']", ns)
                if link is None:
                    continue
                title = entry.findtext("a:title", default="", namespaces=ns)
                if "/A" in title:
                    continue
                results.append({
                    "filing_url": link.attrib.get("href"),
                    "filed_at": entry.findtext("a:updated", default="", namespaces=ns)[:10],
                })
                if len(results) >= limit:
                    return results
        except Exception as e:
            print(f"Error searching SEC 13F for {query}: {e}")
    return []

def get_filing_base_url(filing_url):
    return filing_url.rsplit("/", 1)[0] + "/"

def fetch_information_table(base_url):
    try:
        index = requests.get(base_url + "index.json", headers=SEC_HEADERS, timeout=20)
        index.raise_for_status()
        items = index.json()["directory"]["item"]
        for item in items:
            name = item["name"]
            if not name.lower().endswith(".xml") or name == "primary_doc.xml":
                continue
            r = requests.get(base_url + name, headers=SEC_HEADERS, timeout=20)
            r.raise_for_status()
            if "informationTable" in r.text[:300]:
                return r.text
    except Exception as e:
        print(f"Error fetching SEC information table from {base_url}: {e}")
    return None

def fetch_primary_doc_metadata(base_url):
    metadata = {"period_of_report": "", "filer_name": ""}
    try:
        r = requests.get(base_url + "primary_doc.xml", headers=SEC_HEADERS, timeout=20)
        r.raise_for_status()
        root = ET.fromstring(r.text)
        ns = {"s": "http://www.sec.gov/edgar/thirteenffiler", "c": "http://www.sec.gov/edgar/common"}
        metadata["period_of_report"] = root.findtext(".//s:periodOfReport", default="", namespaces=ns)
        metadata["filer_name"] = root.findtext(".//c:conformedName", default="", namespaces=ns)
    except Exception as e:
        print(f"Error fetching SEC primary doc metadata from {base_url}: {e}")
    return metadata

def parse_13f_rows(xml_text):
    ns = {"i": "http://www.sec.gov/edgar/document/thirteenf/informationtable"}
    root = ET.fromstring(xml_text)
    aggregated = {}

    for row in root.findall("i:infoTable", ns):
        put_call = row.findtext("i:putCall", default="", namespaces=ns).strip()
        if put_call:
            continue

        issuer = row.findtext("i:nameOfIssuer", default="", namespaces=ns).strip()
        class_title = row.findtext("i:titleOfClass", default="", namespaces=ns).strip()
        value = float(row.findtext("i:value", default="0", namespaces=ns) or 0)
        if not issuer or value <= 0:
            continue
        aggregated[(issuer, class_title)] = aggregated.get((issuer, class_title), 0.0) + value

    total_value = sum(aggregated.values())
    rows = []
    for (issuer, class_title), value in sorted(aggregated.items(), key=lambda item: item[1], reverse=True):
        weight = (value / total_value) * 100 if total_value else 0.0
        rows.append({
            "issuer": issuer,
            "class_title": class_title,
            "value": value,
            "weight": weight,
            "key": f"{normalize_13f_text(issuer)}|{normalize_13f_text(class_title)}",
        })
    return rows

def classify_holding_change(current_weight, previous_weight):
    if previous_weight is None:
        return "신규", "is-new", None
    delta = current_weight - previous_weight
    if delta >= 0.25:
        return "확대", "is-up", delta
    if delta <= -0.25:
        return "축소", "is-down", delta
    return "유지", "is-flat", delta

def format_delta_pp(delta):
    if delta is None:
        return ""
    sign = "+" if delta >= 0 else ""
    return f"{sign}{delta:.1f}%p"

def parse_13f_holdings(xml_text, title_map, pretty_names, limit=5, previous_xml_text=None):
    rows = parse_13f_rows(xml_text)
    comparison_enabled = bool(previous_xml_text)
    previous_rows = parse_13f_rows(previous_xml_text) if comparison_enabled else []
    previous_map = {row["key"]: row for row in previous_rows}

    holdings = []
    for row in rows[:limit]:
        issuer = row["issuer"]
        class_title = row["class_title"]
        symbol, pretty_name = resolve_holding_symbol(issuer, class_title, title_map, pretty_names)
        if comparison_enabled:
            previous = previous_map.get(row["key"])
            change_label, change_class, delta = classify_holding_change(row["weight"], previous["weight"] if previous else None)
            change_delta = format_delta_pp(delta)
        else:
            change_label = ""
            change_class = ""
            change_delta = ""
        holdings.append({
            "symbol": symbol,
            "name": pretty_name,
            "issuer": issuer,
            "class_title": class_title,
            "weight": f"{row['weight']:.1f}%",
            "change_label": change_label,
            "change_class": change_class,
            "change_delta": change_delta,
        })
    return holdings

_GURU_CACHE_FILE = os.path.join(os.path.dirname(__file__), 'guru_cache.json')

def get_guru_portfolios():
    # Persistent File-based Caching (expires after 24 hours)
    if os.path.exists(_GURU_CACHE_FILE):
        file_time = os.path.getmtime(_GURU_CACHE_FILE)
        if (time.time() - file_time) < 86400: # 24시간
            try:
                with open(_GURU_CACHE_FILE, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] 💾 Using persistent guru portfolio cache.")
                    return cached_data
            except Exception as e:
                print(f"Cache read error: {e}")

    """Fetch latest guru holdings using WhaleWisdom first, then SEC 13F, then static fallback."""
    title_map, pretty_names = build_sec_company_title_map()
    fallback = {guru["name"]: guru for guru in STATIC_GURU_PORTFOLIOS}
    results = []

    for config in GURU_13F_CONFIGS:
        try:
            whale_data = fetch_whalewisdom_filer(config)
            if whale_data:
                results.append(whale_data)
                continue

            entries = fetch_recent_13f_entries(config["queries"], limit=2)
            if not entries:
                raise ValueError("No 13F entry found")

            latest_entry = entries[0]
            latest_base_url = get_filing_base_url(latest_entry["filing_url"])
            latest_xml = fetch_information_table(latest_base_url)
            if not latest_xml:
                raise ValueError("No information table found")

            previous_entry = entries[1] if len(entries) > 1 else None
            previous_xml = None
            previous_metadata = {}
            if previous_entry:
                previous_base_url = get_filing_base_url(previous_entry["filing_url"])
                previous_xml = fetch_information_table(previous_base_url)
                if previous_xml:
                    previous_metadata = fetch_primary_doc_metadata(previous_base_url)

            metadata = fetch_primary_doc_metadata(latest_base_url)
            holdings = parse_13f_holdings(latest_xml, title_map, pretty_names, previous_xml_text=previous_xml)
            if not holdings:
                raise ValueError("No holdings parsed")

            results.append({
                "name": config["name"],
                "firm": config["firm"],
                "whale_url": build_whalewisdom_url(config.get("whale_slug")),
                "sec_url": latest_entry["filing_url"],
                "source": "SEC 13F",
                "filed_at": latest_entry["filed_at"],
                "period_of_report": metadata.get("period_of_report", ""),
                "previous_period_of_report": previous_metadata.get("period_of_report", "") if previous_xml else "",
                "holdings": holdings,
            })
        except Exception as e:
            print(f"Falling back to static guru portfolio for {config['name']}: {e}")
            fallback_item = dict(fallback[config["name"]])
            fallback_item["source"] = "Static fallback"
            fallback_item["sec_url"] = ""
            results.append(fallback_item)

    # Persistent Cache Saving
    try:
        with open(_GURU_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] 💾 Saved fresh guru portfolios to persistent cache.")
    except Exception as e:
        print(f"Cache write error: {e}")

    return results


def get_ai_strategy_v2(live_data, macro_data):
    """Generate a 3-tier strategy with rationale."""
    # Short-term (Tactical)
    vix_val = float(live_data.get("VIX", {}).get("price", 20))
    spx_1d = float(live_data.get("SP:SPX", {}).get("idx1D", 0))
    short_term = "변동성 관리 및 저점 매수 기획" if vix_val > 25 else "단기 상승 모멘텀 지속 관찰"
    if spx_1d < -1: short_term = "과매도 구간 진입, 단기 반등 신호 대기"
    elif spx_1d > 1: short_term = "단기 과열 주의, 익절 구간 탐색"
    short_rationale = f"VIX({vix_val}) 및 S&P 1일 등락률({spx_1d}%) 기반 하위 5일 변동성 분석 결과"

    # Medium-term (Trend)
    liquidity = macro_data.get("liquidity", {}).get("trend", "neutral")
    growth_val = macro_data.get("growth_value", {}).get("trend", "neutral")
    if liquidity == "up" and growth_val == "up":
        medium_term = "성장주 중심의 공격적 추세 추종 전략"
    elif liquidity == "down":
        medium_term = "현금 비중 확대 및 방어적 섹터 선호"
    else:
        medium_term = "박스권 장세 대비, 개별 종목 알파 수익률 집중"
    medium_rationale = f"달러 유동성({liquidity}) 및 성장/가치주 상대 강도({growth_val}) 추세 분석 결과"

    # Long-term (Macro Cycle)
    yield_curve = macro_data.get("yield_curve", {}).get("val", 0)
    cu_au = macro_data.get("cu_au", {}).get("trend", "neutral")
    if yield_curve < 0:
        long_term = "경기 침체 리스크 대비, 채권 및 금 비중 확대"
    elif cu_au == "up":
        long_term = "글로벌 경기 회복 시기, 원자재 및 산업재 비중 확대"
    else:
        long_term = "경제 연착륙 전망, 우량주 중심의 Buy & Hold"
    long_rationale = f"장단기 금리차({yield_curve}) 및 구리/금 비율({cu_au}) 기반 경기 사이클 분석 결과"

    return {
        "short": {"text": short_term, "rationale": short_rationale},
        "medium": {"text": medium_term, "rationale": medium_rationale},
        "long": {"text": long_term, "rationale": long_rationale}
    }

def main():
    print("Starting data fetch...")
    gurus = get_guru_portfolios()
    guru_symbols = sorted({
        holding["symbol"]
        for guru in gurus
        for holding in guru.get("holdings", [])
        if holding.get("symbol")
    })
    yf_tickers = sorted(set(
        [yf for yf in TICKER_MAP.values() if yf and not yf.startswith("FRED:")] + guru_symbols
    ))
    
    # Download 2Y data to ensure we have enough for YTD and SMAs for ratios
    print(f"Downloading data for {len(yf_tickers)} tickers from Yahoo...")
    try:
        data = yf.download(yf_tickers, period="2y", group_by="ticker", auto_adjust=False, progress=False)
    except Exception as e:
        print(f"Warning: Primary Yahoo Finance fetch failed ({e}). Continuing with supplemental data sources...")
        data = pd.DataFrame()

    live_data = {}
    all_hist = {} 

    # Process Yahoo Data
    for tv_sym, yf_sym in TICKER_MAP.items():
        if yf_sym is None or yf_sym.startswith("FRED:"):
            continue
            
        try:
            hist = None
            if len(yf_tickers) == 1:
                hist = data.dropna()
            elif yf_sym in data.columns:
                hist = data[yf_sym].dropna()
            
            # Individual retry if batch failed or returned empty
            if hist is None or hist.empty or len(hist) < 2:
                print(f"Retrying {yf_sym} individually...")
                hist = yf.download(yf_sym, period="2y", progress=False).dropna()

            if hist is not None and not hist.empty:
                all_hist[tv_sym] = hist
                metrics = get_yield_performance_metrics(hist) if tv_sym in YIELD_SERIES else get_performance_metrics(hist)
                if metrics:
                    live_data[tv_sym] = metrics
                else:
                    live_data[tv_sym] = None
            else:
                live_data[tv_sym] = None
        except Exception as e:
            print(f"Error processing {yf_sym}: {e}")
            live_data[tv_sym] = None

    # Process Guru Symbols not already covered by TICKER_MAP
    for guru_symbol in guru_symbols:
        if guru_symbol in live_data:
            continue

        try:
            hist = None
            if len(yf_tickers) == 1:
                hist = data.dropna()
            elif guru_symbol in data.columns:
                hist = data[guru_symbol].dropna()

            if hist is None or hist.empty or len(hist) < 2:
                print(f"Retrying guru symbol {guru_symbol} individually...")
                hist = yf.download(guru_symbol, period="2y", progress=False).dropna()

            if hist is not None and not hist.empty:
                all_hist[guru_symbol] = hist
                metrics = get_performance_metrics(hist)
                live_data[guru_symbol] = metrics if metrics else None
            else:
                live_data[guru_symbol] = None
        except Exception as e:
            print(f"Error processing guru symbol {guru_symbol}: {e}")
            live_data[guru_symbol] = None

    # Process FRED Data
    print("Fetching supplemental data from FRED...")
    for tv_sym, yf_sym in TICKER_MAP.items():
        if yf_sym and yf_sym.startswith("FRED:"):
            fred_id = yf_sym.split(":")[1]
            hist = get_fred_data(fred_id)
            if hist is not None and not hist.empty:
                all_hist[tv_sym] = hist
                if tv_sym in MONTHLY_FRED_SERIES:
                    metrics = get_monthly_yield_metrics(hist) if tv_sym in YIELD_SERIES else get_monthly_metrics(hist)
                else:
                    metrics = get_yield_performance_metrics(hist) if tv_sym in YIELD_SERIES else get_performance_metrics(hist)
                if metrics:
                    live_data[tv_sym] = metrics
                else:
                    live_data[tv_sym] = None
            else:
                # CNBC Fallback for US yields specifically
                cnbc_sym = None
                if tv_sym == "TVC:US02Y": cnbc_sym = "US2Y"
                elif tv_sym == "TVC:US10Y": cnbc_sym = "US10Y"
                elif tv_sym == "TVC:US30Y": cnbc_sym = "US30Y"
                
                if cnbc_sym:
                    print(f"Falling back to CNBC History for {tv_sym}...")
                    hist = fetch_cnbc_history(cnbc_sym)
                    if hist is not None and not hist.empty:
                        all_hist[tv_sym] = hist
                        metrics = get_yield_performance_metrics(hist)
                        if metrics:
                            metrics["source"] = "CNBC Fallback"
                            live_data[tv_sym] = metrics
                        else:
                            live_data[tv_sym] = None
                    else:
                        # If history fails, try single quote as last resort
                        metrics = fetch_cnbc_yield(cnbc_sym)
                        if metrics:
                            live_data[tv_sym] = metrics
                        else:
                            live_data[tv_sym] = None
                else:
                    live_data[tv_sym] = None
        
    # Extra: US 3M for spread calculation fallback
    if "TVC:US3M" not in live_data:
        print("Fetching CNBC History for US3M spread fallback...")
        hist = fetch_cnbc_history("US3M")
        if hist is not None and not hist.empty:
            all_hist["TVC:US3M"] = hist
            metrics = get_yield_performance_metrics(hist)
            if metrics:
                live_data["TVC:US3M"] = metrics
        else:
            metrics = fetch_cnbc_yield("US3M")
            if metrics:
                live_data["TVC:US3M"] = metrics

    print("Fetching official daily sovereign yield sources...")
    for tv_sym in CUSTOM_YIELD_SOURCES:
        hist = fetch_custom_yield_history(tv_sym)
        if hist is not None and not hist.empty:
            all_hist[tv_sym] = hist
            metrics = get_yield_performance_metrics(hist) if tv_sym in YIELD_SERIES else get_performance_metrics(hist)
            live_data[tv_sym] = metrics if metrics else None
        else:
            print(f"Falling back to existing source for {tv_sym}")

    # Calculate Macro Ratios with history
    macro_data = calculate_macro_stats(live_data, all_hist)
    
    # Fetch actual CNN Fear & Greed
    fng_data = get_cnn_fear_greed()

    # Restoration of PCC (Put/Call Ratio)
    # Since Yahoo Finance delisted ^VPC-O, we fallback to the CNN Fear & Greed component
    if live_data.get("PCC") is None and fng_data.get("pcc") is not None:
        live_data["PCC"] = {
            "price": f"{fng_data['pcc']:.2f}",
            "idx1D": "0.00",
            "idx5D": "0.00",
            "idxMTD": "0.00",
            "idxYTD": "0.00",
            "signal": ""
        }
    
    # NEW: Generate Multi-Horizon Strategy
    strategy_v2 = get_ai_strategy_v2(live_data, macro_data)
    
    # Write as JS to bypass CORS
    output = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "macro": macro_data,
        "assets": live_data,
        "fng": fng_data,
        "strategy": strategy_v2,
        "gurus": gurus,
        "calendar": fetch_economic_calendar()
    }
    js_content = f"window.DASHBOARD_DATA = {json.dumps(output, indent=2)};"
    
    output_path = os.path.join(os.path.dirname(__file__), 'data.js')
    with open(output_path, 'w') as f:
        f.write(js_content)
        
    print(f"Successfully wrote data (including CNN F&G: {fng_data['val']}) to {output_path}")

if __name__ == "__main__":
    main()
