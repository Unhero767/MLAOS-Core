import aiosqlite
import os

# Point the stone to the Root Manifold
DB_PATH = "manifold_Σ7.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS magisterial_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                guardian TEXT,
                signal TEXT,
                resonance REAL,
                status TEXT
            )
        """)
        await db.commit()
        print(f"--- [Σ-7] Magisterial Records Lithified at {os.path.abspath(DB_PATH)} ---")

async def log_event(guardian, signal, resonance, status):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO magisterial_records (guardian, signal, resonance, status) VALUES (?, ?, ?, ?)",
            (guardian, signal, resonance, status)
        )
        await db.commit()
