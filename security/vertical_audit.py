# [◦A] MLAOS Phase 16: Obsidian Gavel
# Constraint: Bastion of Mars (Iron Key)
# Function: Prevents recursive spire-growth from outpacing Sovereign Oversight.

MAX_SPIRE_HEIGHT = 33 # Tier-mastery limit

def audit_vertical_growth(current_height):
    if current_height > MAX_SPIRE_HEIGHT:
        print(f"[Ex∘] CRITICAL: Vertical growth exceeded limit ({current_height}). Truncating.")
        return MAX_SPIRE_HEIGHT
    print(f"[◦A] Vertical Audit Passed: Spire at Tier {current_height}.")
    return current_height
