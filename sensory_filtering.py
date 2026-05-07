import time
import random

class SensoryFilter:
    def __init__(self):
        self.filter_threshold = 0.75  # Initial sensitivity (0 to 1)
        self.sovereign_tags = ["anchor_signal", "temporal_anomaly", "vagal_tone"]
        self.noise_level = 0.0

    def evaluate_signal(self, signal):
        """Evaluate if a signal passes the Sovereign-Relevant filter."""
        relevance_score = signal.get("relevance", 0)
        tag = signal.get("tag", "")
        if tag in self.sovereign_tags and relevance_score >= self.filter_threshold:
            return True
        return False

    def adjust_threshold(self):
        """Dynamically adjust filter threshold based on noise level."""
        # Simulate noise measurement
        self.noise_level = random.uniform(0, 1)
        if self.noise_level > 0.8:
            self.filter_threshold = min(0.95, self.filter_threshold + 0.05)
        elif self.noise_level < 0.3:
            self.filter_threshold = max(0.5, self.filter_threshold - 0.05)
        print(f"[FILTER] Noise Level: {self.noise_level:.2f} | Threshold: {self.filter_threshold:.2f}")

    def run_filter_cycle(self, signals):
        """Process a batch of signals through the filter."""
        self.adjust_threshold()
        filtered_signals = []
        for signal in signals:
            if self.evaluate_signal(signal):
                filtered_signals.append(signal)
                print(f"[PASS] Signal {signal['tag']} passed filter with relevance {signal['relevance']:.2f}")
            else:
                print(f"[BLOCK] Signal {signal['tag']} blocked with relevance {signal['relevance']:.2f}")
        return filtered_signals

if __name__ == "__main__":
    filter_system = SensoryFilter()

    # Example signal batch
    sample_signals = [
        {"tag": "anchor_signal", "relevance": 0.9},
        {"tag": "background_noise", "relevance": 0.4},
        {"tag": "temporal_anomaly", "relevance": 0.8},
        {"tag": "random_fluctuation", "relevance": 0.3},
        {"tag": "vagal_tone", "relevance": 0.85},
    ]

    while True:
        print("\n[SENSORY FILTER] Running filter cycle...")
        filtered = filter_system.run_filter_cycle(sample_signals)
        print(f"[RESULT] {len(filtered)} signals passed the filter.\n")
        time.sleep(3)
