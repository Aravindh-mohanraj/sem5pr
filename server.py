from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3, hashlib, os, uvicorn
from datetime import datetime

app = FastAPI(title="AI Stock Analyzer API", description="FastAPI SQLite Backend Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), 'stocks.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(f"asa_salt_{password}".encode()).hexdigest()

# ── Pydantic schemas ──────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdateRequest(BaseModel):
    name: str
    email: str
    strategy: str
    risk_tolerance: str
    goal: str
    bio: str

# ── Root ──────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "AI Stock Analyzer SQLite Backend API is Live!", "database": "stocks.db"}

# ── Stock endpoints ───────────────────────────────────────────────────────────

@app.get("/api/stocks")
def get_stocks():
    conn = get_db_connection()
    stocks = conn.execute("SELECT * FROM stocks").fetchall()
    conn.close()
    return [dict(s) for s in stocks]

@app.get("/api/stocks/{stock_id}")
def get_stock(stock_id: str):
    conn = get_db_connection()
    stock    = conn.execute("SELECT * FROM stocks WHERE id = ?", (stock_id,)).fetchone()
    news     = conn.execute("SELECT * FROM news_sentiment WHERE stock_id = ?", (stock_id,)).fetchall()
    esg      = conn.execute("SELECT * FROM esg_breakdown WHERE stock_id = ?", (stock_id,)).fetchone()
    holdings = conn.execute("SELECT * FROM shareholdings WHERE stock_id = ?", (stock_id,)).fetchone()
    conn.close()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {
        "stock":    dict(stock),
        "news":     [dict(n) for n in news],
        "esg":      dict(esg) if esg else None,
        "holdings": dict(holdings) if holdings else None,
    }

@app.get("/api/users")
def get_user_profile():
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users ORDER BY id ASC LIMIT 1").fetchone()
    conn.close()
    return dict(user) if user else {}

@app.get("/api/alerts")
def get_alerts():
    conn = get_db_connection()
    alerts = conn.execute("SELECT * FROM price_alerts").fetchall()
    conn.close()
    return [dict(a) for a in alerts]

# ── Auth endpoints ────────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
def signup(req: SignupRequest):
    if not req.name.strip() or not req.email.strip() or not req.password:
        raise HTTPException(status_code=400, detail="All fields are required.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    conn = get_db_connection()
    existing = conn.execute(
        "SELECT id FROM auth_accounts WHERE email = ?", (req.email.lower().strip(),)
    ).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    joined = datetime.now().strftime("%B %Y")
    conn.execute(
        """INSERT INTO auth_accounts (name, email, password, tier, joined)
           VALUES (?, ?, ?, ?, ?)""",
        (req.name.strip(), req.email.lower().strip(), hash_password(req.password), "Standard", joined)
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM auth_accounts WHERE email = ?", (req.email.lower().strip(),)
    ).fetchone()
    conn.close()
    user = dict(row)
    user.pop("password", None)
    return {"success": True, "user": user}

@app.post("/api/auth/login")
def login(req: LoginRequest):
    if not req.email.strip() or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    conn = get_db_connection()
    row = conn.execute(
        "SELECT * FROM auth_accounts WHERE email = ?", (req.email.lower().strip(),)
    ).fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="No account found with this email.")
    if row["password"] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Incorrect password. Please try again.")

    user = dict(row)
    user.pop("password", None)
    return {"success": True, "user": user}

@app.get("/api/auth/profile/{user_id}")
def get_auth_profile(user_id: int):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM auth_accounts WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="User not found.")
    user = dict(row)
    user.pop("password", None)
    return user

@app.put("/api/auth/profile/{user_id}")
def update_auth_profile(user_id: int, req: ProfileUpdateRequest):
    conn = get_db_connection()
    existing = conn.execute("SELECT id FROM auth_accounts WHERE id = ?", (user_id,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found.")
    conn.execute(
        """UPDATE auth_accounts
           SET name=?, email=?, strategy=?, risk_tolerance=?, goal=?, bio=?
           WHERE id=?""",
        (req.name.strip(), req.email.lower().strip(),
         req.strategy, req.risk_tolerance, req.goal, req.bio, user_id)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM auth_accounts WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    user = dict(row)
    user.pop("password", None)
    return {"success": True, "user": user}

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
