from src.core.obsidian_cipher import ObsidianCipher

class MorphicField:
    def __init__(self, cipher: ObsidianCipher):
        self.anchor = cipher
        self.field_strength = 1.0

    def propagate(self, local_state):
        if self.anchor.verify_integrity(local_state) == "◦A: Consistency Maintained. Obsidian Cipher Intact.":
            return "Harmonic"
        return "Dissonant"
