const ASSETS = {
    indices: [
        { name: "S&P 500", symbol: "SP:SPX" },
        { name: "나스닥 100", symbol: "NASDAQ:NDX" },
        { name: "다우 존스", symbol: "DJ:DJI" },
        { name: "러셀 2000", symbol: "RUSSELL:RUT" },
        { name: "코스피", symbol: "KRX:KOSPI" },
        { name: "코스닥", symbol: "KRX:KOSDAQ" },
        { name: "니케이 225", symbol: "NI225" },
        { name: "독일 DAX", symbol: "DAX" },
        { name: "영국 FTSE 100", symbol: "UK100" },
        { name: "항셍 지수", symbol: "HSI" },
        { name: "MSCI 신흥국 (EM)", symbol: "EEM" },
        { name: "중국 A50", symbol: "FXI" },
        { name: "캐나다 TSX", symbol: "TSX:TSX" },
        { name: "프랑스 CAC40", symbol: "PX1" },
        { name: "인도 니프티 50", symbol: "NIFTY" },
        { name: "브라질 보베스파", symbol: "IBOV" },
        { name: "비트코인", symbol: "BTCUSDT" },
        { name: "이더리움", symbol: "ETHUSDT" }
    ],
    commodities: [
        { name: "금", symbol: "TVC:GOLD", group: "hard" },
        { name: "은", symbol: "TVC:SILVER", group: "hard" },
        { name: "구리", symbol: "COMEX:HG1!", group: "hard" },
        { name: "WTI 유", symbol: "TVC:USOIL", group: "hard" },
        { name: "브렌트유", symbol: "TVC:UKOIL", group: "hard" },
        { name: "천연가스", symbol: "NYMEX:NG1!", group: "hard" },
        { name: "철광석", symbol: "SGX:FEF1!", group: "hard" },
        { name: "백금", symbol: "TVC:PLATINUM", group: "hard" },
        { name: "팔라듐", symbol: "TVC:PALLADIUM", group: "hard" },
        { name: "알루미늄", symbol: "CAPITALCOM:ALUMINUM", group: "hard" },
        { name: "설탕", symbol: "ICEUS:SB1!", group: "soft" },
        { name: "커피", symbol: "ICEUS:KC1!", group: "soft" },
        { name: "밀", symbol: "CBOT:ZW1!", group: "soft" },
        { name: "옥수수", symbol: "CBOT:ZC1!", group: "soft" },
        { name: "대두", symbol: "CBOT:ZS1!", group: "soft" }
    ],
    currencies: [
        { name: "달러 인덱스", symbol: "TVC:DXY" },
        { name: "원/달러 환율", symbol: "FX_IDC:USDKRW" },
        { name: "달러/엔", symbol: "FX:USDJPY" },
        { name: "유로/달러", symbol: "FX:EURUSD" },
        { name: "파운드/달러", symbol: "FX:GBPUSD" },
        { name: "호주달러/달러", symbol: "FX:AUDUSD" },
        { name: "달러/캐나다달러", symbol: "FX:USDCAD" },
        { name: "달러/스위스프랑", symbol: "FX:USDCHF" },
        { name: "뉴질랜드달러/달러", symbol: "FX:NZDUSD" },
        { name: "싱가포르달러/달러", symbol: "FX_IDC:USDSGD" }
    ],
    bonds: [
        { name: "미국 2년물", symbol: "TVC:US02Y" },
        { name: "미국 10년물", symbol: "TVC:US10Y" },
        { name: "미국 30년물", symbol: "TVC:US30Y" },
        { name: "독일 10년물", symbol: "TVC:DE10Y" },
        { name: "일본 10년물", symbol: "TVC:JP10Y" },
        { name: "영국 10년물", symbol: "TVC:GB10Y" },
        { name: "한국 10년물", symbol: "TVC:KR10Y" }
    ],
    sectors: [
        { name: "기술주 (XLK)", symbol: "XLK" },
        { name: "금융주 (XLF)", symbol: "XLF" },
        { name: "에너지 (XLE)", symbol: "XLE" },
        { name: "헬스케어 (XLV)", symbol: "XLV" },
        { name: "산업재 (XLI)", symbol: "XLI" },
        { name: "임의소비재 (XLY)", symbol: "XLY" },
        { name: "필수소비재 (XLP)", symbol: "XLP" },
        { name: "부동산·소재 (XLB)", symbol: "XLB" },
        { name: "유틸리티 (XLU)", symbol: "XLU" },
        { name: "지역은행 (KRE)", symbol: "KRE" },
        { name: "반도체 (SOXX)", symbol: "SOXX" }
    ],
    themes: [
        { name: "수소(BE) (HYDR)", symbol: "HYDR" },
        { name: "우주항공 (UFO)", symbol: "UFO" },
        { name: "바이오텍 (XBI)", symbol: "XBI" },
        { name: "태양광 (TAN)", symbol: "TAN" },
        { name: "양자 (QTUM)", symbol: "QTUM" },
        { name: "네오클라우드 (WGMI)", symbol: "WGMI" },
        { name: "원자력 (NUKZ)", symbol: "NUKZ" },
        { name: "2차전지 (LIT)", symbol: "LIT" },
        { name: "드론 (DRNZ)", symbol: "DRNZ" }
    ]
};

let currentCategory = "indices";
let currentTimeframe = "D";
let currentMode = "report";
const STRATEGY_VISIBILITY_KEY = "stanley_strategy_cards_visible";
const INTEL_PREDICTION_HISTORY_KEY = "stanley_intel_prediction_history_v1";
const INTEL_PREDICTION_MAX_ITEMS = 3000;
const INTEL_BENCHMARK_SYMBOL = "SP:SPX";
const INTEL_RISK_PROFILE_KEY = "stanley_intel_risk_profile";
const INTEL_RISK_PROFILE_PRESETS = {
    aggressive: {
        label: "공격",
        allocationShift: { risk: 10, cash: -6, hedge: -4 },
        sizingShift: 0.1,
        note: "공격 성향: 조건 충족 시 리스크 비중 확대를 우선합니다."
    },
    neutral: {
        label: "중립",
        allocationShift: { risk: 0, cash: 0, hedge: 0 },
        sizingShift: 0,
        note: "중립 성향: 현재 모델 기본 배분을 그대로 사용합니다."
    },
    conservative: {
        label: "보수",
        allocationShift: { risk: -10, cash: 7, hedge: 3 },
        sizingShift: -0.1,
        note: "보수 성향: 리스크 노출보다 현금·헤지 완충을 우선합니다."
    }
};
const INTEL_HORIZON_CONFIG = {
    "1d": { ms: 24 * 60 * 60 * 1000, bullThreshold: 0.15, bearThreshold: -0.15, neutralBand: 0.6 },
    "5d": { ms: 5 * 24 * 60 * 60 * 1000, bullThreshold: 0.5, bearThreshold: -0.5, neutralBand: 1.5 }
};
const GLOBAL_MARKET_SECTIONS = [
    {
        title: "US Equity Benchmarks",
        description: "Overnight tone from major US risk assets.",
        items: ["SP:SPX", "NASDAQ:NDX", "DJ:DJI", "RUSSELL:RUT"]
    },
    {
        title: "Asia & Europe",
        description: "Cross-region index check for follow-through and rotation.",
        items: ["KRX:KOSPI", "KRX:KOSDAQ", "NI225", "HSI", "DAX", "UK100", "PX1"]
    },
    {
        title: "FX Board",
        description: "Dollar, won, yen and G10 pairs that steer liquidity.",
        items: ["TVC:DXY", "FX_IDC:USDKRW", "FX:USDJPY", "FX:EURUSD", "FX:GBPUSD", "FX:AUDUSD"]
    },
    {
        title: "Rates & Credit",
        description: "Curve shape and sovereign yields that frame valuation.",
        items: ["TVC:US02Y", "TVC:US10Y", "TVC:US30Y", "TVC:DE10Y", "TVC:JP10Y", "TVC:GB10Y", "TVC:KR10Y"]
    },
    {
        title: "Commodities",
        description: "Inflation pulse, energy tone and real asset leadership.",
        items: ["TVC:GOLD", "TVC:SILVER", "COMEX:HG1!", "TVC:USOIL", "TVC:UKOIL", "NYMEX:NG1!"]
    },
    {
        title: "Themes & Cyclicals",
        description: "High beta leadership and sector risk appetite.",
        items: ["XLK", "XLF", "XLE", "XLV", "XLI", "SOXX", "LIT", "QTUM"]
    }
];
/* const GLOBAL_MARKET_CHARTS = [
    { id: "usatec", name: "나스닥 선물", ticker: "USATEC", chartSymbol: "USATEC", dataSymbol: "NASDAQ:NDX", description: "US TECH 100 CASH INDEX", accent: "🇺🇸" },
    { id: "usoil", name: "국제유가", ticker: "USOIL", chartSymbol: "USOIL", dataSymbol: "TVC:USOIL", description: "WTI CRUDE OIL", accent: "🛢" },
    { id: "usdkrw", name: "원달러", ticker: "USDKRW", chartSymbol: "USDKRW", dataSymbol: "FX_IDC:USDKRW", description: "USD / KRW", accent: "💱" },
    { id: "xauusd", name: "국제금", ticker: "XAUUSD", chartSymbol: "XAUUSD", dataSymbol: "OANDA:XAUUSD", description: "GOLD SPOT / USD", accent: "🥇" },
    { id: "btcusdt", name: "비트코인", ticker: "BTCUSDT", chartSymbol: "BTCUSDT", dataSymbol: "BINANCE:BTCUSDT", description: "BITCOIN / TETHER", accent: "₿" }
];
*/ const GLOBAL_MARKET_CHARTS_LIVE = [
    { id: "usatec", name: "Nasdaq Futures", ticker: "USATEC", chartSymbol: "ACTIVTRADES:USATEC", dataSymbol: "NASDAQ:NDX", description: "US TECH 100 CASH INDEX", accent: "US" },
    { id: "usoil", name: "WTI Crude", ticker: "USOIL", chartSymbol: "TVC:USOIL", dataSymbol: "TVC:USOIL", description: "WTI CRUDE OIL", accent: "OI" },
    { id: "usdkrw", name: "USD/KRW", ticker: "USDKRW", chartSymbol: "FX_IDC:USDKRW", dataSymbol: "FX_IDC:USDKRW", description: "USD / KRW", accent: "FX" },
    { id: "xauusd", name: "Gold Spot", ticker: "XAUUSD", chartSymbol: "OANDA:XAUUSD", dataSymbol: "TVC:GOLD", description: "GOLD SPOT / USD", accent: "AU" },
    { id: "soxx", name: "iShares PHLX SOX Semiconductor", ticker: "SOXX", chartSymbol: "NASDAQ:SOXX", dataSymbol: "SOXX", description: "ISHARES PHLX SOX SEMICONDUCTOR ETF", accent: "SX" },
    { id: "vix", name: "Volatility S&P 500", ticker: "VIX", chartSymbol: "CAPITALCOM:VIX", dataSymbol: "VIX", description: "VOLATILITY INDEX (CAPITAL.COM)", accent: "VX" },
    { id: "btcusdt", name: "Bitcoin", ticker: "BTCUSDT", chartSymbol: "BINANCE:BTCUSDT", dataSymbol: "BTCUSDT", description: "BITCOIN / TETHER", accent: "BT" },
    { id: "ethusd", name: "Ethereum", ticker: "ETHUSD", chartSymbol: "COINBASE:ETHUSD", dataSymbol: "ETHUSDT", description: "ETHEREUM / U.S. DOLLAR", accent: "ET" }
];
const GLOBAL_MARKET_INTERVAL_OPTIONS = [
    { label: "1분", value: "1" },
    { label: "5분", value: "5" },
    { label: "30분", value: "30" },
    { label: "1시간", value: "60" },
    { label: "4시간", value: "240" },
    { label: "일", value: "D" },
    { label: "주", value: "W" },
    { label: "월", value: "M" }
];
const globalMarketIntervals = Object.fromEntries(GLOBAL_MARKET_CHARTS_LIVE.map(item => [item.id, "5"]));
const GLOBAL_MARKET_ORDER_KEY = "stanley_global_market_order_v1";

function getOrderedGlobalMarketCharts() {
    let savedOrder = [];
    try {
        savedOrder = JSON.parse(localStorage.getItem(GLOBAL_MARKET_ORDER_KEY) || "[]");
    } catch (e) {
        savedOrder = [];
    }

    const byId = new Map(GLOBAL_MARKET_CHARTS_LIVE.map(item => [item.id, item]));
    const ordered = [];

    savedOrder.forEach((id) => {
        if (byId.has(id)) {
            ordered.push(byId.get(id));
            byId.delete(id);
        }
    });

    GLOBAL_MARKET_CHARTS_LIVE.forEach((item) => {
        if (byId.has(item.id)) {
            ordered.push(item);
            byId.delete(item.id);
        }
    });

    return ordered;
}

function saveGlobalMarketCardOrder() {
    const cards = Array.from(document.querySelectorAll(".global-chart-grid .global-chart-card"));
    const ids = cards
        .map(card => (card.id || "").replace("card-", ""))
        .filter(Boolean);
    localStorage.setItem(GLOBAL_MARKET_ORDER_KEY, JSON.stringify(ids));
}

function initGlobalMarketCardDragAndDrop() {
    const grid = document.querySelector(".global-chart-grid");
    if (!grid) return;

    let draggingCard = null;
    const cards = Array.from(grid.querySelectorAll(".global-chart-card"));

    cards.forEach((card) => {
        card.setAttribute("draggable", "true");
        card.dataset.dragReady = "0";

        const handle = card.querySelector(".global-drag-handle");
        if (handle) {
            handle.addEventListener("mousedown", () => {
                card.dataset.dragReady = "1";
            });
            handle.addEventListener("mouseup", () => {
                card.dataset.dragReady = "0";
            });
            handle.addEventListener("mouseleave", () => {
                card.dataset.dragReady = "0";
            });
            handle.addEventListener("touchstart", () => {
                card.dataset.dragReady = "1";
            }, { passive: true });
            handle.addEventListener("touchend", () => {
                card.dataset.dragReady = "0";
            }, { passive: true });
        }

        card.addEventListener("dragstart", (event) => {
            if (card.dataset.dragReady !== "1") {
                event.preventDefault();
                return;
            }
            draggingCard = card;
            card.classList.add("dragging");
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", card.id || "");
            }
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
            card.dataset.dragReady = "0";
            draggingCard = null;
            saveGlobalMarketCardOrder();
        });
    });

    grid.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (!draggingCard) return;

        const targetCard = event.target.closest(".global-chart-card");
        if (!targetCard || targetCard === draggingCard) return;

        const rect = targetCard.getBoundingClientRect();
        const insertBefore = event.clientY < rect.top + rect.height / 2;

        if (insertBefore) {
            grid.insertBefore(draggingCard, targetCard);
        } else {
            grid.insertBefore(draggingCard, targetCard.nextElementSibling);
        }
    });
}

