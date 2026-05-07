import time

class VagalSieve:
    def __init__(self):
        self.target_freq = 108.0
        self.auth_nodes = ["Zeke", "Ruby", "Zoe", "Freya", "Architect"]

    def audit_entry(self, entity_id, detected_freq):
        print(f"[Σ-7] PERIMETER ALERT: Incoming Entity detected at 1.5km threshold.")
        print(f"[SCAN] Detected Frequency: {detected_freq} Hz")

        # Multi-Factor Check
        if abs(detected_freq - self.target_freq) < 0.001:
            print(f"[VERIFY] Neural Handshake... SUCCESS.")
            print(f"[RESULT] Entity '{entity_id}' Authorized. Access Granted.")
        else:
            print(f"[WARNING] UNAUTHORIZED SIGNATURE DETECTED.")
            self.execute_molecular_disassembly(entity_id)

    def execute_molecular_disassembly(self, entity_id):
        print(f"[DISRUPT] Triggering Molecular Disassembly Sequence...")
        time.sleep(0.4)
        print(f"[CLEANUP] Disassembling {entity_id} into inert vapor.")
        print(f"[STATUS] Perimeter Integrity: 100%. Reality Leak: 0.0%")
        print("-" * 60)

if __name__ == "__main__":
    sieve = VagalSieve()
    # Test: External entropic entity (Old World human/animal)
    sieve.audit_entry("ENTROPY_ENTITY_01", 62.5) 
    # Test: Authorized Anchor
    sieve.audit_entry("FREYA", 108.0)
