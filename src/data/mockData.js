// Professional Mock Data & AI Analytics Engine for AI Stock Market Analyzer

export const stocksList = [
  { 
    id: 'TCS', 
    name: 'Tata Consultancy Services Ltd.', 
    ticker: 'TCS.NS', 
    sector: 'Information Technology', 
    price: 3845.20, 
    prevClose: 3790.00, 
    volume: 1245000, 
    marketCap: '14.07T INR', 
    esgScore: 82, 
    country: 'IN', 
    popular: true, 
    aiSignal: 'BUY',
    peRatio: 29.4,
    eps: 130.8,
    beta: 0.78,
    divYield: '1.45%',
    high52w: 4255.00,
    low52w: 3315.00,
    targetPrice: 4150.00,
    recommendationScore: 84
  },
  { 
    id: 'RELIANCE', 
    name: 'Reliance Industries Ltd.', 
    ticker: 'RELIANCE.NS', 
    sector: 'Energy & Conglomerate', 
    price: 2482.40, 
    prevClose: 2515.10, 
    volume: 3450000, 
    marketCap: '16.79T INR', 
    esgScore: 71, 
    country: 'IN', 
    popular: true, 
    aiSignal: 'HOLD',
    peRatio: 24.1,
    eps: 102.9,
    beta: 1.05,
    divYield: '0.38%',
    high52w: 3024.90,
    low52w: 2220.30,
    targetPrice: 2750.00,
    recommendationScore: 55
  },
  { 
    id: 'NVDA', 
    name: 'NVIDIA Corporation', 
    ticker: 'NVDA', 
    sector: 'Semiconductors & AI', 
    price: 124.50, 
    prevClose: 118.20, 
    volume: 92000000, 
    marketCap: '3.06T USD', 
    esgScore: 85, 
    country: 'US', 
    popular: true, 
    aiSignal: 'STRONG BUY',
    peRatio: 64.2,
    eps: 1.94,
    beta: 1.68,
    divYield: '0.03%',
    high52w: 140.76,
    low52w: 45.90,
    targetPrice: 155.00,
    recommendationScore: 94
  },
  { 
    id: 'INFY', 
    name: 'Infosys Ltd.', 
    ticker: 'INFY.NS', 
    sector: 'Information Technology', 
    price: 1420.15, 
    prevClose: 1412.00, 
    volume: 2100000, 
    marketCap: '5.92T INR', 
    esgScore: 88, 
    country: 'IN', 
    popular: false, 
    aiSignal: 'BUY',
    peRatio: 23.8,
    eps: 59.6,
    beta: 0.82,
    divYield: '2.40%',
    high52w: 1733.00,
    low52w: 1355.00,
    targetPrice: 1650.00,
    recommendationScore: 78
  },
  { 
    id: 'AAPL', 
    name: 'Apple Inc.', 
    ticker: 'AAPL', 
    sector: 'Consumer Electronics', 
    price: 189.24, 
    prevClose: 187.50, 
    volume: 52000000, 
    marketCap: '2.95T USD', 
    esgScore: 84, 
    country: 'US', 
    popular: true, 
    aiSignal: 'BUY',
    peRatio: 31.5,
    eps: 6.01,
    beta: 0.94,
    divYield: '0.52%',
    high52w: 237.23,
    low52w: 164.08,
    targetPrice: 220.00,
    recommendationScore: 82
  },
  { 
    id: 'MSFT', 
    name: 'Microsoft Corporation', 
    ticker: 'MSFT', 
    sector: 'Software & Cloud', 
    price: 425.80, 
    prevClose: 421.10, 
    volume: 24000000, 
    marketCap: '3.16T USD', 
    esgScore: 91, 
    country: 'US', 
    popular: true, 
    aiSignal: 'STRONG BUY',
    peRatio: 36.2,
    eps: 11.75,
    beta: 0.89,
    divYield: '0.71%',
    high52w: 468.35,
    low52w: 309.45,
    targetPrice: 490.00,
    recommendationScore: 91
  },
  { 
    id: 'TSLA', 
    name: 'Tesla Inc.', 
    ticker: 'TSLA', 
    sector: 'Automotive & Clean Energy', 
    price: 177.46, 
    prevClose: 182.19, 
    volume: 84000000, 
    marketCap: '564.8B USD', 
    esgScore: 68, 
    country: 'US', 
    popular: false, 
    aiSignal: 'UNDERPERFORM',
    peRatio: 52.4,
    eps: 3.39,
    beta: 2.34,
    divYield: 'N/A',
    high52w: 271.00,
    low52w: 138.80,
    targetPrice: 160.00,
    recommendationScore: 28
  },
  { 
    id: 'HDFCBANK', 
    name: 'HDFC Bank Ltd.', 
    ticker: 'HDFCBANK.NS', 
    sector: 'Banking & Financials', 
    price: 1610.90, 
    prevClose: 1595.00, 
    volume: 4800000, 
    marketCap: '12.24T INR', 
    esgScore: 79, 
    country: 'IN', 
    popular: true, 
    aiSignal: 'BUY',
    peRatio: 18.2,
    eps: 88.5,
    beta: 0.91,
    divYield: '1.21%',
    high52w: 1757.50,
    low52w: 1363.55,
    targetPrice: 1850.00,
    recommendationScore: 80
  }
];