const MACRO_WISDOM = {
    "yield_curve_3m": {
        title: "경기 사이클 (10Y-3M Spread)",
        definition: "10년물 국채 금리(장기)에서 3개월물 국채 금리(단기)를 뺀 값입니다. 정상적인 경제 상황에서는 장기 금리가 단기 금리보다 높습니다.",
        importance: "장단기 금리차가 마이너스가 되는 '역전' 현상은 지난 50년간 거의 모든 경기 침체의 정확한 전조 증상이었습니다. 드러켄밀러는 이 지표가 역전 후 다시 정상화되는 시점을 특히 경계합니다."
    },
    "yield_curve_2y": {
        title: "경기 사이클 (10Y-2Y Spread)",
        definition: "10년물 국채 금리(장기)에서 2년물 국채 금리(단기)를 뺀 값입니다.",
        importance: "금융 시장에서 가장 대중적으로 사용되는 경기 침체 예고 지표입니다. 10Y-3M보다 선행성이 다소 빠르거나 민감하게 반응하여 투자자들이 가장 눈여겨보는 스프레드입니다."
    },
    "cu_au": {
        title: "구리/금 비율 (경기 성장)",
        definition: "산업용 금속인 구리와 안전자산인 금의 가격 비율입니다.",
        importance: "구리 가격이 금보다 빠르게 오르면 실물 경기 활성화와 인플레이션 기대를 의미하며, 반대의 경우 경기 둔화 신호로 해석합니다."
    },
    "liquidity": {
        title: "달러 인덱스 (유동성 지표)",
        definition: "주요 6개 통화에 대한 달러의 가치를 지수화한 것입니다.",
        importance: "달러 강세는 전 세계 유동성 회수를 의미하여 자산 가격에 압박을 주며, 달러 약세는 유동성 공급으로 이어져 시장에 우호적인 환경을 조성합니다."
    },
    "spy_tlt": {
        title: "주식/채권 비율 (위험 선호)",
        definition: "S&P 500 지수(주식)를 국채 ETF(TLT)로 나눈 비율입니다.",
        importance: "이 비율이 상승하면 투자자들이 위험 자산(주식)을 선호하는 '리스크 온' 상태임을, 하락하면 안전 자산(채권)으로 숨는 '리스크 오프' 상태임을 나타냅니다."
    },
    "growth_value": {
        title: "성장/가치 비율 (스타일)",
        definition: "성장주 ETF(VUG)와 가치주 ETF(VTV)의 가격 비율입니다.",
        importance: "저금리 시기에는 성장주가 유리하고, 금리 상승기나 경기 회복기에는 저평가된 가치주가 유리한 경향이 있습니다."
    },
    "credit_stress": {
        title: "신용 긴장도 (Credit Stress)",
        definition: "하이일드 채권(부도 위험이 높은 채권)과 국채(안전자산)의 수익률 차이(스프레드)를 반영합니다.",
        importance: "이 격차가 벌어지면 기업들의 부도 위험이 커지고 시장에 공포가 확산되고 있다는 강력한 위험 신호입니다."
    }
};

const chartGrid = document.getElementById("chart-grid");
const modeBtns = document.querySelectorAll(".mode-btn");
const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const DATA_BOOT_TIMEOUT_MS = 30000;
const DATA_BOOT_RETRY_MS = 1000;
const OPTIONS_DEFAULT_TICKER = "AAPL";

const optionsViewState = {
    ticker: OPTIONS_DEFAULT_TICKER,
    selectedExpiry: "",
    activeTab: "summary",
    loading: false,
    error: "",
    data: null,
    chart: null,
    hasLoadedOnce: false
};

// Add Fade-in Animation Styles
const viewStyle = document.createElement('style');
viewStyle.innerHTML = `
    .view-fade-in {
        animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(viewStyle);

function triggerViewTransition(animate = true) {
    chartGrid.classList.remove('view-fade-in');
    if (animate) {
        void chartGrid.offsetWidth; // Force reflow
        chartGrid.classList.add('view-fade-in');
    }
}

function renderDataLoadFailure(reason = "데이터 파일을 찾을 수 없습니다.") {
    if (chartGrid) {
        chartGrid.className = "report-view";
        chartGrid.innerHTML = `
            <div class="data-error-state">
                <h2>데이터를 불러오지 못했습니다</h2>
                <p>${reason}</p>
                <div class="data-error-actions">
                    <button type="button" class="mode-btn active" onclick="window.location.reload()">새로고침</button>
                </div>
            </div>
        `;
    }

    const updatedText = document.getElementById("last-updated-text");
    const timerText = document.getElementById("refresh-timer");
    const playbookContainer = document.getElementById("playbook-container");
    const sentimentContainer = document.getElementById("sentiment-container");

    if (updatedText) {
        updatedText.textContent = "최근 업데이트: 데이터 없음";
    }
    if (timerText) {
        timerText.textContent = "--:--";
    }
    if (playbookContainer) {
        playbookContainer.innerHTML = `
            <div class="playbook-card">
                <div class="playbook-header">
                    <span class="section-kicker">데이터 상태</span>
                    <strong>수집 실패</strong>
                </div>
                <p class="playbook-summary">현재 세션에서는 데이터 파일이 생성되지 않아 분석 카드가 비활성화되었습니다.</p>
            </div>
        `;
    }
    if (sentimentContainer) {
        sentimentContainer.innerHTML = "";
    }
}

function appendDataScript({ id = "data-refresh-script", onLoad, onError } = {}) {
    const oldScript = document.getElementById(id);
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = id;
    script.src = "data.js?t=" + Date.now();
    script.onload = () => {
        window.__dashboardDataScriptStatus = "loaded";
        if (typeof onLoad === "function") onLoad();
    };
    script.onerror = () => {
        window.__dashboardDataScriptStatus = "failed";
        if (typeof onError === "function") onError();
    };
    document.body.appendChild(script);
}

function bootstrapDashboardData(initData) {
    if (window.DASHBOARD_DATA) {
        initData();
        return;
    }

    const startedAt = Date.now();
    let inFlight = false;

    const tryFetch = () => {
        if (window.DASHBOARD_DATA || inFlight) return;
        inFlight = true;
        appendDataScript({
            id: "data-bootstrap-script",
            onLoad: () => {
                inFlight = false;
                if (window.DASHBOARD_DATA) {
                    initData();
                }
            },
            onError: () => {
                inFlight = false;
            }
        });
    };

    tryFetch();

    const retry = setInterval(() => {
        if (window.DASHBOARD_DATA) {
            clearInterval(retry);
            initData();
            return;
        }

        if (Date.now() - startedAt >= DATA_BOOT_TIMEOUT_MS) {
            clearInterval(retry);
            renderDataLoadFailure("data.js 생성이 지연되고 있습니다. 서버/스크래퍼 상태를 확인한 뒤 새로고침해 주세요.");
            return;
        }

        tryFetch();
    }, DATA_BOOT_RETRY_MS);
}

document.addEventListener("DOMContentLoaded", () => {
    const calendarModeBtn = document.querySelector('.mode-btn[data-mode="calendar"]');
    if (calendarModeBtn) calendarModeBtn.remove();

    initTheme();
    loadTickerTape();
    sortModeButtons();
    
    // Load immediately if data is present
    const initData = () => {
        loadCategory(currentCategory);
        displayMetadata();
        syncIntelPredictionHistory();
        renderSentiment();
        renderPlaybookSidebar();
        triggerViewTransition();
    };

    bootstrapDashboardData(initData);
    // Add popover dismissal listeners
    const overlay = document.getElementById('popover-overlay');
    const closeBtn = document.getElementById('close-popover');
    if (overlay) overlay.onclick = closeMacroWisdom;
    if (closeBtn) closeBtn.onclick = closeMacroWisdom;

    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener("click", () => {
            document.body.classList.toggle("hide-sidebar");
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("druckenmiller_theme", isDark ? "dark" : "light");
            // Reload widgets for theme compatibility
            loadTickerTape();
            rerenderCurrentMode();
        });
    }

    modeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentMode = btn.dataset.mode;
            if (currentMode !== "options") {
                destroyOptionsChart();
            }
            
            chartGrid.className = ""; // Reset
            if (currentMode === "report") chartGrid.classList.add("report-view");
            if (currentMode === "global") chartGrid.classList.add("global-view");
            if (currentMode === "intel") chartGrid.classList.add("report-view");
            if (currentMode === "options") chartGrid.classList.add("options-view");
            if (currentMode === "gurus") chartGrid.classList.add("gurus-view");
            
            if (currentMode === "gurus") {
                renderGurusView();
            } else if (currentMode === "options") {
                renderOptionsView();
            } else if (currentMode === "global") {
                renderGlobalView();
            } else if (currentMode === "intel") {
                renderIntelView();
            } else {
                loadCategory(currentCategory);
            }
            triggerViewTransition(true);
        });
    });
    startAutoRefresh(10); // 10-second polling
});

function areStrategyCardsVisible() {
    return localStorage.getItem(STRATEGY_VISIBILITY_KEY) === "1";
}

function rerenderCurrentMode(animate = true) {
    if (currentMode !== "options") {
        destroyOptionsChart();
    }
    if (currentMode === "gurus") {
        renderGurusView();
    } else if (currentMode === "options") {
        renderOptionsView();
    } else if (currentMode === "global") {
        renderGlobalView();
    } else if (currentMode === "intel") {
        renderIntelView();
    } else {
        loadCategory(currentCategory);
    }
    triggerViewTransition(animate);
}

function toggleStrategyCards() {
    localStorage.setItem(STRATEGY_VISIBILITY_KEY, areStrategyCardsVisible() ? "0" : "1");
    rerenderCurrentMode();
}

function getIntelRiskProfile() {
    const saved = localStorage.getItem(INTEL_RISK_PROFILE_KEY);
    return saved && INTEL_RISK_PROFILE_PRESETS[saved] ? saved : "neutral";
}

function setIntelRiskProfile(profile) {
    if (!INTEL_RISK_PROFILE_PRESETS[profile]) return;
    localStorage.setItem(INTEL_RISK_PROFILE_KEY, profile);
    rerenderCurrentMode();
}

function showMacroWisdom(key) {
    const wisdom = MACRO_WISDOM[key];
    if (!wisdom) return;

    const overlay = document.getElementById('popover-overlay');
    const popover = document.getElementById('macro-popover');
    const content = document.getElementById('popover-content');

    content.innerHTML = `
        <h2>${wisdom.title}</h2>
        <div class="popover-section">
            <h3>지표의 정의</h3>
            <p>${wisdom.definition}</p>
        </div>
        <div class="popover-section">
            <h3>투자 시 핵심 포인트</h3>
            <p>${wisdom.importance}</p>
        </div>
    `;

    overlay.classList.add('active');
    popover.classList.add('active');
}

function closeMacroWisdom() {
    const overlay = document.getElementById('popover-overlay');
    const popover = document.getElementById('macro-popover');
    overlay.classList.remove('active');
    popover.classList.remove('active');
}

function startAutoRefresh(seconds) {
    let remaining = seconds;
    const timerEl = document.getElementById("refresh-timer");
    const renderTimer = () => {
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        if (timerEl) {
            timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    };
    renderTimer();
    
    const interval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            remaining = seconds; // Reset for next cycle
            refreshDataSilently();
        } else {
            renderTimer();
        }
    }, 1000);
}

function refreshDataSilently() {
    appendDataScript({
        id: "data-refresh-script",
        onLoad: () => {
            // Optional legacy hook
            if (typeof saveNotes === "function") {
                saveNotes();
            }
            if (!window.DASHBOARD_DATA) {
                renderDataLoadFailure("data.js를 읽었지만 유효한 데이터 객체가 없습니다.");
                return;
            }
            displayMetadata();
            syncIntelPredictionHistory();
            // Global view: skip full re-render to remove 1-minute flicker motion.
            if (currentMode !== "global") {
                rerenderCurrentMode(false); // false = no animation
            }
            renderSentiment();
            renderPlaybookSidebar();
            console.log("Data refreshed silently at " + new Date().toLocaleTimeString());
        },
        onError: () => {
            renderDataLoadFailure("자동 새로고침 중 data.js 로드에 실패했습니다.");
        }
    });
}

function initTheme() {
    const saved = localStorage.getItem("druckenmiller_theme");
    if (saved === "dark") {
        document.body.classList.add("dark-theme");
    } else if (saved === "light") {
        document.body.classList.remove("dark-theme");
    } else {
        // Auto-theme based on time (6 PM to 6 AM is Dark)
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 6) {
            document.body.classList.add("dark-theme");
        }
    }
}

function getTimeZoneParts(date, timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(date);

    const get = (type) => parts.find(p => p.type === type)?.value || "";
    return {
        weekday: get("weekday"),
        hour: Number(get("hour")),
        minute: Number(get("minute"))
    };
}

function getSessionState(now, config) {
    const p = getTimeZoneParts(now, config.timeZone);
    const isWeekend = p.weekday === "Sat" || p.weekday === "Sun";
    const minuteOfDay = p.hour * 60 + p.minute;
    const isOpen = !isWeekend && minuteOfDay >= config.openMinute && minuteOfDay < config.closeMinute;
    return `${config.name}: ${isOpen ? "OPEN" : "CLOSED"}`;
}

function getMarketSessionSummary() {
    const now = new Date();
    const us = getSessionState(now, {
        name: "US Market",
        timeZone: "America/New_York",
        openMinute: 9 * 60 + 30,
        closeMinute: 16 * 60
    });
    const kr = getSessionState(now, {
        name: "KR Market",
        timeZone: "Asia/Seoul",
        openMinute: 9 * 60,
        closeMinute: 15 * 60 + 30
    });
    return `${us} | ${kr}`;
}

function displayMetadata() {
    if (window.DASHBOARD_DATA && window.DASHBOARD_DATA.last_updated) {
        const text = document.getElementById("last-updated-text");
        if (text) text.textContent = `Last updated: ${window.DASHBOARD_DATA.last_updated}`;
    }
    const sessionText = document.getElementById("market-session-text");
    if (sessionText) {
        sessionText.textContent = getMarketSessionSummary();
    }
}

function loadTickerTape() {
    const symbols = [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "FX_IDC:USDKRW", title: "원/달러 환율" },
        { proName: "BITSTAMP:BTCUSD", title: "비트코인" },
        { proName: "BITSTAMP:ETHUSD", title: "이더리움" },
        { proName: "TVC:GOLD", title: "금" },
        { proName: "TVC:SILVER", title: "은" }
    ];

    const container = document.getElementById("ticker-tape-container");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "symbols": symbols,
        "showSymbolLogo": true,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "ko"
    });
    container.appendChild(script);
}

function loadCategory(cat) {
    chartGrid.innerHTML = "";
    
    if (currentMode === "report") {
        renderReportView();
        return;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function destroyOptionsChart() {
    if (optionsViewState.chart) {
        optionsViewState.chart.destroy();
        optionsViewState.chart = null;
    }
}

function getOptionsPcrDescriptor(pcrValue) {
    if (!Number.isFinite(pcrValue)) {
        return {
            badge: "데이터 없음",
            badgeClass: "options-badge-neutral",
            summaryHtml: "풋/콜 비율을 계산할 데이터가 충분하지 않습니다."
        };
    }
    if (pcrValue >= 1.0) {
        return {
            badge: "극도의 공포 (Bearish)",
            badgeClass: "options-badge-negative",
            summaryHtml: "시장에 하락(풋)에 베팅하는 물량이 더 많습니다.<br>하지만 역발상 관점에서는 바닥 신호가 될 수 있습니다."
        };
    }
    if (pcrValue <= 0.7) {
        return {
            badge: "극도의 낙관 (Bullish)",
            badgeClass: "options-badge-positive",
            summaryHtml: "시장에 상승(콜) 베팅이 압도적으로 많습니다.<br>낙관이 과도한 단기 고점 구간일 가능성을 함께 확인해야 합니다."
        };
    }
    return {
        badge: "중립",
        badgeClass: "options-badge-neutral",
        summaryHtml: "상승/하락 베팅이 비교적 균형 상태입니다.<br>방향성보다 변동성 확대 여부를 우선 점검하세요."
    };
}

function getOptionsDisparityClass(disparity) {
    if (!Number.isFinite(disparity)) return "options-badge-neutral";
    if (disparity > 0) return "options-badge-positive";
    if (disparity < 0) return "options-badge-negative";
    return "options-badge-neutral";
}

async function fetchOptionsApi(pathWithQuery) {
    const localApiUrl = `http://127.0.0.1:8080${pathWithQuery}`;
    const candidates = [localApiUrl];

    const isValidOptionsPayload = (payload) => {
        if (!payload || typeof payload !== "object") return false;
        if (payload.error) return true;
        const cp = Number(payload.current_price);
        const mp = Number(payload.max_pain_price);
        if (!Number.isFinite(cp) || cp <= 0) return false;
        if (!Number.isFinite(mp) || mp <= 0) return false;
        if (mp > cp * 10 || mp < cp * 0.1) return false;
        return true;
    };

    let lastError = null;
    for (let i = 0; i < candidates.length; i += 1) {
        const url = candidates[i];
        const isLast = i === candidates.length - 1;
        try {
            const res = await fetch(url, { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || `옵션 데이터 조회 실패 (${res.status})`);
            }
            if (isValidOptionsPayload(data)) return data;
            if (!isLast) continue;
            throw new Error("옵션 API 응답 형식이 올바르지 않습니다.");
        } catch (err) {
            lastError = err;
            if (!isLast) continue;
        }
    }
    throw lastError || new Error("옵션 데이터를 불러오지 못했습니다.");
}

