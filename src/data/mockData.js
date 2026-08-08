// Detailed mock data for AI Stock Market Analyzer

export const stocksList = [
  { id: 'TCS', name: 'Tata Consultancy Services', ticker: 'TCS.NS', sector: 'Information Technology', price: 3845.20, prevClose: 3790.00, volume: 1245000, marketCap: '14.07T INR', esgScore: 82 },
  { id: 'RELIANCE', name: 'Reliance Industries Ltd.', ticker: 'RELIANCE.NS', sector: 'Energy & Conglomerate', price: 2482.40, prevClose: 2515.10, volume: 3450000, marketCap: '16.79T INR', esgScore: 71 },
  { id: 'INFY', name: 'Infosys Ltd.', ticker: 'INFY.NS', sector: 'Information Technology', price: 1420.15, prevClose: 1412.00, volume: 2100000, marketCap: '5.92T INR', esgScore: 88 },
  { id: 'AAPL', name: 'Apple Inc.', ticker: 'AAPL', sector: 'Consumer Electronics', price: 189.24, prevClose: 187.50, volume: 52000000, marketCap: '2.95T USD', esgScore: 84 },
  { id: 'TSLA', name: 'Tesla Inc.', ticker: 'TSLA', sector: 'Automotive', price: 177.46, prevClose: 182.19, volume: 84000000, marketCap: '564.8B USD', esgScore: 68 }
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
    
    // Calculate simple technical indicator values on the fly
    // Let's add them to the history object
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
  INFY: generateHistory(1400, 0.002, 0.011),
  AAPL: generateHistory(180, 0.004, 0.010),
  TSLA: generateHistory(195, -0.008, 0.028)
};

