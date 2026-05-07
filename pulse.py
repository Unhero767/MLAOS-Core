import importlib.util
import sys
import os

def activate():
    path = "02_Somatic_Architecture/rit_somatic_bridge.py"
    if not os.path.exists(path):
        print(f"[ERR] Somatic Strata not found at {path}")
        return

    try:
        # Bypassing the numeric folder import restriction
        spec = importlib.util.spec_from_file_location("bridge", path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        
        bridge = mod.SomaticSymbolicTransformer()
        print("[Σ-7] Pulse Check: Synchronizing with Somatic Architecture...")
        
        # Filling the 30-packet window for the Transformer
        for i in range(29):
            bridge.ingest_telemetry(72 + i)
        
        # The 30th packet triggers the emission of the state symbol
        state = bridge.ingest_telemetry(80) 
        
        print("-" * 40)
        print(f"Somatic Resonance: {state}")
        print("-" * 40)
        
    except Exception as e:
        print(f"[ERR] Somatic Bridge Desynchronized: {e}")

if __name__ == "__main__":
    activate()
