import numpy as np

class SomaticSymbolicTransformer:
    def __init__(self, window_size=30, threshold=0.75):
        self.window_size = window_size
        self.threshold = threshold
        self.buffer = []
        self.state_manifold = {
            "STABLE": "◦A",
            "TURBULENT": "Ex∘",
            "RESONANT": "Φ"
        }

    def ingest_telemetry(self, hrv_value, zeke_proximity=True):
        if not zeke_proximity:
            return "ERROR: UNANCHORED_SOMA"
        self.buffer.append(hrv_value)
        if len(self.buffer) >= self.window_size:
            return self.emit_symbol()
        return None

    def emit_symbol(self):
        mean_hrv = np.mean(self.buffer)
        variance = np.var(self.buffer)
        self.buffer = []
        if variance < (1 - self.threshold):
            return self.state_manifold["RESONANT"]
        elif mean_hrv > 60:
            return self.state_manifold["STABLE"]
        else:
            return self.state_manifold["TURBULENT"]
