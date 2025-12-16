#!/usr/bin/env python3
# backend/init_db.py - initialize SQLite database with tables and sample data
import sqlite3, os, datetime
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "estudio.db")
if os.path.exists(DB_PATH):
    print("Removendo DB antigo:", DB_PATH)
    os.remove(DB_PATH)
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute("""
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    service TEXT,
    datetime TEXT,
    status TEXT,
    created_at TEXT
)
""")
# Sample appointment
cur.execute("INSERT INTO appointments (name, phone, service, datetime, status, created_at) VALUES (?,?,?,?,?,?)",
            ("Maria Silva","+5511987654321","Tatuagem pequena (R$150)","2025-11-20 14:00","confirmed", datetime.datetime.now().isoformat()))
conn.commit()
conn.close()
print("Banco inicializado em", DB_PATH)