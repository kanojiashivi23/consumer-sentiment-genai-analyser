import sqlite3
import os

DB_DIR = "apps/sentiment_analyzer_app/backend/data/db"
DB_PATH = os.path.join(DB_DIR, "app.db")

def get_db():
    """Open a connection with recommended settings."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn
