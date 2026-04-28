import requests
import time
import os

# Magisterial Visual Parameters
SYMBOLS = {
    "◦A": "\033[92m[◦A] CONSISTENCY MAINTAINED\033[0m",
    "Ex∘": "\033[91m[Ex∘] TURBULENCE DETECTED\033[0m",
    "Φ": "\033[94m[Φ] RESONANCE ACHIEVED\033[0m"
}

def observe():
    print("\033[1mMLAOS Phase 9: Resonance Observer Initialized [◦A]\033[0m")
    print("Listening to Skin-Port at http://0.0.0.0:8080...")
    
    while True:
        try:
            # Simulate a continuous heartbeat for the test
            response = requests.post(
                "http://0.0.0.0:8080/telemetry",
                json={"hrv": 75.0, "zeke_active": True},
                timeout=1
            )
            data = response.json()
            
            os.system('clear')
            print(f"--- MLAOS OBSERVER: {time.strftime('%H:%M:%S')} ---")
            
            if data["status"] == "PULSE_EMITTED":
                symbol = data["symbol"]
                print(f"\nSTATUS: {SYMBOLS.get(symbol, symbol)}")
            else:
                fill = data["buffer_fill"]
                bar = "█" * fill + "░" * (30 - fill)
                print(f"\nACCUMULATING SOMATIC DATA: [{bar}] {fill}/30")
                
            time.sleep(0.1)
            
        except Exception as e:
            print(f"Connection Breach: {e}")
            time.sleep(2)

if __name__ == "__main__":
    observe()
