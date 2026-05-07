from typing import List
from mlaos_types import TruthValue

class AFieldResonance:
    def __init__(self, engine_id: str):
        self.id = engine_id
        self.harmonics: List[float] = []

    def sense_manifold(self, external_index: float):
        delta = abs(1.0 - external_index)
        if delta > 0.1:
            print(f"[!] Dissonance Detected: {delta} Metalogical Heat rising.")
            return False
        print(f"[◦A] Resonance Synchronized at {1.0 - delta}.")
        return True

    def broadcast_state(self, current_state: TruthValue):
        print(f"[MAGISTERIUM] Broadcasting {current_state.value} from {self.id}")
