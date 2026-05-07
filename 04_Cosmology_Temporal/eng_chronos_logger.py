import sqlite3
import datetime
import os

DB_PATH = "chronos_ledger.db"

def initialize_ledger():
    """Create the Luminous Archive if it does not exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            symbol TEXT,
            archetype_name TEXT,
            me_schema TEXT,
            zeke_active BOOLEAN
        )
    ''')
    conn.commit()
    conn.close()

def log_shift(symbol, archetype, zeke_active):
    """Archive a bio-semantic shift into the Stone-Store."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO shifts (timestamp, symbol, archetype_name, me_schema, zeke_active)
        VALUES (?, ?, ?, ?, ?)
    ''', (datetime.datetime.now().isoformat(), symbol, archetype['name'], archetype['me'], zeke_active))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    initialize_ledger()
    print("Chronos-Ledger: INITIALIZED [◦A]")
