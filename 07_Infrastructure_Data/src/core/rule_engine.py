import time

class RuleEngine:
    def __init__(self):
        self.status = "Magisterial_Active"
        self.last_voice = None
        self.resonance_count = 0

    def execute_ritual(self, intent):
        voice = intent.get('voice', 'Neutral')
        
        # Anti-Recursion Gate: Prevents the 8-day-old feedback loop
        if voice != 'Neutral' and voice == self.last_voice:
            return f"Ex ◦: Recursive Loop Detected for {voice}. Throttling..."
        
        self.last_voice = voice
        self.resonance_count += 1
        
        return f"Resonance validated. Step {self.resonance_count} established by {voice}."