// Generate 30 days of stock price history for charts
const generateHistory = (startPrice, trend, volatility, days = 30) => {
  const history = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dailyChange = (Math.random() - 0.48 + trend) * currentPrice * volatility;
    const open = Number((currentPrice).toFixed(2));
    const close = Number((currentPrice + dailyChange).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * currentPrice * volatility * 0.5).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * currentPrice * volatility * 0.5).toFixed(2));
    const volume = Math.floor(Math.random() * 1000000) + 500000;
    
    history.push({
      date: dateStr,
      open,
      high,
      low,
      close,
      volume
    });
    currentPrice = close;
  }
  return history;
};

// Seed histories
export const stockHistories = {
  TCS: generateHistory(3750, 0.005, 0.012),
  RELIANCE: generateHistory(2540, -0.002, 0.015),
  NVDA: generateHistory(110, 0.012, 0.025),
  INFY: generateHistory(1400, 0.002, 0.011),
  AAPL: generateHistory(180, 0.004, 0.010),
  MSFT: generateHistory(410, 0.006, 0.011),
  TSLA: generateHistory(195, -0.008, 0.028),
  HDFCBANK: generateHistory(1570, 0.003, 0.009)
};

// Calculate technical indicators
export const getTechnicalIndicators = (stockId) => {
  const history = stockHistories[stockId] || generateHistory(100, 0.001, 0.01);
  const prices = history.map(h => h.close);
  const latestPrice = prices[prices.length - 1];
  
  const sma14 = Number((prices.slice(-14).reduce((sum, p) => sum + p, 0) / 14).toFixed(2));
  
  let gains = 0;
  let losses = 0;
  for (let i = prices.length - 14; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const rs = gains / (losses || 1);
  const rsi = Number((100 - (100 / (1 + rs))).toFixed(2));
  
  const macdLine = Number((latestPrice * 0.005 * (Math.random() * 2 - 1)).toFixed(2));
  const signalLine = Number((macdLine * 0.8).toFixed(2));
  const histogram = Number((macdLine - signalLine).toFixed(2));
  
  const forecast7Day = Number((latestPrice * (1 + (rsi < 35 ? 0.045 : rsi > 70 ? -0.03 : 0.015) + (Math.random() * 0.02 - 0.01))).toFixed(2));
  const forecast30Day = Number((latestPrice * (1 + (rsi < 40 ? 0.09 : rsi > 65 ? -0.05 : 0.04) + (Math.random() * 0.05 - 0.02))).toFixed(2));
  
  return {
    price: latestPrice,
    rsi,
    sma14,
    macd: { line: macdLine, signal: signalLine, hist: histogram },
    predictions: {
      days7: forecast7Day,
      days7ChangePct: Number((((forecast7Day - latestPrice) / latestPrice) * 100).toFixed(2)),
      days30: forecast30Day,
      days30ChangePct: Number((((forecast30Day - latestPrice) / latestPrice) * 100).toFixed(2)),
    }
  };
};

export const newsSentiment = {
  TCS: [
    { id: 1, title: 'TCS expands cloud computing partnership with AWS, shares gain', source: 'MoneyControl', time: '1 hour ago', sentiment: 'positive', score: 82, content: 'TCS announced a multi-year expansion of their cloud migration capabilities, targeting corporate transitions.' },
    { id: 2, title: 'IT sector hiring slows down; TCS reports minor headcount drop', source: 'Economic Times', time: '5 hours ago', sentiment: 'negative', score: 35, content: 'Headcount adjustments and hiring slowdowns in top tech firms raise concerns over near-term growth.' },
    { id: 3, title: 'TCS bag $250M digital transformation contract from UK retailer', source: 'Reuters', time: '1 day ago', sentiment: 'positive', score: 89, content: 'A massive deal size boost highlights TCS resilient order book despite global discretionary spend cuts.' }
  ],
  RELIANCE: [
    { id: 1, title: 'Reliance Retail quarterly margins contract on rural slowdown', source: 'Bloomberg Quint', time: '2 hours ago', sentiment: 'negative', score: 32, content: 'High inflation levels and a minor dip in rural spending weighed on retail margins during Q1.' },
    { id: 2, title: 'Jio launches new AI-powered camera devices for homes', source: 'TechCrunch', time: '8 hours ago', sentiment: 'positive', score: 75, content: 'Jio Platforms continues its software-hardware ecosystem integration with the launch of intelligent home cameras.' },
    { id: 3, title: 'Reliance Industries schedules bond auction to raise 5,000 Cr', source: 'Mint', time: '1 day ago', sentiment: 'neutral', score: 50, content: 'The conglomerate raises capital to fund ongoing clean energy initiatives and 5G network expansion.' }
  ],
  NVDA: [
    { id: 1, title: 'NVIDIA Blackwell GPU demand exceeds supply through late 2025', source: 'CNBC', time: '40 mins ago', sentiment: 'positive', score: 96, content: 'Major cloud providers ramp up AI capital expenditure, cementing NVIDIA leadership in AI accelerator chips.' },
    { id: 2, title: 'US semiconductor export controls update impacts international shipments', source: 'WSJ', time: '6 hours ago', sentiment: 'negative', score: 42, content: 'Tightened regulatory oversight requires special license applications for high-performance AI hardware.' }
  ],
  INFY: [
    { id: 1, title: 'Infosys signs USD 1.5 Billion AI collaboration deal with global firm', source: 'Economic Times', time: '3 hours ago', sentiment: 'positive', score: 92, content: 'Infosys Topaz generative AI suite wins a landmark deal to transform client digital backend.' },
    { id: 2, title: 'Infosys CEO expresses caution on IT budget rollouts in Europe', source: 'CNBC-TV18', time: '1 day ago', sentiment: 'negative', score: 41, content: 'Clients in manufacturing and banking continue to delay critical tech upgrades amidst economic concerns.' }
  ],
  AAPL: [
    { id: 1, title: 'Apple Intelligence rollout boosts iPhone 16 pre-orders globally', source: 'Wall Street Journal', time: '30 mins ago', sentiment: 'positive', score: 88, content: 'Early consumer response suggests the core AI integration is creating a major upgrade supercycle.' },
    { id: 2, title: 'EU Antitrust regulators fine Apple over developer fee structure', source: 'Financial Times', time: '1 day ago', sentiment: 'negative', score: 28, content: 'Regulatory pressures in European markets intensify, posing minor headwinds for Services revenue.' }
  ],
  MSFT: [
    { id: 1, title: 'Microsoft Azure Cloud growth accelerates to 33% driven by Copilot AI', source: 'Reuters', time: '1 hour ago', sentiment: 'positive', score: 94, content: 'Enterprise adoption of AI assistant workflows expands across Fortune 500 subscribers.' },
    { id: 2, title: 'Microsoft invests additional $4 Billion in European data center hubs', source: 'TechCrunch', time: '4 hours ago', sentiment: 'positive', score: 86, content: 'Infrastructure investments prepare capacity for upcoming enterprise LLM deployment workloads.' }
  ],
  TSLA: [
    { id: 1, title: 'Tesla Full Self-Driving (FSD) approved for trial in key cities in China', source: 'Reuters', time: '4 hours ago', sentiment: 'positive', score: 91, content: 'Tesla reaches regulatory milestone for rolling out its advanced driver assistant program in the Chinese market.' },
    { id: 2, title: 'Tesla delivers 386k vehicles in Q1, missing consensus estimates', source: 'Bloomberg', time: '2 days ago', sentiment: 'negative', score: 18, content: 'Production pauses, logistics bottlenecks and price cuts resulted in lower delivery figures than anticipated.' }
  ],
  HDFCBANK: [
    { id: 1, title: 'HDFC Bank credit growth improves post-merger integration phase', source: 'Economic Times', time: '2 hours ago', sentiment: 'positive', score: 84, content: 'Deposit mobilization rebounds strongly, supporting healthy net interest margin recovery.' },
    { id: 2, title: 'RBI maintains benchmark repo rate, signaling stability for banking sector', source: 'Financial Express', time: '5 hours ago', sentiment: 'positive', score: 78, content: 'Stable monetary policy environment favors retail loan growth and asset quality preservation.' }
  ]
};

export const esgBreakdown = {
  TCS: { environmental: 80, social: 85, governance: 81, overall: 82, level: 'Low Risk', grade: 'AA' },
  RELIANCE: { environmental: 60, social: 72, governance: 81, overall: 71, level: 'Medium Risk', grade: 'BBB' },
  NVDA: { environmental: 84, social: 82, governance: 88, overall: 85, level: 'Low Risk', grade: 'AA' },
  INFY: { environmental: 86, social: 89, governance: 89, overall: 88, level: 'Negligible Risk', grade: 'AAA' },
  AAPL: { environmental: 89, social: 78, governance: 85, overall: 84, level: 'Low Risk', grade: 'AA' },
  MSFT: { environmental: 92, social: 90, governance: 91, overall: 91, level: 'Negligible Risk', grade: 'AAA' },
  TSLA: { environmental: 79, social: 55, governance: 70, overall: 68, level: 'Medium Risk', grade: 'A' },
  HDFCBANK: { environmental: 75, social: 80, governance: 82, overall: 79, level: 'Low Risk', grade: 'A' }
};

export const holdingsData = {
  TCS: { institutional: 74.2, promoter: 72.4, public: 13.4, dii: 11.2, insiderBuying: 'Stable (+0.4% in 3M)' },
  RELIANCE: { institutional: 60.5, promoter: 50.3, public: 19.2, dii: 10.0, insiderBuying: 'Increased (+1.2% in 3M)' },
  NVDA: { institutional: 68.4, promoter: 4.2, public: 27.4, dii: 0.0, insiderBuying: 'Net Selling (-0.3% in 3M)' },
  INFY: { institutional: 81.1, promoter: 14.8, public: 20.1, dii: 14.0, insiderBuying: 'Stable' },
  AAPL: { institutional: 60.8, promoter: 0.1, public: 39.1, dii: 0.0, insiderBuying: 'Net Selling (-0.8% in 3M)' },
  MSFT: { institutional: 72.1, promoter: 0.05, public: 27.85, dii: 0.0, insiderBuying: 'Stable (+0.1% in 3M)' },
  TSLA: { institutional: 42.4, promoter: 13.0, public: 44.6, dii: 0.0, insiderBuying: 'Significant Net Selling' },
  HDFCBANK: { institutional: 55.4, promoter: 25.8, public: 18.8, dii: 22.0, insiderBuying: 'Accumulation (+1.5% in 3M)' }
};

export const qaKnowledgeBase = [
  {
    keywords: ['tcs', 'tata consultancy'],
    response: `**Tata Consultancy Services (TCS)** holds a **Buy** AI recommendation.
    * **Pros**: Healthy ESG score (82/100, Grade AA), high institutional backing (74.2%), P/E ratio 29.4x, and dividend yield 1.45%.
    * **Indicators**: RSI = 61.2 (Neutral), trading above 14-day SMA.`
  },
  {
    keywords: ['nvidia', 'nvda'],
    response: `**NVIDIA Corporation (NVDA)** holds a **Strong Buy** AI recommendation.
    * **Pros**: Dominates AI chip hardware market with Blackwell demand booked through late 2025. FinBERT sentiment score is 96%. Target Price $155.
    * **Indicators**: High momentum, RSI = 68.5.`
  },
  {
    keywords: ['microsoft', 'msft'],
    response: `**Microsoft (MSFT)** holds a **Strong Buy** recommendation.
    * **Pros**: Azure Cloud growing 33% YoY boosted by enterprise Copilot AI integration. Industry-leading ESG rating (91/100, Grade AAA). Target Price $490.
    * **Indicators**: RSI = 58.4, consistent upward trend above 14-day SMA.`
  },
  {
    keywords: ['hdfc', 'hdfcbank'],
    response: `**HDFC Bank (HDFCBANK)** is India's largest private lender with a **Buy on Dips** recommendation.
    * **Pros**: Low P/E ratio 18.2x, credit growth recovering post-merger, domestic institutional accumulation (+1.5% insider buying).
    * **Indicators**: RSI = 48.2 (Fairly valued).`
  },
  {
    keywords: ['reliance', 'mukesh ambani'],
    response: `**Reliance Industries (RELIANCE)** is currently a **Hold/Buy on Dips**.
    * **Pros**: Strong telecom traction through Jio and clean energy pivot funding (5,000 Cr bond raising). Insider holdings increased by 1.2% this quarter.
    * **Indicators**: RSI = 34.5 (Approaching Oversold zone, making it a good target for accumulation).`
  },
  {
    keywords: ['rsi', 'relative strength index'],
    response: `**Relative Strength Index (RSI)** is a momentum oscillator measuring price speed and changes between 0 and 100.
    * **Oversold (< 30)**: Asset might be undervalued, signaling potential bullish reversal.
    * **Overbought (> 70)**: Asset might be overvalued, signaling potential bearish pullback.`
  },
  {
    keywords: ['mpt', 'modern portfolio theory', 'portfolio optimization'],
    response: `**Modern Portfolio Theory (MPT)** constructs an "efficient frontier" of portfolios offering maximum expected return for a given level of risk. Diversifying across low-correlation assets minimizes total variance.`
  },
  {
    keywords: ['esg', 'sustainability'],
    response: `**ESG (Environmental, Social, Governance)** metrics screen corporate sustainability. Companies with high ESG ratings (e.g. **Microsoft** at 91/100, **Infosys** at 88/100) attract global institutional capital with lower regulatory risk.`
  }
];

export const stockCorrelations = {
  TCS: { TCS: 1.0, RELIANCE: 0.25, NVDA: 0.50, INFY: 0.78, AAPL: 0.45, MSFT: 0.60, TSLA: 0.35, HDFCBANK: 0.30 },
  RELIANCE: { TCS: 0.25, RELIANCE: 1.0, NVDA: 0.20, INFY: 0.20, AAPL: 0.30, MSFT: 0.25, TSLA: 0.15, HDFCBANK: 0.45 },
  NVDA: { TCS: 0.50, RELIANCE: 0.20, NVDA: 1.0, INFY: 0.52, AAPL: 0.65, MSFT: 0.72, TSLA: 0.58, HDFCBANK: 0.22 },
  INFY: { TCS: 0.78, RELIANCE: 0.20, NVDA: 0.52, INFY: 1.0, AAPL: 0.48, MSFT: 0.58, TSLA: 0.32, HDFCBANK: 0.28 },
  AAPL: { TCS: 0.45, RELIANCE: 0.30, NVDA: 0.65, INFY: 0.48, AAPL: 1.0, MSFT: 0.70, TSLA: 0.52, HDFCBANK: 0.35 },
  MSFT: { TCS: 0.60, RELIANCE: 0.25, NVDA: 0.72, INFY: 0.58, AAPL: 0.70, MSFT: 1.0, TSLA: 0.48, HDFCBANK: 0.32 },
  TSLA: { TCS: 0.35, RELIANCE: 0.15, NVDA: 0.58, INFY: 0.32, AAPL: 0.52, MSFT: 0.48, TSLA: 1.0, HDFCBANK: 0.18 },
  HDFCBANK: { TCS: 0.30, RELIANCE: 0.45, NVDA: 0.22, INFY: 0.28, AAPL: 0.35, MSFT: 0.32, TSLA: 0.18, HDFCBANK: 1.0 }
};

export const learningChapters = [
  {
    id: 'intro',
    title: 'Stock Market Fundamentals',
    description: 'Master fractional ownership, market cap valuation, and market order execution.',
    lessons: [
      { title: 'Understanding Equity & Ownership', content: 'A stock (equity) represents fractional ownership in a corporation. Holding shares entitles you to proportional earnings and voting rights.' },
      { title: 'Market Cap Classifications', content: 'Market Capitalization = Share Price × Total Outstanding Shares. Categorizes companies into Large-cap (>₹20k Cr), Mid-cap, and Small-cap.' }
    ],
    quiz: {
      question: "If a company has 1 million shares and each share is trading at ₹150, what is its Market Capitalization?",
      options: [
        "₹15 Million",
        "₹150 Million (₹15 Crore)",
        "₹1.5 Billion (₹150 Crore)",
        "₹150,000"
      ],
      answer: 1,
      explanation: "Market Cap = 1,000,000 shares * ₹150 = ₹150,000,000 (₹15 Crore)."
    }
  },
  {
    id: 'technical',
    title: 'Technical Indicators & Quantitative Signals',
    description: 'Learn chart reading with RSI momentum, Moving Average crossovers, and MACD.',
    lessons: [
      { title: 'Simple Moving Average (SMA)', content: 'An SMA smoothes out daily price fluctuations into a clear trendline. Golden Crossovers (50 SMA crossing above 200 SMA) signal major bullish trends.' },
      { title: 'RSI Oscillator', content: 'Relative Strength Index (RSI) ranges between 0 and 100. Below 30 indicates oversold levels (accumulation), while above 70 indicates overbought levels.' }
    ],
    quiz: {
      question: "If Reliance's RSI falls to 24, how is the stock technically classified?",
      options: [
        "Overbought (Expect immediate crash)",
        "Oversold (Potential buy on dip opportunity)",
        "Neutral Trend",
        "Dividend Declared"
      ],
      answer: 1,
      explanation: "RSI below 30 is classified as Oversold, indicating selling exhaustion and potential price rebound."
    }
  },
  {
    id: 'portfolio',
    title: 'Portfolio Theory & Risk Optimization',
    description: 'Understand Modern Portfolio Theory (MPT), covariance matrix, and Sharpe Ratio.',
    lessons: [
      { title: 'Asset Correlation Benefits', content: 'Pairing assets with low or negative correlation (<=0.2) reduces portfolio variance without sacrificing expected return.' },
      { title: 'Sharpe Ratio Diagnostic', content: 'Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Volatility. A Sharpe ratio > 1.0 indicates attractive risk-adjusted performance.' }
    ],
    quiz: {
      question: "To achieve maximum risk reduction in a portfolio, how should assets correlate?",
      options: [
        "Highly positively correlated (+0.9)",
        "Perfectly correlated (+1.0)",
        "Uncorrelated or low correlation (<= 0.2)",
        "Zero price movement"
      ],
      answer: 2,
      explanation: "Uncorrelated or negatively correlated assets offset volatility, yielding maximum risk reduction."
    }
  }
];
