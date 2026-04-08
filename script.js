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
    { id: "btcusdt", name: "Bitcoin", ticker: "BTCUSDT", chartSymbol: "BINANCE:BTCUSDT", dataSymbol: "BTCUSDT", description: "BITCOIN / TETHER", accent: "BT" }
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

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadTickerTape();
    sortModeButtons();
    
    // Load immediately if data is present
    const initData = () => {
        loadCategory(currentCategory);
        displayMetadata();
        loadEconomicCalendar();
        renderSentiment();
        renderPlaybookSidebar();
        triggerViewTransition();
    };

    if (window.DASHBOARD_DATA) {
        initData();
    } else {
        const retry = setInterval(() => {
            if (window.DASHBOARD_DATA) {
                initData();
                clearInterval(retry);
            }
        }, 100);
    }
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
            loadEconomicCalendar();
            rerenderCurrentMode();
        });
    }

    modeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentMode = btn.dataset.mode;
            
            chartGrid.className = ""; // Reset
            if (currentMode === "report") chartGrid.classList.add("report-view");
            if (currentMode === "global") chartGrid.classList.add("global-view");
            if (currentMode === "intel") chartGrid.classList.add("report-view");
            if (currentMode === "gurus") chartGrid.classList.add("gurus-view");
            if (currentMode === "calendar") chartGrid.classList.add("calendar-view");
            
            if (currentMode === "gurus") {
                renderGurusView();
            } else if (currentMode === "global") {
                renderGlobalView();
            } else if (currentMode === "intel") {
                renderIntelView();
            } else if (currentMode === "calendar") {
                renderCalendarView();
            } else {
                loadCategory(currentCategory);
            }
            triggerViewTransition(true);
        });
    });
    startAutoRefresh(60); // 1 minute in seconds
});

function areStrategyCardsVisible() {
    return localStorage.getItem(STRATEGY_VISIBILITY_KEY) === "1";
}

function rerenderCurrentMode(animate = true) {
    if (currentMode === "gurus") {
        renderGurusView();
    } else if (currentMode === "global") {
        renderGlobalView();
    } else if (currentMode === "intel") {
        renderIntelView();
    } else if (currentMode === "calendar") {
        renderCalendarView();
    } else {
        loadCategory(currentCategory);
    }
    triggerViewTransition(animate);
}

function toggleStrategyCards() {
    localStorage.setItem(STRATEGY_VISIBILITY_KEY, areStrategyCardsVisible() ? "0" : "1");
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
    
    const interval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            remaining = seconds; // Reset for next cycle
            refreshDataSilently();
        } else {
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            if (timerEl) {
                timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            }
        }
    }, 1000);
}

