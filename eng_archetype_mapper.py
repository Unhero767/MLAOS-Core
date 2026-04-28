import sys
import os

# Archetypal Mapping Table (Me Schemas)
ARCHETYPES = {
    "Φ": {"name": "The Architect", "action": "Construct", "me": "Me_01_Sovereignty"},
    "◦A": {"name": "The Archivist", "action": "Preserve", "me": "Me_12_Truth"},
    "Ex∘": {"name": "The Storm-Bringer", "action": "Transmute", "me": "Me_05_Chaos"}
}

def map_symbol_to_archetype(symbol):
    """Translates Tier II symbols into Phase 10 Archetypes."""
    archetype = ARCHETYPES.get(symbol, {"name": "The Ghost", "action": "Wait", "me": "Me_None"})
    return archetype

if __name__ == "__main__":
    test_symbol = "Φ"
    res = map_symbol_to_archetype(test_symbol)
    print(f"SYMBOL: {test_symbol} -> ARCHETYPE: {res['name']} ({res['me']}) [◦A]")