async function fetchOptionsData(ticker, expiry = "") {
    const cleanTicker = String(ticker || "").trim().toUpperCase();
    if (!cleanTicker) {
        optionsViewState.error = "티커를 입력해 주세요.";
        optionsViewState.loading = false;
        renderOptionsView();
        return;
    }

    optionsViewState.loading = true;
    optionsViewState.error = "";
    optionsViewState.ticker = cleanTicker;
    if (!expiry) {
        optionsViewState.selectedExpiry = "";
    }
    destroyOptionsChart();
    renderOptionsView();

    try {
        const params = new URLSearchParams({ ticker: cleanTicker });
        if (expiry) params.set("expiry", expiry);
        const data = await fetchOptionsApi(`/api/maxpain?${params.toString()}`);

        optionsViewState.data = data;
        optionsViewState.loading = false;
        optionsViewState.error = "";
        optionsViewState.hasLoadedOnce = true;
        optionsViewState.ticker = data.ticker || cleanTicker;
        optionsViewState.selectedExpiry = data.expiry_date || "";
        renderOptionsView();
    } catch (err) {
        optionsViewState.loading = false;
        if (String(err).includes("Failed to fetch") || String(err).includes("NetworkError")) {
            optionsViewState.error = "서버에 연결할 수 없습니다. `python server.py` 또는 `Run_Druckenmiller.bat`를 실행해 주세요.";
        } else {
            optionsViewState.error = err?.message || "옵션 데이터를 불러오지 못했습니다.";
        }
        renderOptionsView();
    }
}

function renderOptionsChart(chartData) {
    if (!chartData || typeof Chart === "undefined") return;
    const canvas = document.getElementById("options-oi-chart");
    if (!canvas) return;

    const strikes = Array.isArray(chartData.strikes) ? chartData.strikes : [];
    const calls = Array.isArray(chartData.calls_oi) ? chartData.calls_oi : [];
    const puts = Array.isArray(chartData.puts_oi) ? chartData.puts_oi : [];
    if (!strikes.length) return;

    destroyOptionsChart();
    const isDark = document.body.classList.contains("dark-theme");
    const tickColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "rgba(148,163,184,0.15)" : "rgba(15,23,42,0.08)";

    optionsViewState.chart = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: strikes,
            datasets: [
                {
                    label: "콜 OI (저항)",
                    data: calls,
                    backgroundColor: "rgba(16, 185, 129, 0.55)",
                    borderColor: "rgba(16, 185, 129, 1)",
                    borderWidth: 1,
                    stack: "stack-call"
                },
                {
                    label: "풋 OI (지지)",
                    data: puts,
                    backgroundColor: "rgba(239, 68, 68, 0.55)",
                    borderColor: "rgba(239, 68, 68, 1)",
                    borderWidth: 1,
                    stack: "stack-put"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    labels: { color: tickColor }
                },
                tooltip: {
                    backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.95)",
                    titleColor: isDark ? "#f8fafc" : "#0f172a",
                    bodyColor: isDark ? "#e2e8f0" : "#0f172a",
                    borderColor: isDark ? "rgba(148,163,184,0.35)" : "rgba(15,23,42,0.15)",
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: tickColor },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: { color: tickColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function renderOptionsView() {
    chartGrid.className = "options-view";
    const state = optionsViewState;
    const data = state.data;
    const activeTab = state.activeTab || "summary";

    const pcrRaw = Number(data?.pcr_value);
    const pcrValue = Number.isFinite(pcrRaw) ? pcrRaw : null;
    const pcrDescriptor = getOptionsPcrDescriptor(pcrValue ?? 0);
    const disparity = Number(data?.disparity_rate);
    const disparityClass = getOptionsDisparityClass(disparity);
    const disparityText = Number.isFinite(disparity) ? `${disparity > 0 ? "+" : ""}${disparity.toFixed(2)}%` : "-";
    const atmIvRaw = Number(data?.atm_iv);
    const atmIvText = Number.isFinite(atmIvRaw) ? `${atmIvRaw.toFixed(2)}%` : "-";
    const currentPriceRaw = Number(data?.current_price);
    const maxPainRaw = Number(data?.max_pain_price);
    const currentPriceText = Number.isFinite(currentPriceRaw) ? `$${currentPriceRaw.toFixed(2)}` : "-";
    const maxPainText = Number.isFinite(maxPainRaw) ? `$${maxPainRaw.toFixed(2)}` : "-";

    const summaryTabHtml = data ? `
        <div class="options-data-grid">
            <div class="options-data-item">
                <span class="options-label">현재 주가</span>
                <span class="options-value">${currentPriceText}</span>
            </div>
            <div class="options-data-item">
                <span class="options-label">분석 만기일</span>
                <span class="options-value options-text-blue">${escapeHtml(data.expiry_date)}</span>
            </div>
            <div class="options-data-item options-data-highlight">
                <span class="options-label">Max Pain (기관 목표가)</span>
                <span class="options-value options-text-gradient">${maxPainText}</span>
            </div>
            <div class="options-data-item">
                <span class="options-label">괴리율 추정</span>
                <span class="options-pill options-disparity-badge ${disparityClass}">${disparityText}</span>
            </div>
        </div>
    ` : '<div class="options-empty">티커를 조회하면 요약 지표가 표시됩니다.</div>';

    const chartTabHtml = data ? `
        <div class="options-chart-wrap">
            <h4 class="options-section-title">미결제약정(OI) 방어선 차트</h4>
            <p class="options-section-desc">현재가 위아래 20% 이내 행사가의 콜/풋 미결제 물량입니다.</p>
            <div class="options-chart-canvas">
                <canvas id="options-oi-chart"></canvas>
            </div>
        </div>
    ` : '<div class="options-empty">차트 데이터가 없습니다.</div>';

    const pcrTabHtml = data ? `
        <h4 class="options-section-title">풋/콜 비율 (Put/Call Ratio)</h4>
        <p class="options-section-desc">시장의 매수(콜) vs 매도(풋) 심리를 나타냅니다.</p>
        <div class="options-pcr-panel">
            <div class="options-pcr-score">
                <span class="options-pcr-value">${pcrValue === null ? "-" : pcrValue.toFixed(2)}</span>
                <span class="options-pill ${pcrDescriptor.badgeClass}">${pcrDescriptor.badge}</span>
            </div>
            <p class="options-pcr-explanation">${pcrDescriptor.summaryHtml}</p>
        </div>
    ` : '<div class="options-empty">PCR 데이터가 없습니다.</div>';

    const ivTabHtml = data ? `
        <h4 class="options-section-title">내재 변동성 (Implied Volatility)</h4>
        <p class="options-section-desc">옵션 만기 전까지 가격이 얼마나 크게 움직일지 보여주는 수치입니다.</p>
        <div class="options-iv-panel">
            <div class="options-iv-value">${atmIvText}</div>
            <p class="options-pcr-explanation">수치가 높을수록 만기 전 급등/급락 변동 리스크가 큽니다.</p>
        </div>
    ` : '<div class="options-empty">IV 데이터가 없습니다.</div>';

    chartGrid.innerHTML = `
        <section class="options-shell">
            <div class="options-background-effects">
                <div class="options-glow options-glow-1"></div>
                <div class="options-glow options-glow-2"></div>
            </div>

            <header class="options-hero">
                <h2><span class="options-gradient-text">Max Pain</span> 프로</h2>
                <p>미국 주식 전문 옵션 데이터 시각화 보드</p>
            </header>

            <div class="options-search-row">
                <form id="options-search-form" class="options-search-form">
                    <div class="options-input-group">
                        <svg class="options-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input id="options-ticker-input" type="text" value="${escapeHtml(state.ticker || "")}" placeholder="티커 검색 (예: TSLA, AAPL)" />
                        <button type="submit">조회</button>
                    </div>
                </form>
                <div class="options-meta">
                    ${data ? `<strong>${escapeHtml(data.ticker)}</strong><span>${escapeHtml(data.current_time || "")}${data.calc_version ? ` · ${escapeHtml(data.calc_version)}` : ""}${data.metric_source ? ` · ${escapeHtml(data.metric_source)}` : ""}</span>` : '<span>미국 주식 옵션 체인 기반 Max Pain 분석</span>'}
                </div>
            </div>

            ${state.error ? `<div class="options-alert">${escapeHtml(state.error)}</div>` : ""}
            ${state.loading ? `
                <div class="options-loading">
                    <div class="spinner"></div>
                    <p>방대한 옵션 체인 데이터를 분석 중입니다...</p>
                </div>
            ` : ""}

            ${!state.loading && data ? `
                <div class="options-card options-glass-card">
                    <div class="options-card-head">
                        <div class="options-header-left">
                            <h3><span class="options-ticker-highlight">${escapeHtml(data.ticker)}</span></h3>
                            <span class="options-time-badge">${escapeHtml(data.current_time || "")}</span>
                        </div>
                        <select id="options-expiry-select" class="options-expiry-select">
                            ${(data.available_expirations || []).map(exp => `
                                <option value="${escapeHtml(exp)}" ${exp === data.expiry_date ? "selected" : ""}>${escapeHtml(exp)}</option>
                            `).join("")}
                        </select>
                    </div>
                    <div class="options-tabs">
                        <button class="options-tab-btn ${activeTab === "summary" ? "active" : ""}" data-tab="summary">📊 요약 지표</button>
                        <button class="options-tab-btn ${activeTab === "chart" ? "active" : ""}" data-tab="chart">📈 물량 차트</button>
                        <button class="options-tab-btn ${activeTab === "pcr" ? "active" : ""}" data-tab="pcr">⚖️ 심리 분석</button>
                        <button class="options-tab-btn ${activeTab === "iv" ? "active" : ""}" data-tab="iv">🌪️ 변동성</button>
                    </div>
                    <div class="options-tab-body">
                        ${activeTab === "summary" ? summaryTabHtml : ""}
                        ${activeTab === "chart" ? chartTabHtml : ""}
                        ${activeTab === "pcr" ? pcrTabHtml : ""}
                        ${activeTab === "iv" ? ivTabHtml : ""}
                    </div>
                    <div class="options-card-footer">
                        전문가용 4대 지표 교차 분석: ① Max Pain(방향), ② OI 차트(지지/저항), ③ PCR(심리), ④ IV(변동성)
                    </div>
                </div>

                ${data.ai_analysis ? `
                    <div class="options-ai-container">
                        <header class="options-ai-header">
                            <span class="options-pill options-pill-ai">🤖 AI 전문가 분석</span>
                            <h4>시각에 따른 3인 3색 대응 전략</h4>
                        </header>
                        <div class="options-persona-grid">
                            <div class="persona-card persona-prof ${data.ai_analysis.professional.tone}">
                                <div class="persona-head">
                                    <div class="persona-avatar">💼</div>
                                    <h5>${escapeHtml(data.ai_analysis.professional.name)}</h5>
                                </div>
                                <p class="persona-opinion">${escapeHtml(data.ai_analysis.professional.opinion)}</p>
                            </div>
                            <div class="persona-card persona-trader ${data.ai_analysis.trader.tone}">
                                <div class="persona-head">
                                    <div class="persona-avatar">🔥</div>
                                    <h5>${escapeHtml(data.ai_analysis.trader.name)}</h5>
                                </div>
                                <p class="persona-opinion">${escapeHtml(data.ai_analysis.trader.opinion)}</p>
                            </div>
                            <div class="persona-card persona-manager ${data.ai_analysis.manager.tone}">
                                <div class="persona-head">
                                    <div class="persona-avatar">🛡️</div>
                                    <h5>${escapeHtml(data.ai_analysis.manager.name)}</h5>
                                </div>
                                <p class="persona-opinion">${escapeHtml(data.ai_analysis.manager.opinion)}</p>
                            </div>
                        </div>
                    </div>
                ` : ""}
            ` : ""}
        </section>
    `;

    const form = document.getElementById("options-search-form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = document.getElementById("options-ticker-input");
            const ticker = input ? input.value : "";
            fetchOptionsData(ticker, "");
        });
    }

    const expirySelect = document.getElementById("options-expiry-select");
    if (expirySelect) {
        expirySelect.addEventListener("change", (event) => {
            fetchOptionsData(state.ticker || data?.ticker || OPTIONS_DEFAULT_TICKER, event.target.value);
        });
    }

    document.querySelectorAll(".options-tab-btn").forEach((button) => {
        button.addEventListener("click", () => {
            state.activeTab = button.dataset.tab || "summary";
            renderOptionsView();
        });
    });

    if (activeTab === "chart" && data && !state.loading) {
        requestAnimationFrame(() => renderOptionsChart(data.chart_data));
    } else {
        destroyOptionsChart();
    }

    if (!state.hasLoadedOnce && !state.loading && !state.data && !state.error) {
        fetchOptionsData(state.ticker || OPTIONS_DEFAULT_TICKER, state.selectedExpiry);
    }
}

function buildTodayConclusion(intel) {
    const leadWarning = intel.riskWarnings[0];
    if (intel.regime.tone === "bullish") {
        return `리스크 온으로 기울어 있지만 확신도는 ${intel.confidence.score}/100 수준입니다. ${leadWarning || "주도주 확산이 유지되는지만 확인하면 됩니다."}`;
    }
    if (intel.regime.tone === "bearish") {
        return `방어 우위 국면입니다. ${leadWarning || "호재에도 가격이 확장되지 않는 자산부터 비중을 점검해야 합니다."}`;
    }
    return `혼조 국면입니다. 확신도 ${intel.confidence.score}/100로 방향성보다 반응 확인이 우선입니다. ${leadWarning || "달러·금리·크레딧의 재정렬을 기다리는 편이 적절합니다."}`;
}

function buildReliabilityBadges() {
    const data = window.DASHBOARD_DATA || {};
    const assets = data.assets || {};
    const fng = data.fng || {};
    const gurus = data.gurus || [];
    const bondSymbols = ASSETS.bonds.map(asset => asset.symbol);
    const bondAssets = bondSymbols.map(symbol => assets[symbol]).filter(Boolean);
    const monthlyBondCount = bondAssets.filter(item => item.frequency === "monthly").length;
    const guruSources = new Set(gurus.map(guru => guru.source).filter(Boolean));
    const hasStaticFallback = guruSources.has("Static fallback");
    const hasWhaleWisdom = guruSources.has("WhaleWisdom");

    return [
        {
            label: "시장 가격",
            status: "현재가·지연 시세",
            tone: "caution",
            detail: "대부분 Yahoo 기반 현재가와 수익률"
        },
        {
            label: "국채 금리",
            status: monthlyBondCount ? `공식 일간 + 월간 ${monthlyBondCount}` : "공식 일간 소스",
            tone: monthlyBondCount ? "mixed" : "good",
            detail: monthlyBondCount ? "기타 국채 월간 fallback 유지" : "미국·독일·영국·일본·한국 일간 소스 반영"
        },
        {
            label: "심리 지표",
            status: fng.available ? "정상 수집" : "일시 미수집",
            tone: fng.available ? "good" : "mixed",
            detail: fng.available ? "CNN Fear & Greed 최신값 반영" : "실패 시 가짜 값 없이 unavailable 처리"
        },
        {
            label: "대가 포트폴리오",
            status: hasStaticFallback ? "일부 fallback" : hasWhaleWisdom ? "WhaleWisdom / SEC" : "SEC 13F",
            tone: hasStaticFallback ? "mixed" : "good",
            detail: hasStaticFallback ? "일부 구루는 정적 데이터 fallback 포함" : "최신 공시 또는 WhaleWisdom 우선 소스"
        }
    ];
}



function loadNotes() {
    const saved = localStorage.getItem("druckenmiller_notes");
    if (saved) notesArea.value = saved;
}

function toNumber(value, fallback = 0) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDashboardTimestamp(value) {
    if (typeof value !== "string") return null;
    const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    const [, year, month, day, hour, minute, second = "0"] = match;
    const timestamp = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
    ).getTime();
    return Number.isFinite(timestamp) ? timestamp : null;
}

