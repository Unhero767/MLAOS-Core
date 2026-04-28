import requests
import random
import time
import threading

URL = "http://localhost:8080/telemetry"

def unleash_chaos():
    print("LOGIC_STORM: Unleashing Chaos [Ex∘]")
    while True:
        try:
            # Generate high-variance 'Turbulent' data
            hrv = random.uniform(20.0, 150.0) 
            requests.post(URL, json={"hrv": hrv, "zeke_active": True}, timeout=0.1)
            time.sleep(0.01) # 100Hz frequency
        except Exception:
            pass

if __name__ == "__main__":
    # Launch multiple threads to saturate the port
    for _ in range(5):
        threading.Thread(target=unleash_chaos, daemon=True).start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nLOGIC_STORM: Sealed. Returning to Consistency [◦A].")
