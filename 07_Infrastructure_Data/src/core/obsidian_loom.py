from src.core.obsidian_cipher import ObsidianCipher

class ObsidianLoom:
    def __init__(self, cipher: ObsidianCipher):
        self.cipher = cipher
        self.fabrication_count = 0

    def weave_module(self, name, logic):
        if self.cipher.verify_integrity(logic) == "◦A: Consistency Maintained. Obsidian Cipher Intact.":
            self.fabrication_count += 1
            return f"Module {name}: Woven"
        return "Ex ◦: Thread Fracture"
