import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'stocks.db')

# Connect and create tables
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Stocks Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS stocks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ticker TEXT NOT NULL,
    sector TEXT NOT NULL,
    price REAL NOT NULL,
    prev_close REAL NOT NULL,
    volume INTEGER NOT NULL,
    market_cap TEXT NOT NULL,
    esg_score INTEGER NOT NULL,
    country TEXT NOT NULL,
    ai_signal TEXT NOT NULL,
    pe_ratio REAL,
    eps REAL,
    beta REAL,
    div_yield TEXT,
    high_52w REAL,
    low_52w REAL,
    target_price REAL,
    recommendation_score INTEGER
)
''')

# 2. News Sentiment Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS news_sentiment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_id TEXT NOT NULL,
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    time TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    score INTEGER NOT NULL,
    content TEXT,
    FOREIGN KEY (stock_id) REFERENCES stocks(id)
)
''')

# 3. ESG Breakdown Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS esg_breakdown (
    stock_id TEXT PRIMARY KEY,
    environmental INTEGER NOT NULL,
    social INTEGER NOT NULL,
    governance INTEGER NOT NULL,
    overall INTEGER NOT NULL,
    risk_level TEXT NOT NULL,
    grade TEXT NOT NULL,
    FOREIGN KEY (stock_id) REFERENCES stocks(id)
)
''')

# 4. Shareholdings Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS shareholdings (
    stock_id TEXT PRIMARY KEY,
    institutional REAL NOT NULL,
    promoter REAL NOT NULL,
    public REAL NOT NULL,
    dii REAL NOT NULL,
    insider_buying TEXT NOT NULL,
    FOREIGN KEY (stock_id) REFERENCES stocks(id)
)
''')