// Calculate actual simple moving averages and RSI for demonstration
export const getTechnicalIndicators = (stockId) => {
  const history = stockHistories[stockId] || [];
  const prices = history.map(h => h.close);
  const latestPrice = prices[prices.length - 1];
  
  // Calculate SMA (14 day)
  const sma14 = Number((prices.slice(-14).reduce((sum, p) => sum + p, 0) / 14).toFixed(2));
  
  // Calculate simple RSI (14 day)
  let gains = 0;
  let losses = 0;
  for (let i = prices.length - 14; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const rs = gains / (losses || 1);
  const rsi = Number((100 - (100 / (1 + rs))).toFixed(2));
  
  // Calculate MACD (simulated but proportional)
  const macdLine = Number((latestPrice * 0.005 * (Math.random() * 2 - 1)).toFixed(2));
  const signalLine = Number((macdLine * 0.8).toFixed(2));
  const histogram = Number((macdLine - signalLine).toFixed(2));
  
  // LSTM mock short term (7 day) and long term (30 day) forecasts
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
  INFY: [
    { id: 1, title: 'Infosys signs USD 1.5 Billion AI collaboration deal with global firm', source: 'Economic Times', time: '3 hours ago', sentiment: 'positive', score: 92, content: 'Infosys Topaz generative AI suite wins a landmark deal to transform client digital backend.' },
    { id: 2, title: 'Infosys CEO expresses caution on IT budget rollouts in Europe', source: 'CNBC-TV18', time: '1 day ago', sentiment: 'negative', score: 41, content: 'Clients in manufacturing and banking continue to delay critical tech upgrades amidst economic concerns.' }
  ],
  AAPL: [
    { id: 1, title: 'Apple Intelligence rollout boosts iPhone 16 pre-orders globally', source: 'Wall Street Journal', time: '30 mins ago', sentiment: 'positive', score: 88, content: 'Early consumer response suggests the core AI integration is creating a major upgrade supercycle.' },
    { id: 2, title: 'EU Antitrust regulators fine Apple over developer fee structure', source: 'Financial Times', time: '1 day ago', sentiment: 'negative', score: 28, content: 'Regulatory pressures in European markets intensify, posing minor headwinds for Services revenue.' }
  ],
  TSLA: [
    { id: 1, title: 'Tesla Full Self-Driving (FSD) approved for trial in key cities in China', source: 'Reuters', time: '4 hours ago', sentiment: 'positive', score: 91, content: 'Tesla reaches regulatory milestone for rolling out its advanced driver assistant program in the Chinese market.' },
    { id: 2, title: 'Tesla delivers 386k vehicles in Q1, missing consensus estimates', source: 'Bloomberg', time: '2 days ago', sentiment: 'negative', score: 18, content: 'Production pauses, logistics bottlenecks and price cuts resulted in lower delivery figures than anticipated.' }
  ]
};

export const esgBreakdown = {
  TCS: { environmental: 80, social: 85, governance: 81, overall: 82, level: 'Low Risk', grade: 'AA' },
  RELIANCE: { environmental: 60, social: 72, governance: 81, overall: 71, level: 'Medium Risk', grade: 'BBB' },
  INFY: { environmental: 86, social: 89, governance: 89, overall: 88, level: 'Negligible Risk', grade: 'AAA' },
  AAPL: { environmental: 89, social: 78, governance: 85, overall: 84, level: 'Low Risk', grade: 'AA' },
  TSLA: { environmental: 79, social: 55, governance: 70, overall: 68, level: 'Medium Risk', grade: 'A' }
};

export const holdingsData = {
  TCS: { institutional: 74.2, promoter: 72.4, public: 13.4, dii: 11.2, insiderBuying: 'Stable (+0.4% in 3M)' },
  RELIANCE: { institutional: 60.5, promoter: 50.3, public: 19.2, dii: 10.0, insiderBuying: 'Increased (+1.2% in 3M)' },
  INFY: { institutional: 81.1, promoter: 14.8, public: 20.1, dii: 14.0, insiderBuying: 'Stable' },
  AAPL: { institutional: 60.8, promoter: 0.1, public: 39.1, dii: 0.0, insiderBuying: 'Net Selling (-0.8% in 3M)' },
  TSLA: { institutional: 42.4, promoter: 13.0, public: 44.6, dii: 0.0, insiderBuying: 'Significant Net Selling' }
};

// Pre-defined knowledge base for Q&A chatbot
export const qaKnowledgeBase = [
  {
    keywords: ['tcs', 'tata consultancy'],
    response: `**Tata Consultancy Services (TCS)** is a top-tier Indian IT giant with a **Buy/Hold** recommendation.
    * **Pros**: Healthy ESG score (82/100), high institutional backing (74.2%), and consistent dividend pay-outs. Order book is solid with a recent $250M contract.
    * **Cons**: Short-term headwinds due to general IT recruitment cooling.
    * **Indicators**: RSI = 61.2 (Neutral), trading slightly above 14-day SMA.`
  },
  {
    keywords: ['reliance', 'mukesh ambani'],
    response: `**Reliance Industries (RELIANCE)** is currently a **Hold/Buy on Dips**.
    * **Pros**: Strong telecom traction through Jio and clean energy pivot funding (5,000 Cr bond raising). Insider holdings increased by 1.2% this quarter.
    * **Cons**: Retail segment margins squeezed by 3% recently due to rural slowdown, which dragged the stock down.
    * **Indicators**: RSI = 34.5 (Approaching Oversold zone, making it a good target for accumulation).`
  },
  {
    keywords: ['rsi', 'relative strength index'],
    response: `**Relative Strength Index (RSI)** is a momentum oscillator that measures the speed and change of price movements between 0 and 100.
    * **Oversold (< 30)**: Indicates the asset might be undervalued and could see a bullish trend reversal. (e.g. "Buy" signal)
    * **Overbought (> 70)**: Indicates the asset might be overvalued and could see a bearish pullback. (e.g. "Sell" signal)`
  },
  {
    keywords: ['mpt', 'modern portfolio theory', 'portfolio optimization'],
    response: `**Modern Portfolio Theory (MPT)** is an investment framework designed by Harry Markowitz. It suggests that you can construct an "efficient frontier" of portfolios that offer the maximum possible expected return for a given level of risk. 
    By diversifying assets (e.g. pairing tech stocks with energy stocks that have low correlation), you can reduce the overall portfolio volatility.`
  },
  {
    keywords: ['esg', 'sustainability'],
    response: `**ESG** stands for **Environmental, Social, and Governance**.
    * Investors use ESG metrics to screen potential investments.
    * Companies with higher ESG scores (like **Infosys** at 88/100) often attract significant capital from global institutional funds, meaning lower cost of capital and lower regulatory risk.`
  }
];

// Covariance matrix simulation for Portfolio Optimization
// Correlation factors between stocks to run MPT calculations
export const stockCorrelations = {
  TCS: { TCS: 1.0, RELIANCE: 0.25, INFY: 0.78, AAPL: 0.45, TSLA: 0.35 },
  RELIANCE: { TCS: 0.25, RELIANCE: 1.0, INFY: 0.20, AAPL: 0.30, TSLA: 0.15 },
  INFY: { TCS: 0.78, RELIANCE: 0.20, INFY: 1.0, AAPL: 0.48, TSLA: 0.32 },
  AAPL: { TCS: 0.45, RELIANCE: 0.30, INFY: 0.48, AAPL: 1.0, TSLA: 0.52 },
  TSLA: { TCS: 0.35, RELIANCE: 0.15, INFY: 0.32, AAPL: 0.52, TSLA: 1.0 }
};

// Learning Center Chapters & Quizzes
export const learningChapters = [
  {
    id: 'intro',
    title: 'Stock Market Basics',
    description: 'Learn the foundational concepts of stock markets, stock prices, and orders.',
    lessons: [
      { title: 'What is a Stock?', content: 'A stock (also known as equity) represents fractional ownership in a corporation. When you buy a share of TCS, you own a tiny portion of TCS.' },
      { title: 'Market Cap', content: 'Market Capitalization = Share Price × Total Outstanding Shares. It categorizes companies into Large-cap, Mid-cap, and Small-cap.' }
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
    title: 'Technical Indicators',
    description: 'Master chart-reading tools like RSI, Moving Averages, and trends.',
    lessons: [
      { title: 'Moving Averages', content: 'A Simple Moving Average (SMA) smoothes out price data to form a trend-following line. If the price crosses above its SMA, it triggers a bullish signal.' },
      { title: 'The RSI Oscillator', content: 'Relative Strength Index (RSI) is calculated on a 0-100 scale. Below 30 means Oversold, while above 70 means Overbought.' }
    ],
    quiz: {
      question: "If Reliance's RSI falls to 24, how is the stock technically classified?",
      options: [
        "Overbought (Expect immediate crash)",
        "Oversold (Potential buy on dip)",
        "Neutral Trend",
        "Dividend Declared"
      ],
      answer: 1,
      explanation: "RSI below 30 is traditionally classified as Oversold, signaling that selling pressure might be exhausted and a rebound is possible."
    }
  },
  {
    id: 'portfolio',
    title: 'Portfolio Diversification',
    description: 'Understand risk management, correlation, and asset allocation.',
    lessons: [
      { title: 'Don\'t Put All Eggs in One Basket', content: 'If you invest solely in IT stocks (e.g. TCS & Infosys), and the IT sector crashes, your entire portfolio falls. Diversifying into Energy (Reliance) protects you.' },
      { title: 'Asset Correlation', content: 'Correlation is a value between -1.0 and +1.0. A correlation of +0.78 (like TCS and INFY) means they move together. Lower correlation reduces portfolio risk.' }
    ],
    quiz: {
      question: "To achieve the highest diversification benefit, how should assets in a portfolio correlate?",
      options: [
        "Highly positively correlated (+0.9)",
        "Perfectly correlated (+1.0)",
        "Uncorrelated or negatively correlated (<= 0.2)",
        "They shouldn't have any prices"
      ],
      answer: 2,
      explanation: "Uncorrelated or negatively correlated assets offset each other's volatility, providing the best risk reduction benefit."
    }
  }
];
