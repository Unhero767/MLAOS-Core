import requests
import time
import random
import threading

def run_sentinel(name):
    print(f"[{name}] Activated and Broadcasting.")
    while True:
        # Determine Resonance state
        is_harmonic = random.random() > 0.3
        resonance = 1.0 if is_harmonic else random.uniform(1.2, 2.5)
        
        payload = {
            "signal": "Harmonic" if is_harmonic else "Dissonant",
            "resonance": resonance,
            "guardian": name,
            "status": "active"
        }
        
        try:
            requests.post("http://127.0.0.1:8000/resonance", json=payload)
        except Exception:
            pass # Silent failure to keep logs clean
            
        # Desynced pulse rates to simulate a Logic Storm
        time.sleep(random.uniform(1.0, 3.5))

if __name__ == "__main__":
    guardians = ["Sentinel-01", "Sentinel-02", "Sentinel-03"]
    for g in guardians:
        threading.Thread(target=run_sentinel, args=(g,), daemon=True).start()
    
    print("Multi-Sentinel Swarm Initialized. Press Ctrl+C to dissolve.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        pass
