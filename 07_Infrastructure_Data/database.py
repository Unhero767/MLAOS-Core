import aiosqlite
import os

# The Absolute Anchor: Always looks at the project root
DB_PATH = os.path.join(os.path.dirname(__file__), "../../manifold_Σ7.db")

async def init_db():
    """Initializes the stone if it does not exist."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS magisterial_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                guardian TEXT, signal TEXT, resonance REAL, status TEXT
            )
        """)
        await db.commit()
