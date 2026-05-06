import requests
import time
import random

GATEWAY_URL = "http://127.0.0.1:8000/resonance"

def send_pulse():
    print("Sentinel Probe Initialized. Broadcasting to Gateway...")
    while True:
        is_harmonic = random.random() > 0.2
        resonance = 1.0 if is_harmonic else random.uniform(1.4, 2.2)
        
        payload = {
            "signal": "Harmonic" if is_harmonic else "Dissonant",
            "resonance": resonance,
            "guardian": "Sentinel-01",
            "status": "active"
        }
        
        try:
            r = requests.post(GATEWAY_URL, json=payload)
            print(f"Pulse Sent: {payload['signal']} ({resonance:.2f}) - Status: {r.status_code}")
        except Exception as e:
            print(f"Metalogical Burn: Gateway unreachable. Check if FastAPI is running on Port 8000.")
        
        time.sleep(3)

if __name__ == "__main__":
    send_pulse()
