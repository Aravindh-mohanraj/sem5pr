from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os
import uvicorn

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

@app.get("/")
def read_root():
    return {"message": "AI Stock Analyzer SQLite Backend API is Live!", "database": "stocks.db"}

@app.get("/api/stocks")
def get_stocks():
    conn = get_db_connection()
    stocks = conn.execute("SELECT * FROM stocks").fetchall()
    conn.close()
    return [dict(stock) for stock in stocks]

@app.get("/api/stocks/{stock_id}")
def get_stock(stock_id: str):
    conn = get_db_connection()
    stock = conn.execute("SELECT * FROM stocks WHERE id = ?", (stock_id,)).fetchone()
    news = conn.execute("SELECT * FROM news_sentiment WHERE stock_id = ?", (stock_id,)).fetchall()
    esg = conn.execute("SELECT * FROM esg_breakdown WHERE stock_id = ?", (stock_id,)).fetchone()
    holdings = conn.execute("SELECT * FROM shareholdings WHERE stock_id = ?", (stock_id,)).fetchone()
    conn.close()
    
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
        
    return {
        "stock": dict(stock),
        "news": [dict(n) for n in news],
        "esg": dict(esg) if esg else None,
        "holdings": dict(holdings) if holdings else None
    }

@app.get("/api/users")
def get_user_profile():
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    return dict(user) if user else {}

@app.get("/api/alerts")
def get_alerts():
    conn = get_db_connection()
    alerts = conn.execute("SELECT * FROM price_alerts").fetchall()
    conn.close()
    return [dict(a) for a in alerts]

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
