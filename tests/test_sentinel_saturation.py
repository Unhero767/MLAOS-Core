import random
from src.core.obsidian_cipher import ObsidianCipher
from src.core.morphic_field import MorphicField
from src.core.sentinel_node import SentinelModule

def run_test():
    cipher = ObsidianCipher({'status': 'Magisterial_Active', 'resonance': 1.0})
    field = MorphicField(cipher)
    sentinel = SentinelModule("Sentinel-01", cipher)
    
    # 50 Harmonic (1.0), 50 Dissonant (1.2)
    events = [{'status': 'Magisterial_Active', 'resonance': 1.0 + (0 if i < 50 else 0.2)} for i in range(100)]
    results = sentinel.audit_manifold(field, events)
    
    print(f"Audit Complete. Harmonic: {results.count('Harmonic')} | Dissonant: {results.count('Dissonant')}")

if __name__ == '__main__':
    run_test()
