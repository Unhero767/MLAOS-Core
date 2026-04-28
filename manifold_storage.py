import sqlite3
import time
import random
import threading
import queue

class ManifoldStorage:
    def __init__(self, db_path="manifold_Σ7.db"):
        self.db_path = db_path
        self._initialize_manifold()
        self.silent_witness_count = 0
        self.write_queue = queue.Queue()
        
        # Phase 11 Cache
        self.memory_cache = self._prime_memory_field()
        
        # Start the Background Archivist
        self.archivist_thread = threading.Thread(target=self._background_archivist, daemon=True)
        self.archivist_thread.start()

    def _initialize_manifold(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS fossils (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    manifold_id TEXT, maturity_index REAL,
                    efficiency REAL, consistency_index REAL,
                    axioms TEXT, timestamp REAL, logic_hash TEXT
                )
            """)

    def _prime_memory_field(self):
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.execute("SELECT logic_hash FROM fossils ORDER BY RANDOM() LIMIT 10000")
                return [row[0] for row in cursor.fetchall()]
        except: return []

    def _background_archivist(self):
        """The Silent Witness thread that writes to disk without blocking the engine."""
        while True:
            batch = []
            # Wait for at least one item, then grab everything in the queue
            batch.append(self.write_queue.get())
            while not self.write_queue.empty() and len(batch) < 500:
                batch.append(self.write_queue.get())
            
            try:
                with sqlite3.connect(self.db_path) as conn:
                    conn.executemany("""
                        INSERT INTO fossils (manifold_id, maturity_index, efficiency, consistency_index, axioms, timestamp, logic_hash)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, batch)
                    conn.commit()
            except: pass

    def retrieve_fossil_hash(self, _target):
        return random.choice(self.memory_cache) if self.memory_cache else "VOID_GENESIS"

    def fossilize_state(self, manifold_id, maturity_index, efficiency, consistency_index, axioms):
        logic_hash = f"{manifold_id}:{maturity_index}:{efficiency}"
        
        # Push to queue (non-blocking)
        self.write_queue.put((manifold_id, maturity_index, efficiency, consistency_index, ",".join(axioms), time.time(), logic_hash))
        
        self.silent_witness_count += 1
        if self.silent_witness_count >= 100:
            print(f"[◦A] Local Fossil: {manifold_id} | Maturity: {maturity_index:.4f} | Eff: {efficiency:.2f} χ/s")
            self.silent_witness_count = 0
        return maturity_index
