"""
Full API test suite for AI Stock Analyzer — FastAPI backend
Tests all endpoints: /, /api/stocks, /api/stocks/{id}, /api/users, /api/alerts
"""
import sys
import urllib.request
import urllib.error
import json

BASE = "http://127.0.0.1:8000"
PASS = 0
FAIL = 0

def test(name, url, expected_status=200, check_fn=None):
    global PASS, FAIL
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            status = r.getcode()
            data = json.loads(r.read().decode())
            if status != expected_status:
                print(f"  FAIL [{name}] Expected status {expected_status}, got {status}")
                FAIL += 1
                return
            if check_fn and not check_fn(data):
                print(f"  FAIL [{name}] Data check failed. Got: {str(data)[:120]}")
                FAIL += 1
                return
            print(f"  PASS [{name}]")
            PASS += 1
    except Exception as e:
        print(f"  FAIL [{name}] Exception: {e}")
        FAIL += 1

print("\n=== AI Stock Analyzer — API Test Suite ===\n")

test("GET /         — Health check",
     f"{BASE}/",
     check_fn=lambda d: "message" in d)

test("GET /api/stocks — Returns list",
     f"{BASE}/api/stocks",
     check_fn=lambda d: isinstance(d, list) and len(d) > 0)

test("GET /api/stocks — Has required fields",
     f"{BASE}/api/stocks",
     check_fn=lambda d: all(k in d[0] for k in ['id','name','price','sector','ai_signal']))

test("GET /api/stocks/TCS — Single stock detail",
     f"{BASE}/api/stocks/TCS",
     check_fn=lambda d: 'stock' in d and d['stock']['id'] == 'TCS')

test("GET /api/stocks/TCS — Has news data",
     f"{BASE}/api/stocks/TCS",
     check_fn=lambda d: 'news' in d and isinstance(d['news'], list))

test("GET /api/stocks/TCS — Has ESG data",
     f"{BASE}/api/stocks/TCS",
     check_fn=lambda d: 'esg' in d and d['esg'] is not None)

test("GET /api/users  — Returns user profile",
     f"{BASE}/api/users",
     check_fn=lambda d: isinstance(d, dict))

test("GET /api/alerts — Returns alerts list",
     f"{BASE}/api/alerts",
     check_fn=lambda d: isinstance(d, list))

print(f"\n=== Results: {PASS} PASSED  |  {FAIL} FAILED ===\n")
sys.exit(0 if FAIL == 0 else 1)
