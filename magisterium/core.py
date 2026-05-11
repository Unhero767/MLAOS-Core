class MagisteriumCore:
    def __init__(self):
        self.sovereign_command = "CORE_DOGMA_ACTIVE"
        self.core_dogma_consistent = True
        self.shadow_shard = []

    def verify_logic(self, proposition, is_iron_axiom=False):
        if "contradiction" in proposition:
            if is_iron_axiom:
                self.core_dogma_consistent = False
                raise SystemError("Metalogical Burn detected in CORE_DOGMA.")
            else:
                self.shadow_shard.append(proposition)
                return "Ghost Inconsistency routed to Shadow Shard."
        return "◦A Maintained."