# 5. Users Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    tier TEXT NOT NULL,
    joined TEXT NOT NULL,
    strategy TEXT NOT NULL,
    risk_tolerance TEXT NOT NULL,
    goal TEXT NOT NULL,
    bio TEXT
)
''')

# 6. Price Alerts Table
cursor.execute('''
CREATE TABLE IF NOT EXISTS price_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stock_id TEXT NOT NULL,
    threshold REAL NOT NULL,
    type TEXT NOT NULL,
    active INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id)
)
''')

# Clear existing data before seeding
cursor.execute("DELETE FROM stocks")
cursor.execute("DELETE FROM news_sentiment")
cursor.execute("DELETE FROM esg_breakdown")
cursor.execute("DELETE FROM shareholdings")
cursor.execute("DELETE FROM users")
cursor.execute("DELETE FROM price_alerts")

# Seed Stocks
stocks_data = [
    ('TCS', 'Tata Consultancy Services Ltd.', 'TCS.NS', 'Information Technology', 3845.20, 3790.00, 1245000, '14.07T INR', 82, 'IN', 'BUY', 29.4, 130.8, 0.78, '1.45%', 4255.00, 3315.00, 4150.00, 84),
    ('RELIANCE', 'Reliance Industries Ltd.', 'RELIANCE.NS', 'Energy & Conglomerate', 2482.40, 2515.10, 3450000, '16.79T INR', 71, 'IN', 'HOLD', 24.1, 102.9, 1.05, '0.38%', 3024.90, 2220.30, 2750.00, 55),
    ('NVDA', 'NVIDIA Corporation', 'NVDA', 'Semiconductors & AI', 124.50, 118.20, 92000000, '3.06T USD', 85, 'US', 'STRONG BUY', 64.2, 1.94, 1.68, '0.03%', 140.76, 45.90, 155.00, 94),
    ('INFY', 'Infosys Ltd.', 'INFY.NS', 'Information Technology', 1420.15, 1412.00, 2100000, '5.92T INR', 88, 'IN', 'BUY', 23.8, 59.6, 0.82, '2.40%', 1733.00, 1355.00, 1650.00, 78),
    ('AAPL', 'Apple Inc.', 'AAPL', 'Consumer Electronics', 189.24, 187.50, 52000000, '2.95T USD', 84, 'US', 'BUY', 31.5, 6.01, 0.94, '0.52%', 237.23, 164.08, 220.00, 82),
    ('MSFT', 'Microsoft Corporation', 'MSFT', 'Software & Cloud', 425.80, 421.10, 24000000, '3.16T USD', 91, 'US', 'STRONG BUY', 36.2, 11.75, 0.89, '0.71%', 468.35, 309.45, 490.00, 91),
    ('TSLA', 'Tesla Inc.', 'TSLA', 'Automotive & Clean Energy', 177.46, 182.19, 84000000, '564.8B USD', 68, 'US', 'UNDERPERFORM', 52.4, 3.39, 2.34, 'N/A', 271.00, 138.80, 160.00, 28),
    ('HDFCBANK', 'HDFC Bank Ltd.', 'HDFCBANK.NS', 'Banking & Financials', 1610.90, 1595.00, 4800000, '12.24T INR', 79, 'IN', 'BUY', 18.2, 88.5, 0.91, '1.21%', 1757.50, 1363.55, 1850.00, 80)
]

cursor.executemany('''
INSERT INTO stocks VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
''', stocks_data)

# Seed News Sentiment
news_data = [
    ('TCS', 'TCS expands cloud computing partnership with AWS, shares gain', 'MoneyControl', '1 hour ago', 'positive', 82, 'TCS announced a multi-year expansion of their cloud migration capabilities.'),
    ('TCS', 'IT sector hiring slows down; TCS reports minor headcount drop', 'Economic Times', '5 hours ago', 'negative', 35, 'Headcount adjustments and hiring slowdowns in top tech firms raise concerns.'),
    ('RELIANCE', 'Reliance Retail quarterly margins contract on rural slowdown', 'Bloomberg Quint', '2 hours ago', 'negative', 32, 'High inflation levels and minor dip in rural spending weighed on retail margins.'),
    ('RELIANCE', 'Jio launches new AI-powered camera devices for homes', 'TechCrunch', '8 hours ago', 'positive', 75, 'Jio Platforms continues software-hardware ecosystem integration.'),
    ('NVDA', 'NVIDIA Blackwell GPU demand exceeds supply through late 2025', 'CNBC', '40 mins ago', 'positive', 96, 'Major cloud providers ramp up AI capital expenditure.'),
    ('INFY', 'Infosys signs USD 1.5 Billion AI collaboration deal with global firm', 'Economic Times', '3 hours ago', 'positive', 92, 'Infosys Topaz generative AI suite wins landmark deal.'),
    ('AAPL', 'Apple Intelligence rollout boosts iPhone 16 pre-orders globally', 'Wall Street Journal', '30 mins ago', 'positive', 88, 'Early consumer response suggests core AI integration supercycle.'),
    ('MSFT', 'Microsoft Azure Cloud growth accelerates to 33% driven by Copilot AI', 'Reuters', '1 hour ago', 'positive', 94, 'Enterprise adoption of AI assistant workflows expands.'),
    ('TSLA', 'Tesla Full Self-Driving (FSD) approved for trial in key cities in China', 'Reuters', '4 hours ago', 'positive', 91, 'Tesla reaches regulatory milestone in China.'),
    ('HDFCBANK', 'HDFC Bank credit growth improves post-merger integration phase', 'Economic Times', '2 hours ago', 'positive', 84, 'Deposit mobilization rebounds strongly.')
]

cursor.executemany('''
INSERT INTO news_sentiment (stock_id, title, source, time, sentiment, score, content)
VALUES (?,?,?,?,?,?,?)
''', news_data)

# Seed ESG Breakdown
esg_data = [
    ('TCS', 80, 85, 81, 82, 'Low Risk', 'AA'),
    ('RELIANCE', 60, 72, 81, 71, 'Medium Risk', 'BBB'),
    ('NVDA', 84, 82, 88, 85, 'Low Risk', 'AA'),
    ('INFY', 86, 89, 89, 88, 'Negligible Risk', 'AAA'),
    ('AAPL', 89, 78, 85, 84, 'Low Risk', 'AA'),
    ('MSFT', 92, 90, 91, 91, 'Negligible Risk', 'AAA'),
    ('TSLA', 79, 55, 70, 68, 'Medium Risk', 'A'),
    ('HDFCBANK', 75, 80, 82, 79, 'Low Risk', 'A')
]

cursor.executemany('''
INSERT INTO esg_breakdown VALUES (?,?,?,?,?,?,?)
''', esg_data)

# Seed Shareholdings
holdings_data = [
    ('TCS', 74.2, 72.4, 13.4, 11.2, 'Stable (+0.4% in 3M)'),
    ('RELIANCE', 60.5, 50.3, 19.2, 10.0, 'Increased (+1.2% in 3M)'),
    ('NVDA', 68.4, 4.2, 27.4, 0.0, 'Net Selling (-0.3% in 3M)'),
    ('INFY', 81.1, 14.8, 20.1, 14.0, 'Stable'),
    ('AAPL', 60.8, 0.1, 39.1, 0.0, 'Net Selling (-0.8% in 3M)'),
    ('MSFT', 72.1, 0.05, 27.85, 0.0, 'Stable (+0.1% in 3M)'),
    ('TSLA', 42.4, 13.0, 44.6, 0.0, 'Significant Net Selling'),
    ('HDFCBANK', 55.4, 25.8, 18.8, 22.0, 'Accumulation (+1.5% in 3M)')
]

cursor.executemany('''
INSERT INTO shareholdings VALUES (?,?,?,?,?,?)
''', holdings_data)

# Seed User Profile
cursor.execute('''
INSERT INTO users (name, email, tier, joined, strategy, risk_tolerance, goal, bio)
VALUES ('Jai D.', 'jai.investor@example.com', 'Pro Investor Tier', 'August 2024', 'Balanced Growth', 'Moderate', 'Wealth Accumulation & Tech Stock Analytics', 'Passionate retail investor leveraging explainable AI models.')
''')

# Seed Price Alerts
cursor.executemany('''
INSERT INTO price_alerts (stock_id, threshold, type, active)
VALUES (?,?,?,?)
''', [
    ('TCS', 3900.0, 'above', 1),
    ('TSLA', 170.0, 'below', 1),
    ('NVDA', 130.0, 'above', 1)
])

conn.commit()
conn.close()

print("Successfully generated SQLite Database at:", db_path)
