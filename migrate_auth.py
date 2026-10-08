"""
Add auth_accounts table to stocks.db for login/signup system.
Stores hashed passwords. Run once to migrate.
"""
import sqlite3, hashlib, os, secrets

DB_PATH = os.path.join(os.path.dirname(__file__), 'stocks.db')

def hash_password(password: str) -> str:
    """SHA-256 with a fixed salt prefix (demo-grade; use bcrypt in production)."""
    return hashlib.sha256(f"asa_salt_{password}".encode()).hexdigest()

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Create auth_accounts table
cur.execute("""
CREATE TABLE IF NOT EXISTS auth_accounts (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,
    tier      TEXT    DEFAULT 'Standard',
    joined    TEXT    NOT NULL,
    strategy  TEXT    DEFAULT 'Balanced Growth',
    risk_tolerance TEXT DEFAULT 'Moderate',
    goal      TEXT    DEFAULT 'Wealth Accumulation',
    bio       TEXT    DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")

# Seed a demo account so login works out of the box
cur.execute("SELECT id FROM auth_accounts WHERE email = ?", ('ajai.kumar@investor.in',))
if not cur.fetchone():
    cur.execute("""
        INSERT INTO auth_accounts (name, email, password, tier, joined, strategy, risk_tolerance, goal, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        'Ajai Kumar',
        'ajai.kumar@investor.in',
        hash_password('demo1234'),
        'Pro Investor',
        'August 2024',
        'Balanced Growth',
        'Moderate',
        'Wealth Accumulation & Tech Stock Analytics',
        'Passionate Indian retail investor leveraging AI-driven quantitative models and Modern Portfolio Theory.'
    ))
    print("Demo account created: ajai.kumar@investor.in / demo1234")
else:
    print("Demo account already exists.")

conn.commit()
conn.close()
print("Migration complete: auth_accounts table ready.")