function loadIntelPredictionHistory() {
    try {
        const raw = localStorage.getItem(INTEL_PREDICTION_HISTORY_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn("Failed to parse intel prediction history:", error);
        return [];
    }
}

function saveIntelPredictionHistory(history) {
    try {
        localStorage.setItem(INTEL_PREDICTION_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.warn("Failed to save intel prediction history:", error);
    }
}

function scorePredictionOutcome(tone, returnPct, horizonKey) {
    const config = INTEL_HORIZON_CONFIG[horizonKey];
    if (!config || !Number.isFinite(returnPct)) return false;
    if (tone === "bullish") return returnPct >= config.bullThreshold;
    if (tone === "bearish") return returnPct <= config.bearThreshold;
    return Math.abs(returnPct) <= config.neutralBand;
}

function getPredictionKeysByHorizon(horizonKey) {
    if (horizonKey === "1d") {
        return { hitKey: "hit1d", returnKey: "return1d", evalKey: "evaluatedAt1d" };
    }
    return { hitKey: "hit5d", returnKey: "return5d", evalKey: "evaluatedAt5d" };
}

function computePredictionMetrics(history, horizonKey, sampleSize = 20) {
    const { hitKey, evalKey } = getPredictionKeysByHorizon(horizonKey);
    const resolved = history
        .filter(item => typeof item?.[hitKey] === "boolean" && Number.isFinite(item?.[evalKey]))
        .sort((a, b) => (b[evalKey] || 0) - (a[evalKey] || 0));
    const recent = resolved.slice(0, sampleSize);
    const total = recent.length;
    const hits = recent.filter(item => item[hitKey] === true).length;

    const buildToneStats = tone => {
        const rows = recent.filter(item => item.tone === tone);
        const toneHits = rows.filter(item => item[hitKey] === true).length;
        return {
            total: rows.length,
            hits: toneHits,
            precision: rows.length ? Math.round((toneHits / rows.length) * 100) : null
        };
    };

    return {
        sampleSize: total,
        hits,
        hitRate: total ? Math.round((hits / total) * 100) : null,
        bullish: buildToneStats("bullish"),
        bearish: buildToneStats("bearish")
    };
}

function buildPredictionPerformanceBadge(history) {
    const stats1d = computePredictionMetrics(history, "1d", 20);
    const stats5d = computePredictionMetrics(history, "5d", 20);
    const scoreCandidates = [stats1d.hitRate, stats5d.hitRate].filter(Number.isFinite);
    const minScore = scoreCandidates.length ? Math.min(...scoreCandidates) : null;

    let tone = "caution";
    if (Number.isFinite(minScore) && minScore >= 60) {
        tone = "good";
    } else if (Number.isFinite(minScore) && minScore >= 50) {
        tone = "mixed";
    }

    const hitRate1dLabel = Number.isFinite(stats1d.hitRate) ? `${stats1d.hitRate}%` : "집계 대기";
    const hitRate5dLabel = Number.isFinite(stats5d.hitRate) ? `${stats5d.hitRate}%` : "집계 대기";
    const status = `1D ${hitRate1dLabel} (n=${stats1d.sampleSize}) · 5D ${hitRate5dLabel} (n=${stats5d.sampleSize})`;
    const detail = `최근 20회 기준 Bull 정밀도: 1D ${stats1d.bullish.precision ?? "--"}% (n=${stats1d.bullish.total}), 5D ${stats5d.bullish.precision ?? "--"}% (n=${stats5d.bullish.total}) | Bear 정밀도: 1D ${stats1d.bearish.precision ?? "--"}% (n=${stats1d.bearish.total}), 5D ${stats5d.bearish.precision ?? "--"}% (n=${stats5d.bearish.total})`;

    return {
        label: "예측 성능",
        status,
        tone,
        detail
    };
}

function syncIntelPredictionHistory() {
    if (!window.DASHBOARD_DATA) return [];

    const history = loadIntelPredictionHistory();
    const now = Date.now();
    const benchmarkPrice = toNumber(getAssetSnapshot(INTEL_BENCHMARK_SYMBOL)?.price, NaN);
    let hasMutations = false;

    if (Number.isFinite(benchmarkPrice) && benchmarkPrice > 0) {
        history.forEach(entry => {
            if (!entry || !Number.isFinite(entry.snapshotTs) || !Number.isFinite(entry.benchmarkPrice) || entry.benchmarkPrice <= 0) {
                return;
            }
            const ageMs = now - entry.snapshotTs;
            Object.entries(INTEL_HORIZON_CONFIG).forEach(([horizonKey, config]) => {
                const { hitKey, returnKey, evalKey } = getPredictionKeysByHorizon(horizonKey);
                if (typeof entry[hitKey] === "boolean") return;
                if (ageMs < config.ms) return;

                const returnPct = ((benchmarkPrice - entry.benchmarkPrice) / entry.benchmarkPrice) * 100;
                entry[returnKey] = Number(returnPct.toFixed(3));
                entry[hitKey] = scorePredictionOutcome(entry.tone, returnPct, horizonKey);
                entry[evalKey] = now;
                hasMutations = true;
            });
        });
    }

    const snapshotLabel = String(window.DASHBOARD_DATA.last_updated || "").trim();
    const snapshotId = snapshotLabel ? `${INTEL_BENCHMARK_SYMBOL}|${snapshotLabel}` : "";
    if (snapshotId && Number.isFinite(benchmarkPrice) && benchmarkPrice > 0) {
        const alreadyExists = history.some(item => item.id === snapshotId);
        if (!alreadyExists) {
            const intel = buildMarketIntel();
            history.push({
                id: snapshotId,
                snapshotLabel,
                snapshotTs: parseDashboardTimestamp(snapshotLabel) || now,
                createdAt: now,
                tone: intel.regime.tone,
                confidence: intel.confidence.score,
                benchmarkSymbol: INTEL_BENCHMARK_SYMBOL,
                benchmarkPrice: Number(benchmarkPrice.toFixed(4))
            });
            hasMutations = true;
        }
    }

    if (history.length > INTEL_PREDICTION_MAX_ITEMS) {
        history.splice(0, history.length - INTEL_PREDICTION_MAX_ITEMS);
        hasMutations = true;
    }

    if (hasMutations) {
        saveIntelPredictionHistory(history);
    }

    return history;
}

function rebalanceAllocation(allocation) {
    const keys = ["risk", "cash", "hedge"];
    const sanitized = keys.reduce((acc, key) => {
        const value = toNumber(allocation?.[key], 0);
        acc[key] = Math.max(0, value);
        return acc;
    }, {});
    const total = keys.reduce((sum, key) => sum + sanitized[key], 0);
    if (total <= 0) {
        return { risk: 0, cash: 100, hedge: 0 };
    }

    const scaled = keys.map(key => {
        const exact = (sanitized[key] / total) * 100;
        return {
            key,
            exact,
            floor: Math.floor(exact),
            remainder: exact - Math.floor(exact)
        };
    });

    let diff = 100 - scaled.reduce((sum, row) => sum + row.floor, 0);
    scaled.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < scaled.length && diff > 0; i += 1, diff -= 1) {
        scaled[i].floor += 1;
    }

    return scaled.reduce((acc, row) => {
        acc[row.key] = row.floor;
        return acc;
    }, {});
}

function countScenarioMet(rows = []) {
    return rows.filter(item => item && typeof item === "object" && item.met).length;
}

function buildExecutionGuide(intel) {
    const profileKey = getIntelRiskProfile();
    const profilePreset = INTEL_RISK_PROFILE_PRESETS[profileKey] || INTEL_RISK_PROFILE_PRESETS.neutral;
    const base = intel.regime.tone === "bullish"
        ? { risk: 60, cash: 25, hedge: 15 }
        : intel.regime.tone === "bearish"
            ? { risk: 25, cash: 40, hedge: 35 }
            : { risk: 40, cash: 35, hedge: 25 };

    const confidence = intel.confidence.score;
    const warnings = intel.riskWarnings.length;
    const adjusted = { ...base };

    if (intel.regime.tone === "bullish") {
        if (confidence >= 75) {
            adjusted.risk += 10;
            adjusted.cash -= 5;
            adjusted.hedge -= 5;
        } else if (confidence < 55) {
            adjusted.risk -= 8;
            adjusted.cash += 4;
            adjusted.hedge += 4;
        }
    } else if (intel.regime.tone === "bearish") {
        if (confidence >= 75) {
            adjusted.risk -= 8;
            adjusted.cash += 4;
            adjusted.hedge += 4;
        } else if (confidence < 55) {
            adjusted.risk += 8;
            adjusted.cash -= 4;
            adjusted.hedge -= 4;
        }
    } else {
        if (confidence >= 70) {
            adjusted.risk -= 3;
            adjusted.cash += 5;
            adjusted.hedge -= 2;
        } else if (confidence < 55) {
            adjusted.risk -= 4;
            adjusted.cash += 8;
            adjusted.hedge -= 4;
        }
    }

    if (warnings >= 3) {
        adjusted.risk -= 7;
        adjusted.cash += 5;
        adjusted.hedge += 2;
    } else if (warnings === 0 && intel.regime.tone === "bullish") {
        adjusted.risk += 3;
        adjusted.cash -= 2;
        adjusted.hedge -= 1;
    }

    adjusted.risk += profilePreset.allocationShift.risk;
    adjusted.cash += profilePreset.allocationShift.cash;
    adjusted.hedge += profilePreset.allocationShift.hedge;

    const allocation = rebalanceAllocation(adjusted);
    const bullishMet = countScenarioMet(intel.scenarios.bullish);
    const bearishMet = countScenarioMet(intel.scenarios.bearish);
    const invalidationMet = countScenarioMet(intel.scenarios.invalidation);

    let sizingR = 0.6;
    let sizingDesc = "조건 충족 전까지는 탐색 진입만 유지하고 손절 폭을 짧게 유지합니다.";

    if (intel.regime.tone === "bullish") {
        if (bullishMet >= 2 && invalidationMet === 0) {
            sizingR = 1.0;
            sizingDesc = "강세 조건이 다수 충족되어 기준 포지션까지 확장 가능합니다.";
        } else if (bullishMet >= 1) {
            sizingR = 0.7;
            sizingDesc = "강세 시그널은 있으나 무효화 조건을 병행 점검하며 분할 접근합니다.";
        } else {
            sizingR = 0.5;
            sizingDesc = "조건 충족이 부족하므로 신규 진입은 소규모 확인용만 권장됩니다.";
        }
    } else if (intel.regime.tone === "bearish") {
        if (bearishMet >= 2 && invalidationMet === 0) {
            sizingR = 0.4;
            sizingDesc = "방어 우위 조건이 강해 롱 익스포저는 최소화하고 헤지 비중을 유지합니다.";
        } else if (bearishMet >= 1) {
            sizingR = 0.5;
            sizingDesc = "하락 전환 신호가 있으나 반등 리스크를 감안해 크기를 제한합니다.";
        } else {
            sizingR = 0.6;
            sizingDesc = "하락 확증이 약하므로 과도한 방어보다 중립적 관리가 적절합니다.";
        }
    }

    const sizedWithProfile = Math.max(0.3, Math.min(1.2, Number((sizingR + profilePreset.sizingShift).toFixed(1))));
    const sizing = {
        title: `포지션 사이징: ${sizedWithProfile.toFixed(1)}R`,
        desc: `${sizingDesc} (${profilePreset.label} 성향 반영)`
    };

    const entryRuleBase = intel.regime.tone === "bullish"
        ? "진입 규칙: 상승 지속 조건 2개 이상 충족 시에만 추격 매수 허용"
        : intel.regime.tone === "bearish"
            ? "진입 규칙: 하락 전환 조건 2개 이상 충족 전까지 공격적 숏 확대 금지"
            : "진입 규칙: 시나리오 충족 수가 한쪽으로 기울 때까지 분할 진입 유지";
    const entryRule = profileKey === "aggressive"
        ? `${entryRuleBase} · 공격 성향은 최초 진입 비중 60%까지 허용`
        : profileKey === "conservative"
            ? `${entryRuleBase} · 보수 성향은 최초 진입 비중 35% 이내 권장`
            : entryRuleBase;

    const riskRule = profileKey === "conservative"
        ? "리스크 규칙: 무효화 조건 1개 충족 시 즉시 10% 축소, 2개 이상 충족 시 총 익스포저 20% 축소"
        : "리스크 규칙: 무효화 조건 1개 충족 시 신규 진입 중단, 2개 이상 충족 시 총 익스포저 15% 축소";
    const hedgeRule = warnings >= 3
        ? "헤지 규칙: 리스크 경보 다수로 단기 보호(풋/인버스) 비중을 기본 대비 +5% 유지"
        : profileKey === "aggressive"
            ? "헤지 규칙: 평시 헤지는 최소화하되 이벤트(지표/실적) 전후로만 3~5% 탄력 운용"
            : "헤지 규칙: 변동성 급등(VIX 급등) 발생 시에만 이벤트성 헤지 5% 이내 운용";

    return {
        allocation,
        sizing,
        entryRule,
        riskRule,
        hedgeRule,
        profile: {
            key: profileKey,
            label: profilePreset.label,
            note: profilePreset.note
        },
        scenarioSummary: {
            bullish: `${bullishMet}/${intel.scenarios.bullish.length}`,
            bearish: `${bearishMet}/${intel.scenarios.bearish.length}`,
            invalidation: `${invalidationMet}/${intel.scenarios.invalidation.length}`
        }
    };
}

function buildTodayActionLines(intel, executionGuide) {
    const bullishMet = countScenarioMet(intel.scenarios.bullish);
    const bearishMet = countScenarioMet(intel.scenarios.bearish);
    const invalidationMet = countScenarioMet(intel.scenarios.invalidation);
    const warnings = intel.riskWarnings.length;
    const firstWatch = intel.watchlistPriority[0]?.name || "핵심 지수";
    const secondWatch = intel.watchlistPriority[1]?.name || "리더십 자산";

    let doNow = `리스크 자산 비중 ${executionGuide.allocation.risk}%를 기준으로 ${firstWatch}와 ${secondWatch} 동행 여부를 확인하며 분할 진입을 진행합니다.`;
    if (intel.regime.tone === "bearish") {
        doNow = `현금+헤지 비중 ${executionGuide.allocation.cash + executionGuide.allocation.hedge}%를 유지하고 신규 롱은 ${executionGuide.sizing.title.replace("포지션 사이징: ", "")} 이내로 제한합니다.`;
    } else if (intel.regime.tone === "neutral") {
        doNow = `중립 구간이므로 비중을 급격히 늘리지 말고 ${executionGuide.sizing.title.replace("포지션 사이징: ", "")}로 탐색 진입만 유지합니다.`;
    } else if (bullishMet >= 2) {
        doNow = `상승 조건 ${bullishMet}/${intel.scenarios.bullish.length} 충족 상태이므로 리스크 자산 비중 ${executionGuide.allocation.risk}%까지 점진 확대합니다.`;
    }

    let avoidNow = "무효화 조건이 확인되기 전 과도한 레버리지·추격 진입은 피합니다.";
    if (invalidationMet >= 2) {
        avoidNow = "무효화 조건이 2개 이상 충족된 구간이라 신규 공격 진입은 중단하고 기존 포지션부터 축소합니다.";
    } else if (warnings >= 3) {
        avoidNow = "리스크 경보가 누적되어 단일 테마 집중 베팅과 손절 없는 홀딩을 금지합니다.";
    } else if (intel.regime.tone === "bearish" && bearishMet >= 2) {
        avoidNow = "반등 기대만으로 평균단가를 낮추는 물타기 진입은 피하고 방어 우선으로 운영합니다.";
    }

    let recheckWhen = `다음 데이터 갱신(60초)에서 무효화 조건 변화를 재확인하고, 장중에는 ${firstWatch} 5D 상대강도 반전 시 즉시 재평가합니다.`;
    if (warnings >= 3) {
        recheckWhen = "리스크 경보 다수 구간이므로 데이터 갱신마다 즉시 점검하고 무효화 조건 2개 유지 시 익스포저를 바로 축소합니다.";
    } else if (intel.regime.tone === "bullish") {
        recheckWhen = `${firstWatch}·${secondWatch} 리더십이 동시에 약화되면 바로 재확인하고, 무효화 조건 1개 충족 시 신규 진입을 멈춥니다.`;
    } else if (intel.regime.tone === "bearish") {
        recheckWhen = "신용지표와 반도체 리더십이 동시에 회복되면 즉시 재평가하고 방어 비중을 단계적으로 축소합니다.";
    }

    return { doNow, avoidNow, recheckWhen };
}

function getAllTrackedAssets() {
    const deduped = new Map();
    Object.values(ASSETS).flat().forEach(asset => {
        if (!deduped.has(asset.symbol)) deduped.set(asset.symbol, asset);
    });
    return Array.from(deduped.values());
}

function getAssetSnapshot(symbol) {
    const assets = (window.DASHBOARD_DATA && window.DASHBOARD_DATA.assets) || {};
    return assets[symbol] || null;
}

function sortModeButtons() {
    const controls = document.querySelector(".controls");
    if (!controls) return;

    const preferredOrder = ["report", "global", "intel", "options", "gurus"];
    const modeButtons = Array.from(controls.querySelectorAll(".mode-btn"));
    const anchor = Array.from(controls.children).find(child => !child.classList.contains("mode-btn"));
    const fragment = document.createDocumentFragment();

    preferredOrder.forEach(mode => {
        const button = modeButtons.find(item => item.dataset.mode === mode);
        if (button) fragment.appendChild(button);
    });

    if (anchor) {
        controls.insertBefore(fragment, anchor);
    } else {
        controls.appendChild(fragment);
    }
}

function getAssetMeta(symbol) {
    return getAllTrackedAssets().find(asset => asset.symbol === symbol) || { symbol, name: symbol };
}

function formatMetricCell(value, { decimals = 2, suffix = "%" } = {}) {
    if (!Number.isFinite(value)) {
        return '<span class="global-market-cell neutral">--</span>';
    }

    const cls = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";
    const prefix = value > 0 ? "+" : "";
    return `<span class="global-market-cell ${cls}">${prefix}${value.toFixed(decimals)}${suffix}</span>`;
}

function formatHeadlineValue(asset, snapshot) {
    if (!snapshot) return "--";
    const s = asset.symbol;
    // 국채 금리(Yields)인 경우에만 % 접미사 추가
    const isBond = s.endsWith("10Y") || s.endsWith("30Y") || s.endsWith("02Y") || 
                   s === "TVC:DE10Y" || s === "TVC:JP10Y" || s === "TVC:GB10Y" || s === "TVC:KR10Y" ||
                   (s.startsWith("TVC:US") && !s.includes("OIL")); 
    
    if (isBond) {
        return `${snapshot.price}%`;
    }
    return snapshot.price || "--";
}

function getRegionLeaders(symbols, metricKey = "idx1D") {
    return symbols
        .map(symbol => {
            const asset = getAssetMeta(symbol);
            const snapshot = getAssetSnapshot(symbol);
            return {
                symbol,
                asset,
                snapshot,
                score: toNumber(snapshot?.[metricKey], Number.NEGATIVE_INFINITY)
            };
        })
        .filter(item => item.snapshot)
        .sort((a, b) => b.score - a.score);
}

function renderGlobalHero() {
    const usBreadth = average(["SP:SPX", "NASDAQ:NDX", "DJ:DJI", "RUSSELL:RUT"].map(symbol => toNumber(getAssetSnapshot(symbol)?.idx1D, 0)));
    const asiaBreadth = average(["KRX:KOSPI", "NI225", "HSI"].map(symbol => toNumber(getAssetSnapshot(symbol)?.idx1D, 0)));
    const europeBreadth = average(["DAX", "UK100", "PX1"].map(symbol => toNumber(getAssetSnapshot(symbol)?.idx1D, 0)));
    const oilMove = toNumber(getAssetSnapshot("TVC:USOIL")?.idx1D, 0);
    const dollarMove = toNumber(getAssetSnapshot("TVC:DXY")?.idx1D, 0);
    const riskToneScore = usBreadth + asiaBreadth + europeBreadth - (dollarMove * 0.8) - (oilMove < -2 ? 0.5 : 0);
    const toneLabel = riskToneScore >= 0.5 ? "Risk-on Follow Through" : riskToneScore <= -0.5 ? "Defensive Rotation" : "Mixed Cross-Asset Tape";
    const toneClass = riskToneScore >= 0.5 ? "is-positive" : riskToneScore <= -0.5 ? "is-negative" : "is-neutral";

    return `
        <section class="global-hero ${toneClass}">
            <div class="global-hero-copy">
                <span class="section-kicker">Global Market</span>
                <h2>Overnight cross-asset dashboard</h2>
                <p>US, Europe, Asia, FX, rates and commodities on one board, arranged for a quick pre-market read.</p>
            </div>
            <div class="global-hero-summary">
                <div class="global-hero-badge">${toneLabel}</div>
                <div class="global-hero-metrics">
                    <div>
                        <span>US</span>
                        <strong>${usBreadth.toFixed(2)}%</strong>
                    </div>
                    <div>
                        <span>Asia</span>
                        <strong>${asiaBreadth.toFixed(2)}%</strong>
                    </div>
                    <div>
                        <span>Europe</span>
                        <strong>${europeBreadth.toFixed(2)}%</strong>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderGlobalTickerStrip() {
    const symbols = ["SP:SPX", "NASDAQ:NDX", "KRX:KOSPI", "TVC:DXY", "FX_IDC:USDKRW", "TVC:US10Y", "TVC:GOLD", "TVC:USOIL"];
    const items = symbols.map(symbol => {
        const asset = getAssetMeta(symbol);
        const snapshot = getAssetSnapshot(symbol);
        const move = formatMetricCell(toNumber(snapshot?.idx1D, NaN));
        return `
            <div class="global-strip-item">
                <span class="global-strip-name">${asset.name}</span>
                <strong>${formatHeadlineValue(asset, snapshot)}</strong>
                ${move}
            </div>
        `;
    }).join("");

    return `<section class="global-strip">${items}</section>`;
}

function renderGlobalSection(section) {
    const rows = section.items.map(symbol => {
        const asset = getAssetMeta(symbol);
        const snapshot = getAssetSnapshot(symbol);
        if (!snapshot) return "";

        const isRates = section.title === "Rates & Credit";
        const dayMetric = isRates
            ? formatMetricCell(toNumber(snapshot.bp1D, NaN), { decimals: 1, suffix: "bp" })
            : formatMetricCell(toNumber(snapshot.idx1D, NaN));
        const weekMetric = isRates
            ? formatMetricCell(toNumber(snapshot.bp5D, NaN), { decimals: 1, suffix: "bp" })
            : formatMetricCell(toNumber(snapshot.idx5D, NaN));
        const monthMetric = isRates
            ? formatMetricCell(toNumber(snapshot.bpMTD, NaN), { decimals: 1, suffix: "bp" })
            : formatMetricCell(toNumber(snapshot.idxMTD, NaN));

        return `
            <tr>
                <td>
                    <div class="global-market-name">${asset.name}</div>
                    <div class="global-market-symbol">${symbol}</div>
                </td>
                <td class="global-market-price">${formatHeadlineValue(asset, snapshot)}</td>
                <td>${dayMetric}</td>
                <td>${weekMetric}</td>
                <td>${monthMetric}</td>
            </tr>
        `;
    }).join("");

    return `
        <section class="global-market-panel">
            <div class="global-market-panel-head">
                <div>
                    <h3>${section.title}</h3>
                    <p>${section.description}</p>
                </div>
            </div>
            <table class="global-market-table">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Last</th>
                        <th>1D</th>
                        <th>5D</th>
                        <th>1M</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </section>
    `;
}

function renderGlobalLeaders() {
    const winners = getRegionLeaders(["SP:SPX", "NASDAQ:NDX", "DJ:DJI", "RUSSELL:RUT", "KRX:KOSPI", "NI225", "HSI", "DAX", "UK100", "PX1"]).slice(0, 4);
    const losers = getRegionLeaders(["SP:SPX", "NASDAQ:NDX", "DJ:DJI", "RUSSELL:RUT", "KRX:KOSPI", "NI225", "HSI", "DAX", "UK100", "PX1"]).slice(-4).reverse();
    const renderList = (items, title) => `
        <section class="global-mini-panel">
            <div class="global-mini-head">
                <span class="section-kicker">${title}</span>
                <strong>Regional movers</strong>
            </div>
            <div class="global-mini-list">
                ${items.map(item => `
                    <div class="global-mini-row">
                        <div>
                            <div class="global-market-name">${item.asset.name}</div>
                            <div class="global-market-symbol">${item.symbol}</div>
                        </div>
                        ${formatMetricCell(item.score)}
                    </div>
                `).join("")}
            </div>
        </section>
    `;

    return `
        <div class="global-mini-grid">
            ${renderList(winners, "Leaders")}
            ${renderList(losers, "Laggards")}
        </div>
    `;
}

function renderGlobalView() {
    const orderedCharts = getOrderedGlobalMarketCharts();
    chartGrid.innerHTML = `
        <section class="global-market-shell">
            <div class="global-chart-grid">
                ${orderedCharts.map(item => renderGlobalMarketCard(item)).join("")}
            </div>
        </section>
    `;

    initGlobalMarketCardDragAndDrop();
    initializeGlobalMarketWidgets();
}

function renderGlobalMarketCard(item) {
    const interval = globalMarketIntervals[item.id] || "5";
    const snapshot = getAssetSnapshot(item.dataSymbol);
    const priceStr = snapshot ? formatHeadlineValue({symbol: item.dataSymbol}, snapshot) : "--";
    const change = snapshot ? toNumber(snapshot.idx1D, NaN) : NaN;
    const changeHtml = isNaN(change) ? "" : formatMetricCell(change);
    return `
        <article class="global-chart-card" id="card-${item.id}">
            <div class="global-card-header">
                <button type="button" class="global-drag-handle" title="드래그로 순서 변경" aria-label="드래그로 순서 변경">
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="4" cy="4" r="1.2"></circle>
                        <circle cx="8" cy="4" r="1.2"></circle>
                        <circle cx="12" cy="4" r="1.2"></circle>
                        <circle cx="4" cy="8" r="1.2"></circle>
                        <circle cx="8" cy="8" r="1.2"></circle>
                        <circle cx="12" cy="8" r="1.2"></circle>
                        <circle cx="4" cy="12" r="1.2"></circle>
                        <circle cx="8" cy="12" r="1.2"></circle>
                        <circle cx="12" cy="12" r="1.2"></circle>
                    </svg>
                </button>
                <!-- 모든 텍스트는 트레이딩뷰 위젯이 처리 (정지형 프리미엄 헤더) -->
                <div id="global-quote-${item.id}" class="global-quote-host">
                    <div class="tradingview-widget-container">
                        <div class="tradingview-widget-container__widget"></div>
                    </div>
                </div>
            </div>
            <div id="global-widget-${item.id}" class="global-chart-widget" data-interval="${interval}"></div>
            <div class="global-card-intervals">
                ${GLOBAL_MARKET_INTERVAL_OPTIONS.map(option => `
                    <button type="button" class="global-interval-btn ${interval === option.value ? "active" : ""}" onclick="setGlobalMarketInterval('${item.id}', '${option.value}')">${option.label}</button>
                `).join("")}
            </div>
        </article>
    `;
}

function initializeGlobalMarketWidgets(targetId = null) {
    const list = targetId 
        ? GLOBAL_MARKET_CHARTS_LIVE.filter(item => item.id === targetId)
        : GLOBAL_MARKET_CHARTS_LIVE;

    list.forEach(item => {
        const quoteHostId = `global-quote-${item.id}`;
        const containerId = `global-widget-${item.id}`;
        const quoteHost = document.getElementById(quoteHostId);
        const container = document.getElementById(containerId);
        
        if (quoteHost) {
            const quoteInner = quoteHost.querySelector('.tradingview-widget-container__widget');
            if (quoteInner) {
                quoteInner.innerHTML = "";
                const quoteScript = document.createElement("script");
                quoteScript.type = "text/javascript";
                quoteScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
                quoteScript.async = true;
                quoteScript.innerHTML = JSON.stringify({
                    "symbols": [
                        {
                            "proName": item.chartSymbol,
                            "title": item.name 
                        }
                    ],
                    "showSymbolLogo": false,
                    "colorTheme": "dark",
                    "isTransparent": true,
                    "displayMode": "regular",
                    "locale": "ko"
                });
                quoteInner.appendChild(quoteScript);
            }
        }

        if (!container) return;

        container.innerHTML = "";

        if (typeof TradingView === "undefined" || typeof TradingView.widget !== "function") return;

        new TradingView.widget({
            autosize: true,
            symbol: item.chartSymbol,
            interval: globalMarketIntervals[item.id] || "5",
            timezone: "Asia/Seoul",
            theme: "dark", // 강제로 다크테마 적용
            style: "1",
            locale: "kr",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_top_toolbar: true,
            hide_legend: true,
            hide_side_toolbar: true,
            withdateranges: false,
            details: false,
            hotlist: false,
            calendar: false,
            studies: [],
            save_image: false,
            container_id: containerId
        });
    });
}

function setGlobalMarketInterval(id, interval) {
    globalMarketIntervals[id] = interval;
    
    // 1) 개별 차트의 타임프레임 버튼 활성화 상태만 업데이트
    const card = document.getElementById(`card-${id}`);
    if (card) {
        const btns = card.querySelectorAll(".global-interval-btn");
        btns.forEach(btn => {
            if (btn.textContent.includes("분") || btn.textContent.includes("일") || btn.textContent.includes("주") || btn.textContent.includes("월")) {
                // 정확한 일치 확인을 위해 데이터 속성을 쓰는게 좋지만 현재는 텍스트나 클릭 이벤트의 인자로 판단
                // 여기서는 HTML 문자열에 인자로 들어간 'interval'과 버튼 클릭 시의 'interval'을 비교해야 함
            }
            // 카드 내의 버튼들을 다시 그리는게 가장 깔끔함
        });
        
        // 버튼 부분만 부분 렌더링
        const intervalContainer = card.querySelector(".global-card-intervals");
        if (intervalContainer) {
            intervalContainer.innerHTML = GLOBAL_MARKET_INTERVAL_OPTIONS.map(option => `
                <button type="button" class="global-interval-btn ${interval === option.value ? "active" : ""}" 
                    onclick="setGlobalMarketInterval('${id}', '${option.value}')">${option.label}</button>
            `).join("");
        }
    }

    // 2) 해당 차트 위젯만 다시 로드
    initializeGlobalMarketWidgets(id);
}

function refreshGlobalMarketCard(id) {
    renderGlobalView();
}

window.setGlobalMarketInterval = setGlobalMarketInterval;
window.refreshGlobalMarketCard = refreshGlobalMarketCard;
window.setIntelRiskProfile = setIntelRiskProfile;
window.renderDataLoadFailure = renderDataLoadFailure;

function average(values) {
    const valid = values.filter(value => Number.isFinite(value));
    if (!valid.length) return 0;
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function getSignalWeight(signal = "") {
    let score = 0;
    if (signal.includes("🔥")) score += 1;
    if (signal.includes("⚔️")) score += 1;
    if (signal.includes("⚠️")) score -= 1;
    return score;
}

function buildMarketIntel() {
    const macro = (window.DASHBOARD_DATA && window.DASHBOARD_DATA.macro) || {};
    const trackedAssets = getAllTrackedAssets();
    const rows = trackedAssets.map(asset => {
        const data = getAssetSnapshot(asset.symbol);
        return {
            ...asset,
            data,
            idx1D: toNumber(data?.idx1D),
            idx5D: toNumber(data?.idx5D),
            idxMTD: toNumber(data?.idxMTD),
            idxYTD: toNumber(data?.idxYTD),
            signal: data?.signal || "",
            price: data?.price || "-"
        };
    }).filter(row => row.data);

    const macroChecks = [
        { key: "spy_tlt", label: "주식/채권", bullish: "위험 선호 유지", bearish: "안전자산 선호 확대" },
        { key: "liquidity", label: "달러 유동성", bullish: "유동성 압박 완화", bearish: "달러 강세로 긴축 압력" },
        { key: "growth_value", label: "성장/가치", bullish: "성장 리더십 복원", bearish: "방어/가치 선호" },
        { key: "credit_stress", label: "크레딧", bullish: "신용시장 안정", bearish: "신용 긴장 확대" },
        { key: "cu_au", label: "구리/금", bullish: "성장 기대 우세", bearish: "방어 수요 우세" },
        { key: "yield_curve_2y", label: "장단기 금리", bullish: "사이클 확장", bearish: "침체 경계" }
    ].map(check => {
        const trend = macro[check.key]?.trend || "down";
        return {
            ...check,
            trend,
            score: trend === "up" ? 1 : -1,
            summary: trend === "up" ? check.bullish : check.bearish
        };
    });

    const breadthChecks = [
        {
            label: "동일가중 vs 대형주",
            score: toNumber(getAssetSnapshot("RSP")?.idx5D) - toNumber(getAssetSnapshot("SP:SPX")?.idx5D),
            bullish: "상승이 소수 대형주에만 갇히지 않음",
            bearish: "시총 상위 종목 의존 상승"
        },
        {
            label: "중소형 vs 나스닥",
            score: toNumber(getAssetSnapshot("RUSSELL:RUT")?.idx5D) - toNumber(getAssetSnapshot("NASDAQ:NDX")?.idx5D),
            bullish: "리스크 감수 범위 확장",
            bearish: "공격적 자금 유입 둔화"
        },
        {
            label: "경기민감 vs 방어",
            score: average([
                toNumber(getAssetSnapshot("XLI")?.idx5D),
                toNumber(getAssetSnapshot("XLF")?.idx5D),
                toNumber(getAssetSnapshot("XLE")?.idx5D)
            ]) - average([
                toNumber(getAssetSnapshot("XLU")?.idx5D),
                toNumber(getAssetSnapshot("XLP")?.idx5D),
                toNumber(getAssetSnapshot("XLV")?.idx5D)
            ]),
            bullish: "경기 민감 업종이 시장을 주도",
            bearish: "방어 업종이 상대 우위"
        },
        {
            label: "반도체 리더십",
            score: toNumber(getAssetSnapshot("SOXX")?.idx5D) - toNumber(getAssetSnapshot("SP:SPX")?.idx5D),
            bullish: "위험 선호의 핵심 엔진 유지",
            bearish: "리더십 약화"
        }
    ].map(check => ({
        ...check,
        direction: check.score >= 0 ? "up" : "down",
        summary: check.score >= 0 ? check.bullish : check.bearish
    }));

    const macroScore = macroChecks.reduce((sum, item) => sum + item.score, 0);
    const breadthScore = breadthChecks.reduce((sum, item) => sum + (item.score >= 0 ? 1 : -1), 0);
    const maxScore = macroChecks.length + breadthChecks.length;
    const regimeScore = macroScore + breadthScore;
    let regime = {
        label: "TRANSITION",
        korean: "중립적 전환 구간",
        tone: "neutral",
        summary: "핵심 지표가 단일 방향으로 수렴하지 않아, 해석보다 가격 반응 검증이 우선인 구간입니다."
    };
    if (regimeScore >= 5) {
        regime = {
            label: "RISK ON",
            korean: "위험 선호 우위",
            tone: "bullish",
            summary: "유동성, 크레딧, 리더십 지표가 대체로 같은 방향으로 정렬되고 있습니다."
        };
    } else if (regimeScore <= -3) {
        regime = {
            label: "RISK OFF",
            korean: "방어 자산 우위",
            tone: "bearish",
            summary: "신용과 리더십이 약화돼, 호재 해석보다 가격 방어력 점검이 우선인 구간입니다."
        };
    }

    const normalizedConfidence = Math.min(100, Math.max(35, Math.round((Math.abs(regimeScore) / maxScore) * 100)));
    const confidenceLabel = normalizedConfidence >= 75 ? "확신 높음" : normalizedConfidence >= 55 ? "확신 보통" : "신호 혼재";
    const scoreMarker = Math.round(((regimeScore + maxScore) / (maxScore * 2)) * 100);
    const scoreContributors = [
        ...macroChecks.map(item => ({
            bucket: "Macro",
            label: item.label,
            detail: item.summary,
            contribution: item.score,
            direction: item.score >= 0 ? "up" : "down"
        })),
        ...breadthChecks.map(item => ({
            bucket: "Breadth",
            label: item.label,
            detail: `${item.summary} (5D ${item.score >= 0 ? "+" : ""}${item.score.toFixed(2)}pt)`,
            contribution: item.score >= 0 ? 1 : -1,
            direction: item.score >= 0 ? "up" : "down"
        }))
    ];

    const reactionCandidates = rows.map(row => {
        const trendScore = row.idxYTD + (row.idxMTD * 0.6) + getSignalWeight(row.signal) * 4;
        const reactionScore = (row.idx1D * 2) + row.idx5D;
        const exhaustionScore = trendScore - reactionScore;
        return { ...row, trendScore, reactionScore, exhaustionScore };
    });

    const goodNewsLaggers = reactionCandidates
        .filter(row => row.idxYTD > 5 && row.idxMTD > 0 && (row.idx1D <= 0 || row.idx5D < 0))
        .sort((a, b) => b.exhaustionScore - a.exhaustionScore)
        .slice(0, 4)
        .map(row => ({
            ...row,
            note: `YTD ${row.idxYTD.toFixed(2)}%의 누적 성과 대비 최근 5일 ${row.idx5D.toFixed(2)}%에 그쳐, 상승 재료의 가격 전가력이 둔화되고 있습니다.`
        }));

    const badNewsResilient = reactionCandidates
        .filter(row => row.idxMTD < 0 && (row.idx1D > 0 || row.signal.includes("⚔️") || row.signal.includes("🔥")))
        .sort((a, b) => (b.idx1D + getSignalWeight(b.signal) * 2) - (a.idx1D + getSignalWeight(a.signal) * 2))
        .slice(0, 4)
        .map(row => ({
            ...row,
            note: `1M ${row.idxMTD.toFixed(2)}%의 약세 구간에서도 1일 ${row.idx1D.toFixed(2)}%를 기록해, 악재 소화 이후 수급 복원이 관찰됩니다.`
        }));

    const fundamentalContradictions = reactionCandidates
        .filter(row =>
            (row.idxYTD > 10 && row.idx5D < 0) ||
            (row.idxMTD < -3 && row.idx1D > 0.5) ||
            (row.signal.includes("⚠️") && row.idxYTD > 0)
        )
        .sort((a, b) => Math.abs(b.exhaustionScore) - Math.abs(a.exhaustionScore))
        .slice(0, 6)
        .map(row => {
            let stance = "관찰 유지";
            if (row.idxYTD > 10 && row.idx5D < 0) stance = "비중 축소";
            else if (row.idxMTD < -3 && row.idx1D > 0.5) stance = "재평가";
            else if (row.signal.includes("⚠️")) stance = "가설 점검";
            return {
                ...row,
                stance
            };
        });

    const watchlistPriority = [
        {
            symbol: "SP:SPX",
            title: "지수 기준선",
            why: "광범위한 위험 선호를 확인하는 기준 축",
            trigger: "직전 고점 재돌파와 5일 수익률 확장 여부"
        },
        {
            symbol: "SOXX",
            title: "반도체 리더십",
            why: "공격적 리스크 테이킹이 유지되는지 확인",
            trigger: "S&P 대비 상대 강도 유지 여부"
        },
        {
            symbol: "XLF",
            title: "금융 확인 신호",
            why: "금리 및 신용 환경의 실물 반영",
            trigger: "상승 국면에서 금융주 동행 여부"
        },
        {
            symbol: "TVC:DXY",
            title: "달러 유동성",
            why: "글로벌 유동성 압력의 핵심 변수",
            trigger: "단기 재상승 또는 추세 꺾임"
        },
        {
            symbol: "TVC:US10Y",
            title: "장기 금리 압력",
            why: "밸류에이션 부담과 경기 기대가 만나는 지점",
            trigger: "급등 시 성장주 할인율 압박 심화"
        }
    ].map(item => {
        const asset = trackedAssets.find(row => row.symbol === item.symbol) || { name: item.symbol, symbol: item.symbol };
        const data = getAssetSnapshot(item.symbol);
        return {
            ...item,
            name: asset.name,
            idx1D: toNumber(data?.idx1D),
            idx5D: toNumber(data?.idx5D),
            signal: data?.signal || ""
        };
    }).slice(0, 4);

    const spyTltUp = macroChecks.find(item => item.key === "spy_tlt")?.trend === "up";
    const creditRecovery = macroChecks.find(item => item.key === "credit_stress")?.trend === "up";
    const liquidityTightening = macroChecks.find(item => item.key === "liquidity")?.trend === "down";
    const cyclicalBreadthWeak = breadthChecks.find(item => item.label === "경기민감 vs 방어")?.score < 0;
    const soxxRelativeScore = breadthChecks.find(item => item.label === "반도체 리더십")?.score;
    const xlfRelativeScore = toNumber(getAssetSnapshot("XLF")?.idx5D, NaN) - toNumber(getAssetSnapshot("SP:SPX")?.idx5D, NaN);
    const macroUpCount = macroChecks.filter(item => item.trend === "up").length;
    const macroDownCount = macroChecks.length - macroUpCount;
    const leadershipLoss = Number.isFinite(soxxRelativeScore) && soxxRelativeScore < 0;
    const jointLeadershipLoss = leadershipLoss && Number.isFinite(xlfRelativeScore) && xlfRelativeScore < 0;
    const jointRecovery = creditRecovery && Number.isFinite(soxxRelativeScore) && soxxRelativeScore >= 0;

    const bullishDrivers = [
        {
            text: "주식/채권 비율 상승으로 위험 선호 유지",
            met: spyTltUp,
            note: spyTltUp ? "SPX/TLT 비율이 우상향으로 유지되고 있습니다." : "채권 상대 강세가 나타나면 상승 지속 확률이 낮아집니다."
        },
        {
            text: "신용시장 안정으로 자금 조달 환경 유지",
            met: creditRecovery,
            note: creditRecovery ? "Credit stress가 완화 방향이라 리스크 자산에 우호적입니다." : "신용 긴장이 높아지면 주식 강세의 질이 약해집니다."
        },
        {
            text: "반도체 리더십이 시장 대비 우위",
            met: Number.isFinite(soxxRelativeScore) && soxxRelativeScore >= 0,
            note: Number.isFinite(soxxRelativeScore) && soxxRelativeScore >= 0
                ? `SOXX 상대강도 5D +${soxxRelativeScore.toFixed(2)}pt로 리더십이 유지됩니다.`
                : "반도체 리더십이 약해지면 추세 확신이 빠르게 떨어질 수 있습니다."
        }
    ];

    const bearishDrivers = [
        {
            text: "달러 강세/유동성 압박 확대",
            met: liquidityTightening,
            note: liquidityTightening ? "달러 재강세 구간으로 위험자산 할인율 부담이 커집니다." : "달러가 안정되면 하락 전환 압력은 완화됩니다."
        },
        {
            text: "방어 업종 우위로 확산 둔화",
            met: cyclicalBreadthWeak,
            note: cyclicalBreadthWeak ? "경기민감 대비 방어 섹터 우위가 확인됩니다." : "경기민감 섹터가 버티면 하락 전환 신호는 약해집니다."
        },
        {
            text: "호재 둔감 자산 확산(매수 피로 누적)",
            met: goodNewsLaggers.length >= 3,
            note: goodNewsLaggers.length >= 3
                ? `호재 둔감 자산 ${goodNewsLaggers.length}개로 가격 전가력이 약해졌습니다.`
                : "호재 둔감 자산 수가 아직 임계치에 도달하지 않았습니다."
        }
    ];

    const invalidationMacroText = regime.tone === "bullish"
        ? "핵심 매크로 2개 이상 하방 전환"
        : regime.tone === "bearish"
            ? "핵심 매크로 2개 이상 상방 전환"
            : "핵심 매크로가 한 방향으로 급정렬";
    const invalidationMacroMet = regime.tone === "bullish"
        ? macroDownCount >= 2
        : regime.tone === "bearish"
            ? macroUpCount >= 2
            : Math.abs(macroScore) >= 4;

    const invalidationDrivers = [
        {
            text: regime.tone === "bullish" ? "금융주·반도체 동시 리더십 상실" : "신용시장과 반도체 리더십 동시 회복",
            met: regime.tone === "bullish" ? jointLeadershipLoss : jointRecovery,
            note: regime.tone === "bullish"
                ? (jointLeadershipLoss ? "XLF·SOXX가 동시에 약세로 현재 강세 시나리오를 훼손합니다." : "XLF·SOXX 동시 약화 신호는 아직 확인되지 않았습니다.")
                : (jointRecovery ? "신용과 리더십이 동시에 회복돼 약세 시나리오가 무효화될 수 있습니다." : "신용 또는 리더십 중 하나만 회복된 상태입니다.")
        },
        {
            text: invalidationMacroText,
            met: invalidationMacroMet,
            note: regime.tone === "bullish"
                ? `현재 하방 전환 매크로 ${macroDownCount}/${macroChecks.length}`
                : regime.tone === "bearish"
                    ? `현재 상방 전환 매크로 ${macroUpCount}/${macroChecks.length}`
                    : `중립 구간에서 매크로 점수 ${macroScore > 0 ? "+" : ""}${macroScore}`
        },
        {
            text: "악재 내성 자산 급증 여부 확인",
            met: badNewsResilient.length >= 3,
            note: badNewsResilient.length >= 3
                ? `악재 내성 자산 ${badNewsResilient.length}개로 반전 가능성이 커졌습니다.`
                : "악재 내성 자산 증가가 아직 빠르게 확산되지는 않았습니다."
        }
    ];

    const riskWarnings = [
        breadthChecks.find(item => item.label === "반도체 리더십" && item.score < 0) ? "반도체 상대 강도가 약화돼 고베타 리더십의 질이 저하되고 있습니다." : null,
        breadthChecks.find(item => item.label === "경기민감 vs 방어" && item.score < 0) ? "방어 섹터 우위가 지속돼 경기 확산의 폭이 제한되고 있습니다." : null,
        macroChecks.find(item => item.key === "liquidity")?.trend === "down" ? "달러 강세로 유동성 압박이 확대되고 있습니다." : null,
        macroChecks.find(item => item.key === "credit_stress")?.trend === "down" ? "신용시장 긴장이 높아져 주식 강세의 질이 훼손될 수 있습니다." : null,
        goodNewsLaggers.length >= 3 ? "호재에도 가격이 따라오지 않는 자산이 늘어 수급 피로가 누적되고 있습니다." : null
    ].filter(Boolean).slice(0, 3);

    return {
        regime,
        confidence: {
            score: normalizedConfidence,
            label: confidenceLabel
        },
        scoreBreakdown: {
            total: regimeScore,
            max: maxScore,
            macro: macroScore,
            breadth: breadthScore,
            marker: scoreMarker,
            contributors: scoreContributors
        },
        macroChecks,
        breadthChecks,
        goodNewsLaggers,
        badNewsResilient,
        fundamentalContradictions,
        watchlistPriority,
        scenarios: {
            bullish: bullishDrivers,
            bearish: bearishDrivers,
            invalidation: invalidationDrivers
        },
        riskWarnings
    };
}

function renderMarketIntel() {
    if (!window.DASHBOARD_DATA) return "";
    const intel = buildMarketIntel();
    const todayConclusion = buildTodayConclusion(intel);
    const reliabilityBadges = buildReliabilityBadges();
    const predictionHistory = syncIntelPredictionHistory();
    const predictionBadge = buildPredictionPerformanceBadge(predictionHistory);
    const reliabilityCards = [predictionBadge, ...reliabilityBadges];
    const executionGuide = buildExecutionGuide(intel);
    const todayActions = buildTodayActionLines(intel, executionGuide);

    const renderSignalItem = item => `
        <div class="regime-pill regime-${item.trend || item.direction}">
            <span class="regime-pill-label">${item.label}</span>
            <strong>${item.summary}</strong>
        </div>
    `;

    const renderScenarioList = (title, rows, className) => {
        const normalizedRows = rows.map(row => {
            if (typeof row === "string") {
                return { text: row, met: false, note: "상태 점검 필요" };
            }
            return {
                text: row.text || "",
                met: Boolean(row.met),
                note: row.note || ""
            };
        });
        const metCount = normalizedRows.filter(item => item.met).length;

        return `
            <div class="scenario-card ${className}">
                <div class="scenario-head">
                    <span class="scenario-label">${title}</span>
                    <span class="scenario-count">${metCount}/${normalizedRows.length} 충족</span>
                </div>
                <div class="scenario-checklist">
                    ${normalizedRows.map(item => `
                        <div class="scenario-item ${item.met ? "is-met" : "is-pending"}">
                            <div class="scenario-item-top">
                                <span class="scenario-state">${item.met ? "충족" : "미충족"}</span>
                                <strong>${item.text}</strong>
                            </div>
                            <p>${item.note}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    };

    return `
        <section class="regime-board tone-${intel.regime.tone}">
            <div class="regime-headline">
                <div>
                    <span class="section-kicker">AI 시장 분석 (AI Market Intelligence)</span>
                    <h2>${intel.regime.korean}</h2>
                    <p>${intel.regime.summary}</p>
                </div>
                <div class="regime-badge">${intel.regime.label === 'RISK ON' ? '낙관 국면' : intel.regime.label === 'RISK OFF' ? '공포 국면' : '전환 국면'}</div>
            </div>
            <div class="confidence-strip">
                <div class="confidence-meter">
                    <div class="confidence-meter-fill" style="width: ${intel.confidence.score}%"></div>
                </div>
                <div class="confidence-text">
                    <strong>모델 확신도 ${intel.confidence.score}/100</strong>
                    <span>${intel.confidence.label}</span>
                </div>
            </div>
            <div class="intel-conclusion-card">
                <span class="section-kicker">오늘 한 줄 결론</span>
                <p>${todayConclusion}</p>
            </div>
        </section>
        <section class="scenario-grid">
            ${renderScenarioList("상승 지속 조건", intel.scenarios.bullish, "scenario-bull")}
            ${renderScenarioList("하락 전환 조건", intel.scenarios.bearish, "scenario-bear")}
            ${renderScenarioList("무효화 조건", intel.scenarios.invalidation, "scenario-neutral")}
        </section>
        <section class="intel-panel execution-panel">
            <div class="intel-panel-header">
                <div>
                    <h3>실행 가이드 (포지션 운영)</h3>
                    <p>국면·확신도·리스크 경보를 합산해 비중과 사이징을 자동 제안합니다.</p>
                </div>
                <span class="intel-tag">Action</span>
            </div>
            <div class="execution-profile-bar">
                <div class="execution-profile-buttons">
                    <button type="button" class="execution-profile-btn ${executionGuide.profile.key === "aggressive" ? "active" : ""}" onclick="setIntelRiskProfile('aggressive')">공격</button>
                    <button type="button" class="execution-profile-btn ${executionGuide.profile.key === "neutral" ? "active" : ""}" onclick="setIntelRiskProfile('neutral')">중립</button>
                    <button type="button" class="execution-profile-btn ${executionGuide.profile.key === "conservative" ? "active" : ""}" onclick="setIntelRiskProfile('conservative')">보수</button>
                </div>
                <p class="execution-profile-note">${executionGuide.profile.note}</p>
            </div>
            <div class="execution-topline">
                <div class="execution-topline-item">
                    <span>상승 조건</span>
                    <strong>${executionGuide.scenarioSummary.bullish}</strong>
                </div>
                <div class="execution-topline-item">
                    <span>하락 조건</span>
                    <strong>${executionGuide.scenarioSummary.bearish}</strong>
                </div>
                <div class="execution-topline-item">
                    <span>무효화 조건</span>
                    <strong>${executionGuide.scenarioSummary.invalidation}</strong>
                </div>
            </div>
            <div class="execution-action-strip">
                <div class="execution-action-item">
                    <span>지금 할 일</span>
                    <p>${todayActions.doNow}</p>
                </div>
                <div class="execution-action-item">
                    <span>하면 안 되는 일</span>
                    <p>${todayActions.avoidNow}</p>
                </div>
                <div class="execution-action-item">
                    <span>재확인 시점</span>
                    <p>${todayActions.recheckWhen}</p>
                </div>
            </div>
            <div class="execution-allocation-grid">
                <div class="execution-alloc-card alloc-risk">
                    <div class="execution-alloc-head"><span>리스크 자산</span><strong>${executionGuide.allocation.risk}%</strong></div>
                    <div class="execution-alloc-meter"><div class="execution-alloc-fill" style="width:${executionGuide.allocation.risk}%"></div></div>
                </div>
                <div class="execution-alloc-card alloc-cash">
                    <div class="execution-alloc-head"><span>현금</span><strong>${executionGuide.allocation.cash}%</strong></div>
                    <div class="execution-alloc-meter"><div class="execution-alloc-fill" style="width:${executionGuide.allocation.cash}%"></div></div>
                </div>
                <div class="execution-alloc-card alloc-hedge">
                    <div class="execution-alloc-head"><span>헤지</span><strong>${executionGuide.allocation.hedge}%</strong></div>
                    <div class="execution-alloc-meter"><div class="execution-alloc-fill" style="width:${executionGuide.allocation.hedge}%"></div></div>
                </div>
            </div>
            <div class="execution-rule-grid">
                <div class="execution-rule-card">
                    <span class="execution-rule-label">Sizing</span>
                    <strong>${executionGuide.sizing.title}</strong>
                    <p>${executionGuide.sizing.desc}</p>
                </div>
                <div class="execution-rule-card">
                    <span class="execution-rule-label">Entry</span>
                    <p>${executionGuide.entryRule}</p>
                </div>
                <div class="execution-rule-card">
                    <span class="execution-rule-label">Risk</span>
                    <p>${executionGuide.riskRule}</p>
                </div>
                <div class="execution-rule-card">
                    <span class="execution-rule-label">Hedge</span>
                    <p>${executionGuide.hedgeRule}</p>
                </div>
            </div>
        </section>
        <section class="intel-grid supporting-grid">
            <section class="intel-panel">
                <div class="intel-panel-header">
                    <div>
                        <h3>우선 감시 자산</h3>
                        <p>세션 중 가장 먼저 확인해야 할 핵심 체크포인트입니다.</p>
                    </div>
                    <span class="intel-tag">Focus</span>
                </div>
                <div class="watchlist-grid">
                    ${intel.watchlistPriority.map(item => `
                        <a class="watch-card" href="https://www.tradingview.com/chart/?symbol=${encodeURIComponent(item.symbol)}" target="_blank">
                            <div class="watch-head">
                                <strong>${item.name}</strong>
                                <span>${item.symbol}</span>
                            </div>
                            <div class="watch-role">${item.title}</div>
                            <p>${item.why}</p>
                            <div class="watch-trigger">체크 포인트: ${item.trigger}</div>
                        </a>
                    `).join("")}
                </div>
            </section>
            <section class="intel-panel">
                <div class="intel-panel-header">
                    <div>
                        <h3>리스크 점검</h3>
                        <p>현재 해석을 훼손할 수 있는 균열 신호를 우선 표시합니다.</p>
                    </div>
                    <span class="intel-tag">Risk</span>
                </div>
                <div class="risk-warning-list">
                    ${intel.riskWarnings.length ? intel.riskWarnings.map(item => `<div class="risk-warning">${item}</div>`).join("") : '<div class="reaction-empty">현재 리스크 경보 강도는 높지 않습니다.</div>'}
                </div>
            </section>
        </section>
        <section class="intel-panel intel-detail-toggle">
            <details>
                <summary>상세 근거 보기 (데이터 신뢰도 / 점수 분해 / 매크로 체크)</summary>
                <div class="intel-detail-body">
                    <div class="reliability-grid">
                        ${reliabilityCards.map(item => `
                            <div class="reliability-card tone-${item.tone}">
                                <span class="reliability-label">${item.label}</span>
                                <strong>${item.status}</strong>
                                <p>${item.detail}</p>
                            </div>
                        `).join("")}
                    </div>
                    <div class="regime-score-board">
                        <div class="regime-score-header">
                            <div class="regime-score-total">
                                <span class="section-kicker">국면 점수 분해</span>
                                <strong>${intel.scoreBreakdown.total > 0 ? "+" : ""}${intel.scoreBreakdown.total} / ±${intel.scoreBreakdown.max}</strong>
                            </div>
                            <span class="regime-score-sub">Macro ${intel.scoreBreakdown.macro > 0 ? "+" : ""}${intel.scoreBreakdown.macro} · Breadth ${intel.scoreBreakdown.breadth > 0 ? "+" : ""}${intel.scoreBreakdown.breadth}</span>
                        </div>
                        <div class="regime-score-meter">
                            <div class="regime-score-meter-track"></div>
                            <div class="regime-score-meter-center"></div>
                            <div class="regime-score-meter-marker" style="left: ${intel.scoreBreakdown.marker}%"></div>
                        </div>
                        <div class="regime-score-grid">
                            ${intel.scoreBreakdown.contributors.map(item => `
                                <div class="regime-score-item regime-${item.direction}">
                                    <div class="regime-score-item-top">
                                        <span class="regime-score-bucket">${item.bucket}</span>
                                        <strong>${item.contribution > 0 ? "+" : ""}${item.contribution}</strong>
                                    </div>
                                    <span class="regime-score-label">${item.label}</span>
                                    <p>${item.detail}</p>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                    <div class="regime-pill-row">
                        ${intel.macroChecks.map(renderSignalItem).join("")}
                    </div>
                </div>
            </details>
        </section>
    `;
}

function renderPlaybookSidebar() {
    const container = document.getElementById("playbook-container");
    if (!container || !window.DASHBOARD_DATA) return;
    const intel = buildMarketIntel();
    const actionTone = {
        bullish: "악재 내성이 확인되는 자산군 쪽으로 확률이 기울고 있습니다.",
        bearish: "호재에도 가격이 따라오지 않는 자산부터 비중을 점검해야 합니다.",
        neutral: "국면이 혼재돼 있어 가격 반응 확인 후 베팅 규모를 조절하는 편이 적절합니다."
    };

    container.innerHTML = `
        <div class="playbook-card">
            <div class="playbook-header">
                <span class="section-kicker">의사결정 프레임워크</span>
                <strong>${intel.regime.korean}</strong>
            </div>
            <p class="playbook-summary">${actionTone[intel.regime.tone]}</p>
            <div class="playbook-rules">
                <div class="playbook-rule">
                    <span>01</span>
                    <p>호재 발표 이후 가격이 확장되지 않으면 보유 논리를 재검토하고 축소를 우선합니다.</p>
                </div>
                <div class="playbook-rule">
                    <span>02</span>
                    <p>악재 이후에도 가격이 유지되면 매수보다 먼저 최우선 관찰 목록으로 승격합니다.</p>
                </div>
                <div class="playbook-rule">
                    <span>03</span>
                    <p>본전 회복 기대보다 현재 가격이 가설에 동의하는지부터 확인합니다.</p>
                </div>
                <div class="playbook-rule">
                    <span>04</span>
                    <p>달러, 금리, 크레딧이 같은 방향으로 정렬될 때만 베팅 규모를 확대합니다.</p>
                </div>
            </div>
        </div>
    `;
}

function renderPulseBanner() {
    if (!window.DASHBOARD_DATA || !window.DASHBOARD_DATA.macro) return "";
    
    const macro = window.DASHBOARD_DATA.macro;
    
    const getStatus = (data, type) => {
        if (!data) return { class: "neutral", text: "데이터 없음", icon: "", statusDesc: "데이터를 불러오는 중이거나 지표를 산출할 수 없습니다." };
        const isUp = data.trend === "up";
        const icon = isUp ? "▲" : "▼";
        const cls = isUp ? "bullish" : "bearish";

        if (type === 'cu_au') return { 
            class: cls, text: isUp ? "성장 가속" : "성장 둔화", icon,
            statusDesc: isUp ? "구리가 금보다 강세로, 실물 경기 활성화와 인플레이션 기대가 상승하는 구간입니다." : "금 대비 구리 수요가 줄어들어, 경기 위축 우려가 커지거나 원자재가 하락하는 구간입니다."
        };
        if (type === 'spy_tlt') return { 
            class: cls, text: isUp ? "리스크 온" : "리스크 오프", icon,
            statusDesc: isUp ? "안전자산인 채권보다 주식이 선호되어, 시장의 위험 감수 수준이 높은 상태입니다." : "주식보다 안전자산인 채권 선호도가 높아진 상태로, 시장의 불안감이 큼을 시사합니다."
        };
        if (type === 'growth_value') return { 
            class: cls, text: isUp ? "성장주 우세" : "가치주 우세", icon,
            statusDesc: isUp ? "저금리 기조나 기술 혁신으로 인해 성장주가 가치주보다 더 높은 성과를 보이는 중입니다." : "금리 상승기나 경기 회복 초입에서 저평가된 가치주가 상대적으로 강한 성적을 내는 중입니다."
        };
        if (type === 'liquidity') return { 
            class: cls, text: isUp ? "유동성 공급" : "유동성 위축", icon,
            statusDesc: isUp ? "달러가 약세를 보이거나 연준의 정책으로 시장에 유동성이 공급되어 자산 가격에 우호적인 환경입니다." : "달러 강세나 긴축 정책으로 자금이 회수되어, 자산 가격이 압박을 받는 상태입니다."
        };
        if (type === 'yield_curve_3m' || type === 'yield_curve_2y') return { 
            class: cls, text: isUp ? "사이클 확장" : "침체 경계", icon,
            statusDesc: isUp ? "장단기 금리차가 벌어지며(Steepening) 전형적인 경기 확장 국면을 나타냅니다." : "금리차가 0에 가까워지거나 역전(Inversion)되어 경기 침체에 대한 경고 신호가 강화된 구간입니다."
        };
        if (type === 'credit_stress') return { 
            class: cls, text: isUp ? "신용 안정" : "신용 긴장", icon,
            statusDesc: isUp ? "하이일드 채권의 스프레드가 축소되어, 기업들의 자금 조달 여건이 원활하고 신용 리스크가 낮은 상태입니다." : "신용 스프레드가 확대되어 부도 위험이 커지고, 기업들이 자금 조달에 어려움을 겪는 공포 구간입니다."
        };
        
        return { class: "neutral", text: "분석 중...", icon: "", statusDesc: "데이터 분석 중..." };
    };

    const createCard = (label, data, statusObj, desc, tvRatio, wisdomKey) => {
        const tvLink = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvRatio)}`;
        const infoIconHtml = wisdomKey ? `<span class="info-icon" onclick="event.preventDefault(); event.stopPropagation(); showMacroWisdom('${wisdomKey}')">i</span>` : '';
        return `
            <a href="${tvLink}" target="_blank" class="macro-card-link">
                <div class="macro-card">
                    <span class="macro-label">${label}${infoIconHtml}</span>
                    <span class="macro-value">${data ? data.val : "-"} <small style="font-size: 0.6rem; opacity: 0.7;">${statusObj.icon}</small></span>
                    <span class="macro-status status-${statusObj.class}">
                        ${statusObj.text}
                        <div class="macro-status-tooltip">${statusObj.statusDesc}</div>
                    </span>
                    <div class="macro-desc-tooltip">${desc}</div>
                </div>
            </a>
        `;
    };

    // Generate AI Strategy Summary (Multi-Horizon)
    const strategy = window.DASHBOARD_DATA.strategy || { 
        short: "데이터 분석 중...", 
        medium: "데이터 분석 중...", 
        long: "데이터 분석 중..." 
    };
    const showStrategyCards = areStrategyCardsVisible();
    const strategyToggleLabel = showStrategyCards ? "전략 카드 숨기기" : "전략 카드 보기";

    const strategyHtml = `
        <section class="strategy-shell">
            <div class="strategy-shell-header">
                <div>
                    <span class="section-kicker">시장 전략 카드</span>
                    <strong>멀티 호라이즌 전략 프레임</strong>
                </div>
                <button type="button" class="strategy-toggle-btn" onclick="toggleStrategyCards()">${strategyToggleLabel}</button>
            </div>
            ${showStrategyCards ? `
                <div class="strategy-grid">
                    <a href="https://www.tradingview.com/chart/?symbol=VIX" target="_blank" class="strategy-card horizon-short" style="text-decoration: none; color: inherit;">
                        <div class="strategy-horizon">SHORT-TERM (Tactical)</div>
                        <div class="strategy-text">${strategy.short.text || strategy.short}</div>
                        <div class="strategy-rationale">
                            <strong>판단 근거:</strong> ${strategy.short.rationale || "기술적 지표 분석 중"}
                        </div>
                    </a>
                    <a href="https://www.tradingview.com/chart/?symbol=DXY" target="_blank" class="strategy-card horizon-medium" style="text-decoration: none; color: inherit;">
                        <div class="strategy-horizon">MEDIUM-TERM (Trend)</div>
                        <div class="strategy-text">${strategy.medium.text || strategy.medium}</div>
                        <div class="strategy-rationale">
                            <strong>판단 근거:</strong> ${strategy.medium.rationale || "매크로 추세 분석 중"}
                        </div>
                    </a>
                    <a href="https://www.tradingview.com/chart/?symbol=TVC%3AUS10Y-TVC%3AUS02Y" target="_blank" class="strategy-card horizon-long" style="text-decoration: none; color: inherit;">
                        <div class="strategy-horizon">LONG-TERM (Cycle)</div>
                        <div class="strategy-text">${strategy.long.text || strategy.long}</div>
                        <div class="strategy-rationale">
                            <strong>판단 근거:</strong> ${strategy.long.rationale || "경기 사이클 분석 중"}
                        </div>
                    </a>
                </div>
            ` : `
                <div class="strategy-collapsed-note">전략 카드가 접혀 있습니다. 필요할 때만 펼쳐서 확인할 수 있습니다.</div>
            `}
        </section>
    `;

    return `
        ${strategyHtml}
        <div class="pulse-banner">
            <div class="pulse-row-label">매크로 체력 진단 (Market Health Pulse)</div>
            ${createCard("구리/금 비율 (경기 성장)", macro.cu_au, getStatus(macro.cu_au, 'cu_au'), "경기 성장 및 인플레이션 기대치 반영", "COMEX:HG1!/TVC:GOLD", "cu_au")}
            ${createCard("주식/채권 비율 (위험 선호)", macro.spy_tlt, getStatus(macro.spy_tlt, 'spy_tlt'), "위험 자산 선호도(Risk-on/off) 측정", "SP:SPX/TLT", "spy_tlt")}
            ${createCard("성장/가치 비율 (스타일)", macro.growth_value, getStatus(macro.growth_value, 'growth_value'), "성장주와 가치주의 상대적 강세 파악", "VUG/VTV", "growth_value")}
        </div>
        <div class="pulse-banner" style="margin-top: 10px;">
            <div class="pulse-row-label">기관용 딥 매크로 (Institutional Deep Macro)</div>
            ${createCard("달러 인덱스 (유동성 지표)", macro.liquidity, getStatus(macro.liquidity, 'liquidity'), "달러 추세와 글로벌 유동성 공급 추적", "DXY", "liquidity")}
            ${createCard("경기 사이클 (10Y-2Y)", macro.yield_curve_2y, getStatus(macro.yield_curve_2y, 'yield_curve_2y'), "10년-2년 장단기 금리차 (시장 대표 지표)", "TVC:US10Y-TVC:US02Y", "yield_curve_2y")}
            ${createCard("경기 사이클 (10Y-3M)", macro.yield_curve_3m, getStatus(macro.yield_curve_3m, 'yield_curve_3m'), "10년-3개월 장단기 금리차 (드러켄밀러 핵심 지표)", "TVC:US10Y-TVC:US03MY", "yield_curve_3m")}
            ${createCard("신용 긴장도 (Credit Stress)", macro.credit_stress, getStatus(macro.credit_stress, 'credit_stress'), "하이일드 스프레드를 통한 시장 공포 측정", "HYG/IEF", "credit_stress")}
        </div>
        <div class="signal-legend">
            <span class="legend-item">🔥 52주 신고가 (강력 모멘텀)</span>
            <span class="legend-item">⚔️ 골든크로스 (상승추세 전환)</span>
            <span class="legend-item">⚠️ 데드크로스 (하락위험 신호)</span>
        </div>
    `;
}

function renderReportView() {
    const categoryTitles = {
        indices: "국내/글로벌 증시 동향",
        commodities: "주요 원자재 동향",
        currencies: "주요 환율 동향",
        bonds: "글로벌 국채 흐름",
        sectors: "섹터",
        themes: "테마"
    };

    chartGrid.innerHTML = "";
    
    // Add Pulse Banner directly to chartGrid
    const bannerHtml = renderPulseBanner();
    if (bannerHtml) {
        const bannerWrapper = document.createElement("div");
        bannerWrapper.style.display = "contents";
        bannerWrapper.innerHTML = bannerHtml;
        Array.from(bannerWrapper.children).forEach(child => chartGrid.appendChild(child));
    }

    // Iterate over all categories to show everything on one screen
    for (const [catKey, assets] of Object.entries(ASSETS)) {
        const panel = document.createElement("div");
        panel.className = "report-panel";
        
        const title = document.createElement("h3");
        title.textContent = categoryTitles[catKey] || catKey.toUpperCase();
        panel.appendChild(title);

        const table = document.createElement("table");
        table.className = "report-table";
        const isBondPanel = catKey === "bonds";
        const rowsHtml = catKey === "commodities"
            ? createCommodityRows(assets)
            : assets.map(asset => createMockRow(asset, catKey)).join('');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>종목</th>
                    <th>현재가</th>
                    <th>${isBondPanel ? "1D(bp)" : "1D(%)"}</th>
                    <th>${isBondPanel ? "5D(bp)" : "5D(%)"}</th>
                    <th>${isBondPanel ? "MTD(bp)" : "1M(%)"}</th>
                    <th>${isBondPanel ? "YTD(bp)" : "YTD(%)"}</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        `;
        panel.appendChild(table);
        chartGrid.appendChild(panel);
    }
}

function createCommodityRows(assets) {
    const groups = [
        { key: "hard", label: "에너지·금속" },
        { key: "soft", label: "농산물·소프트" }
    ];

    return groups.map(group => {
        const groupAssets = assets.filter(asset => asset.group === group.key);
        if (!groupAssets.length) return "";
        return `
            <tr class="section-row">
                <td colspan="6">${group.label}</td>
            </tr>
            ${groupAssets.map(asset => createMockRow(asset, "commodities")).join("")}
        `;
    }).join("");
}

function renderIntelView() {
    chartGrid.innerHTML = "";

    const intelHtml = renderMarketIntel();
    if (intelHtml) {
        const intelWrapper = document.createElement("div");
        intelWrapper.style.display = "contents";
        intelWrapper.innerHTML = intelHtml;
        Array.from(intelWrapper.children).forEach(child => chartGrid.appendChild(child));
    }
}

function renderGurusView() {
    chartGrid.innerHTML = "";
    if (!window.DASHBOARD_DATA || !window.DASHBOARD_DATA.gurus) return;

    const bannerHtml = renderPulseBanner();
    if (bannerHtml) {
        const bannerWrapper = document.createElement("div");
        bannerWrapper.style.display = "contents";
        bannerWrapper.innerHTML = bannerHtml;
        Array.from(bannerWrapper.children).forEach(child => chartGrid.appendChild(child));
    }

    const gurus = window.DASHBOARD_DATA.gurus;
    const assetsData = window.DASHBOARD_DATA.assets || {};

    const guruGrid = document.createElement("div");
    guruGrid.className = "guru-grid";

    gurus.forEach(guru => {
        const card = document.createElement("div");
        card.className = "guru-card";
        const guruMeta = [
            guru.source,
            guru.period_of_report ? `기준일 ${guru.period_of_report}` : "",
            guru.previous_period_of_report ? `전분기 ${guru.previous_period_of_report} 대비` : "",
            guru.filed_at ? `제출일 ${guru.filed_at}` : ""
        ]
            .filter(Boolean)
            .join(" | ");
        const guruLink = guru.whale_url || guru.sec_url || "#";
        
        let holdingsHtml = guru.holdings.map(h => {
            const data = h.symbol ? assetsData[h.symbol] : null;
            const pcnt1D = data ? parseFloat(data.idx1D) : null;
            const color1D = Number.isFinite(pcnt1D) && pcnt1D >= 0 ? "var(--success)" : "var(--danger)";
            const changeText = Number.isFinite(pcnt1D) ? `${pcnt1D >= 0 ? '+' : ''}${pcnt1D.toFixed(2)}%` : "--";
            const symbolLabel = h.symbol || "N/A";
            const itemTag = h.symbol ? "button" : "div";
            const openAttr = h.symbol ? `onclick="window.open('https://www.tradingview.com/chart/?symbol=${h.symbol}', '_blank')"` : "";
            const quarterLabel = h.change_label
                ? `${h.change_label}${h.change_delta ? ` ${h.change_delta}` : ""}`
                : "비교없음";
            const quarterClass = h.change_class || "is-na";
            
            return `
                <${itemTag} class="holding-item" ${openAttr}>
                    <div class="holding-main">
                        <span class="holding-symbol">${symbolLabel}</span>
                        <span class="holding-name">${h.name}</span>
                    </div>
                    <div class="holding-stats">
                        <span class="holding-weight">${h.weight}</span>
                        <span class="holding-change" style="color: ${Number.isFinite(pcnt1D) ? color1D : 'var(--text-secondary)'}">${changeText}</span>
                        <span class="holding-quarter-badge ${quarterClass}">${quarterLabel}</span>
                    </div>
                </${itemTag}>
            `;
        }).join('');

        card.innerHTML = `
            <div class="guru-header">
                <div class="guru-info">
                    <h4>${guru.name}</h4>
                    <span class="guru-firm">${guru.firm}</span>
                    ${guruMeta ? `<span class="guru-meta">${guruMeta}</span>` : ""}
                </div>
                <a href="${guruLink}" target="_blank" class="whale-link" title="Open Source Profile">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            </div>
            <div class="holdings-list">
                <div class="holdings-header">
                    <span>주요 보유 종목 (TOP HOLDINGS)</span>
                    <span>비중 | 1D | 분기변동</span>
                </div>
                ${holdingsHtml}
            </div>
        `;
        guruGrid.appendChild(card);
    });

    chartGrid.appendChild(guruGrid);
}

function createMockRow(asset, categoryKey = "") {
    const data = (window.DASHBOARD_DATA && window.DASHBOARD_DATA.assets) ? window.DASHBOARD_DATA.assets[asset.symbol] : null;
    
    const price = data ? data.price : "-";
    const displayName = data && data.frequency === "monthly" && !asset.name.includes("(Monthly)")
        ? `${asset.name} (Monthly)`
        : asset.name;
    const useBasisPoints = categoryKey === "bonds" || data?.change_unit === "bp";
    
    const genMetricHtml = (valStr) => {
        if (!valStr || valStr === "-") return '<td class="val-neutral">-</td>';
        
        const valNum = parseFloat(valStr);
        let cls = "";
        let txt = "";
        
        if (valNum > 0) {
            cls = "val-pos-bg";
            txt = `${valNum.toFixed(2)}`;
        } else if (valNum < 0) {
            cls = "val-neg-parens";
            txt = useBasisPoints ? `(${Math.abs(valNum).toFixed(1)})` : `(${Math.abs(valNum).toFixed(2)})`;
        } else {
            cls = "val-neutral";
            txt = useBasisPoints ? "0.0" : "0.00";
        }

        if (valNum > 0) {
            txt = useBasisPoints ? `${valNum.toFixed(1)}` : `${valNum.toFixed(2)}`;
        }
        
        return `<td class="${cls}">${txt}</td>`;
    };

    const tvLink = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(asset.symbol)}`;
    const signalBadge = data && data.signal ? `<span class="signal-badge" title="Technical Signal: ${data.signal}">${data.signal}</span>` : "";
    const col1 = useBasisPoints ? data?.bp1D : data?.idx1D;
    const col2 = useBasisPoints ? data?.bp5D : data?.idx5D;
    const col3 = useBasisPoints ? data?.bpMTD : data?.idxMTD;
    const col4 = useBasisPoints ? data?.bpYTD : data?.idxYTD;
    
    return `
        <tr>
            <td>
                <a href="${tvLink}" target="_blank" class="report-tv-link" title="Open in TradingView">${displayName}</a>
                ${signalBadge}
            </td>
            <td>${price}</td>
            ${genMetricHtml(col1 || "-")}
            ${genMetricHtml(col2 || "-")}
            ${genMetricHtml(col3 || "-")}
            ${genMetricHtml(col4 || "-")}
        </tr>
    `;
}

function renderSentiment() {
    const container = document.getElementById("sentiment-container");
    if (!container || !window.DASHBOARD_DATA) return;

    const fng = window.DASHBOARD_DATA.fng || { val: null, status: "unavailable", available: false };
    const assets = window.DASHBOARD_DATA.assets || {};
    const vix = assets["VIX"] || { price: "-", idx1D: "0" };
    const pcc = assets["PCC"] || { price: "-", idx1D: "0" };

    const hasFng = typeof fng.val === "number";
    const rotation = hasFng ? (fng.val / 100) * 180 - 90 : -90;
    const fngColor = hasFng ? getFngColor(fng.val) : "var(--text-secondary)";
    const fngLabel = hasFng ? fng.status.toUpperCase() : "UNAVAILABLE";
    const fngDisplay = hasFng ? Math.round(fng.val) : "--";

    const getStatusColor = (val) => getFngColor(val);

    const trendRow = (label, val) => {
        if (val === undefined || val === null) return "";
        return `
            <div class="fng-trend-row">
                <span class="fng-trend-label">${label}</span>
                <div class="fng-trend-value-group">
                    <span class="fng-trend-status" style="background-color: ${getStatusColor(val)}"></span>
                    <span class="fng-trend-val">${Math.round(val)}</span>
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div class="sentiment-section">
            <h3 class="sentiment-header">시장 심리 지표 (공포 & 탐욕 지수)</h3>
            
            <div class="fng-professional-gauge">
                <div class="fng-arc-wrapper">
                    <svg viewBox="0 0 200 120" class="fng-svg-new">
                        <defs>
                            <linearGradient id="fngGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#ff3d00" />
                                <stop offset="25%" stop-color="#ff9100" />
                                <stop offset="50%" stop-color="#a0a0b2" />
                                <stop offset="75%" stop-color="#00e676" />
                                <stop offset="100%" stop-color="#00c853" />
                            </linearGradient>
                        </defs>
                        <!-- Background track -->
                        <path d="M20,110 A80,80 0 0,1 180,110" class="fng-track" />
                        <!-- Value Marks -->
                        <path d="M20,110 A80,80 0 0,1 180,110" class="fng-gradient-track" stroke="url(#fngGradient)" />
                        
                        <!-- Needle -->
                        <g class="fng-needle-group" style="transform: rotate(${rotation}deg); transform-origin: 100px 110px; transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
                            <line x1="100" y1="110" x2="100" y2="40" class="fng-needle-line" />
                            <circle cx="100" cy="110" r="5" class="fng-needle-base" />
                        </g>
                    </svg>
                    <div class="fng-center-info">
                        <div class="fng-big-number" style="color: ${fngColor}">${fngDisplay}</div>
                        <div class="fng-status-text">${fngLabel}</div>
                    </div>
                </div>

                <div class="fng-trend-table">
                    ${trendRow("Yesterday", fng.previous_close)}
                    ${trendRow("1 Week Ago", fng.previous_1_week)}
                    ${trendRow("1 Month Ago", fng.previous_1_month)}
                    ${trendRow("1 Year Ago", fng.previous_1_year)}
                </div>
            </div>

            <div class="sentiment-meta-grid">
                <div class="sentiment-mini-card" onclick="window.open('https://www.tradingview.com/chart/?symbol=VIX', '_blank')">
                    <span class="label">VIX 변동성 지수</span>
                    <span class="value" style="color: ${parseFloat(vix.price) > 20 ? 'var(--danger)' : 'var(--success)'}">${vix.price}</span>
                </div>
                <div class="sentiment-mini-card" onclick="window.open('https://stockcharts.com/sc3/ui/?s=%24CPC', '_blank')">
                    <span class="label">풋/콜 비율 (PCC)</span>
                    <span class="value">${pcc ? pcc.price : "-"}</span>
                </div>
            </div>
        </div>
    `;
}

function getFngColor(val) {
    if (val <= 20) return "#ff3d00"; // Extreme Fear
    if (val <= 40) return "#ff9100"; // Fear
    if (val <= 60) return "#a0a0b2"; // Neutral
    if (val <= 80) return "#00e676"; // Greed
    return "#00c853"; // Extreme Greed
}
