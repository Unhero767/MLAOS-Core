import numpy as np

class SomaticSymbolicTransformer:
    def __init__(self, window_size=30, threshold=0.75):
        self.window_size = window_size
        self.threshold = threshold
        self.buffer = []
        self.last_emitted = "◦A"
        self.state_manifold = {
            "STABLE": "◦A",
            "TURBULENT": "Ex∘",
            "RESONANT": "Φ"
        }

    def ingest_telemetry(self, hrv_value, zeke_active=True):
        if not zeke_active and len(self.buffer) > 0:
            # Sudden loss of grounding increases noise
            hrv_value += np.random.normal(0, 10)
            
        self.buffer.append(hrv_value)
        if len(self.buffer) >= self.window_size:
            return self.emit_symbol(zeke_active)
        return None

    def emit_symbol(self, zeke_active):
        mean_hrv = np.mean(self.buffer)
        variance = np.var(self.buffer)
        self.buffer = []

        # The Zeke Stabilizer: 
        # If Zeke is active, we dampen the variance by 40% before thresholding.
        effective_variance = variance * 0.6 if zeke_active else variance

        if effective_variance < (1 - self.threshold):
            self.last_emitted = self.state_manifold["RESONANT"]
        elif effective_variance > 50 and not zeke_active:
            self.last_emitted = self.state_manifold["TURBULENT"]
        else:
            # Grounding keeps us in the current or stable state
            self.last_emitted = self.state_manifold["STABLE"]
            
        return self.last_emitted
