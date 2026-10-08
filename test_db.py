import sqlite3
import os

db = os.path.join(os.path.dirname(__file__), 'stocks.db')
conn = sqlite3.connect(db)
conn.row_factory = sqlite3.Row
tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print('Tables:', [t['name'] for t in tables])
for t in tables:
    count = conn.execute(f"SELECT COUNT(*) as c FROM {t['name']}").fetchone()
    print(f"  {t['name']}: {count['c']} rows")
conn.close()
print("DB check PASSED")