function refreshDataSilently() {
    const oldScript = document.getElementById('data-refresh-script');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.id = 'data-refresh-script';
    script.src = 'data.js?t=' + Date.now();
    script.onload = () => {
        // Update all UI components silently
        saveNotes();
        rerenderCurrentMode(false); // false = no animation
        renderSentiment();
        renderPlaybookSidebar();
        console.log("Data refreshed silently at " + new Date().toLocaleTimeString());
    };
    document.body.appendChild(script);
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

function displayMetadata() {
    if (window.DASHBOARD_DATA && window.DASHBOARD_DATA.last_updated) {
        const text = document.getElementById("last-updated-text");
        if (text) text.textContent = `최근 업데이트: ${window.DASHBOARD_DATA.last_updated}`;
    }
}

const getLocalDateStr = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

let currentCalendarDate = getLocalDateStr();

function changeCalendarDate(delta) {
    const d = new Date(currentCalendarDate);
    d.setDate(d.getDate() + delta);
    currentCalendarDate = getLocalDateStr(d);
    renderCalendarView();
}

function setCalendarToday() {
    currentCalendarDate = getLocalDateStr();
    renderCalendarView();
}

// Expose to window for onclick handlers
window.changeCalendarDate = changeCalendarDate;
window.setCalendarToday = setCalendarToday;

function renderCalendarView() {
    const cg = document.getElementById('chart-grid');
    cg.innerHTML = '<div class="calendar-view-container"></div>';
    cg.classList.add('calendar-active');
    const container = cg.querySelector('.calendar-view-container');
    const allEvents = window.DASHBOARD_DATA.calendar || [];
    
    // Filter by selected date
    const filteredEvents = allEvents.filter(ev => ev.date === currentCalendarDate);
    
    const displayDate = new Date(currentCalendarDate + "T00:00:00");
    const dateStr = displayDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    const isToday = currentCalendarDate === getLocalDateStr();

    let html = `
        <div class="calendar-header-strip">
            <button class="calendar-nav-btn prev-day" onclick="changeCalendarDate(-1)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div class="calendar-center-group">
                ${isToday ? '<span class="btn-today">오늘</span>' : '<button class="btn-today" style="background: rgba(255,255,255,0.1); color: var(--text-secondary);" onclick="setCalendarToday()">오늘</button>'}
                <div class="calendar-date-display">
                    ${dateStr}
                    <span class="calendar-count-sub">${filteredEvents.length}건</span>
                </div>
            </div>
            <button class="calendar-nav-btn next-day" onclick="changeCalendarDate(1)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
        </div>
    `;

    if (filteredEvents.length === 0) {
        html += '<div class="loading-state" style="padding: 4rem;"><p>해당 날짜에 예정된 주요 지표가 없습니다.</p></div>';
    } else {
        filteredEvents.forEach(event => {
            // Build metrics line (inline like reference)
            let metricsHtml = '';
            const metricParts = [];
            if (event.forecast) metricParts.push(`예측 <strong>${event.forecast}</strong>`);
            metricParts.push(`이전 <strong>${event.previous || '-'}</strong>`);
            if (event.actual) {
                metricParts.push(`<span class="ec-actual-value">발표 <strong>${event.actual}</strong></span>`);
            } else {
                metricParts.push(`<span class="ec-pending">발표 예정</span>`);
            }
            metricsHtml = metricParts.join('&nbsp;&nbsp;&nbsp;&nbsp;');

            // Build AI 해석 box (only when actual exists)
            let aiBoxHtml = '';
            if (event.actual && event.ai_summary && event.ai_summary.length > 0) {
                const sentimentClass = event.sentiment === '긍정적 발표' ? 'ec-sentiment-positive' 
                    : event.sentiment === '부정적 발표' ? 'ec-sentiment-negative' 
                    : 'ec-sentiment-neutral';
                const sentimentDot = event.sentiment === '긍정적 발표' ? '🟢' 
                    : event.sentiment === '부정적 발표' ? '🔴' 
                    : '⚪';

                aiBoxHtml = `
                    <div class="ec-ai-box">
                        <div class="ec-ai-header">
                            <div class="ec-ai-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                                AI 해석
                            </div>
                            <div class="ec-sentiment ${sentimentClass}">
                                ${sentimentDot} ${event.sentiment || ''}
                            </div>
                        </div>
                        <div class="ec-ai-bullets">
                            ${event.ai_summary.map(b => `<div class="ec-ai-bullet">▸ ${b}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            html += `
                <div class="ec-card">
                    <div class="ec-card-main">
                        <div class="ec-time">${event.time}</div>
                        <div class="ec-content">
                            <div class="ec-badges">
                                <span class="ec-badge ec-badge-country">${event.country}</span>
                                <span class="ec-badge ${event.importance === '중요' ? 'ec-badge-important' : 'ec-badge-normal'}">${event.importance}</span>
                            </div>
                            <div class="ec-title">${event.title}</div>
                            <div class="ec-metrics">${metricsHtml}</div>
                        </div>
                    </div>
                    ${aiBoxHtml}
                </div>
            `;
        });
    }

    container.innerHTML = html;
}

function loadEconomicCalendar() {
    // Redundant now as we use the main tab, but kept for compatibility or mini-view if requested.
    // For now, it prevents errors in initData.
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

    const preferredOrder = ["report", "global", "intel", "gurus", "calendar"];
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
    chartGrid.innerHTML = `
        <section class="global-market-shell">
            <div class="global-chart-grid">
                ${GLOBAL_MARKET_CHARTS_LIVE.map(item => renderGlobalMarketCard(item)).join("")}
            </div>
        </section>
    `;

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

    const regimeScore = macroChecks.reduce((sum, item) => sum + item.score, 0) + breadthChecks.reduce((sum, item) => sum + (item.score >= 0 ? 1 : -1), 0);
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

    const normalizedConfidence = Math.min(100, Math.max(35, Math.round((Math.abs(regimeScore) / (macroChecks.length + breadthChecks.length)) * 100)));
    const confidenceLabel = normalizedConfidence >= 75 ? "확신 높음" : normalizedConfidence >= 55 ? "확신 보통" : "신호 혼재";

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
    });

    const bullishDrivers = [
        macroChecks.find(item => item.key === "spy_tlt")?.trend === "up" ? "주식/채권 비율이 추가 상승하며 위험 자산 선호가 강화" : null,
        macroChecks.find(item => item.key === "credit_stress")?.trend === "up" ? "크레딧 안정이 유지돼 자금 조달 환경이 추가로 개선" : null,
        breadthChecks.find(item => item.label === "반도체 리더십")?.score >= 0 ? "반도체가 시장 대비 우위를 유지하며 성장 리더십이 지속" : null
    ].filter(Boolean);

    const bearishDrivers = [
        macroChecks.find(item => item.key === "liquidity")?.trend === "down" ? "달러 강세가 심화되며 유동성 여건이 추가로 악화" : "달러가 재차 강세 전환",
        breadthChecks.find(item => item.label === "경기민감 vs 방어")?.score < 0 ? "방어 업종 우위가 고착화되며 확산 신호가 약화" : "경기민감 업종이 다시 꺾이며 추세 확신이 후퇴",
        goodNewsLaggers.length >= 3 ? "호재 둔감 자산이 확산돼 매수 피로가 누적" : "호재 이후 가격 반응 부진이 이어짐"
    ];

    const invalidationDrivers = [
        regime.tone === "bullish" ? "금융주와 반도체가 동시에 상대 강도를 상실" : "신용시장과 리더십이 동시에 회복",
        normalizedConfidence < 60 ? "핵심 지표가 단기간에 급반전" : "핵심 매크로 2개 이상이 반대 방향으로 전환",
        "악재 내성 자산이 빠르게 증가하는지 재확인"
    ];

    const riskWarnings = [
        breadthChecks.find(item => item.label === "반도체 리더십" && item.score < 0) ? "반도체 상대 강도가 약화돼 고베타 리더십의 질이 저하되고 있습니다." : null,
        breadthChecks.find(item => item.label === "경기민감 vs 방어" && item.score < 0) ? "방어 섹터 우위가 지속돼 경기 확산의 폭이 제한되고 있습니다." : null,
        macroChecks.find(item => item.key === "liquidity")?.trend === "down" ? "달러 강세로 유동성 압박이 확대되고 있습니다." : null,
        macroChecks.find(item => item.key === "credit_stress")?.trend === "down" ? "신용시장 긴장이 높아져 주식 강세의 질이 훼손될 수 있습니다." : null,
        goodNewsLaggers.length >= 3 ? "호재에도 가격이 따라오지 않는 자산이 늘어 수급 피로가 누적되고 있습니다." : null
    ].filter(Boolean).slice(0, 4);

    return {
        regime,
        confidence: {
            score: normalizedConfidence,
            label: confidenceLabel
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

    const renderSignalItem = item => `
        <div class="regime-pill regime-${item.trend || item.direction}">
            <span class="regime-pill-label">${item.label}</span>
            <strong>${item.summary}</strong>
        </div>
    `;

    const renderReactionList = (title, subtitle, rows, type) => `
        <section class="intel-panel">
            <div class="intel-panel-header">
                <div>
                    <h3>${title}</h3>
                    <p>${subtitle}</p>
                </div>
                <span class="intel-tag">${type}</span>
            </div>
            <div class="reaction-list">
                ${rows.length ? rows.map(row => `
                    <a class="reaction-item" href="https://www.tradingview.com/chart/?symbol=${encodeURIComponent(row.symbol)}" target="_blank">
                        <div class="reaction-topline">
                            <strong>${row.name}</strong>
                            <span>${row.symbol}</span>
                        </div>
                        <div class="reaction-metrics">
                            <span>1D ${row.idx1D.toFixed(2)}%</span>
                            <span>5D ${row.idx5D.toFixed(2)}%</span>
                            <span>YTD ${row.idxYTD.toFixed(2)}%</span>
                        </div>
                        <p>${row.note}</p>
                    </a>
                `).join("") : '<div class="reaction-empty">현재 조건에 강하게 걸리는 자산이 없습니다.</div>'}
            </div>
        </section>
    `;

    const renderScenarioList = (title, rows, className) => `
        <div class="scenario-card ${className}">
            <span class="scenario-label">${title}</span>
            ${rows.map(row => `<p>${row}</p>`).join("")}
        </div>
    `;

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

            <div class="regime-pill-row">
                ${intel.macroChecks.map(renderSignalItem).join("")}
            </div>
        </section>
        <section class="scenario-grid">
            ${renderScenarioList("상승 지속 조건", intel.scenarios.bullish, "scenario-bull")}
            ${renderScenarioList("하락 전환 조건", intel.scenarios.bearish, "scenario-bear")}
            ${renderScenarioList("무효화 조건", intel.scenarios.invalidation, "scenario-neutral")}
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
        <section class="breadth-board">
            <div class="intel-panel-header">
                <div>
                    <h3>리더십·확산 매트릭스</h3>
                    <p>지수 방향보다 주도 업종의 질과 상승 확산 범위를 점검합니다.</p>
                </div>
                <span class="intel-tag">Breadth</span>
            </div>
            <div class="breadth-grid">
                ${intel.breadthChecks.map(item => `
                    <div class="breadth-card ${item.direction === "up" ? "is-positive" : "is-negative"}">
                        <span>${item.label}</span>
                        <strong>${item.score >= 0 ? "+" : ""}${item.score.toFixed(2)}pt</strong>
                        <p>${item.summary}</p>
                    </div>
                `).join("")}
            </div>
        </section>
        <div class="intel-grid">
            ${renderReactionList("호재 이후 둔화 자산", "기존 성과는 우수하지만 최근 가격 전가력이 둔화된 자산", intel.goodNewsLaggers, "Reaction")}
            ${renderReactionList("악재 이후 회복 자산", "최근 약세에도 불구하고 단기 반응이 복원되는 자산", intel.badNewsResilient, "Resilience")}
        </div>
        <section class="intel-panel contradiction-panel">
            <div class="intel-panel-header">
                <div>
                    <h3>가격-펀더멘털 괴리</h3>
                    <p>기대와 가격이 엇갈릴 때는 내러티브보다 시장 반응을 우선합니다.</p>
                </div>
                <span class="intel-tag">Divergence</span>
            </div>
            <div class="contradiction-list">
                ${intel.fundamentalContradictions.map(row => `
                    <a class="contradiction-item" href="https://www.tradingview.com/chart/?symbol=${encodeURIComponent(row.symbol)}" target="_blank">
                        <div>
                            <strong>${row.name}</strong>
                            <span>${row.symbol}</span>
                        </div>
                        <div class="contradiction-stats">
                            <span>1M ${row.idxMTD.toFixed(2)}%</span>
                            <span>5D ${row.idx5D.toFixed(2)}%</span>
                            <span class="stance">${row.stance}</span>
                        </div>
                    </a>
                `).join("")}
            </div>
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

    const bannerHtml = renderPulseBanner();
    if (bannerHtml) {
        const bannerWrapper = document.createElement("div");
        bannerWrapper.style.display = "contents";
        bannerWrapper.innerHTML = bannerHtml;
        Array.from(bannerWrapper.children).forEach(child => chartGrid.appendChild(child));
    }

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
