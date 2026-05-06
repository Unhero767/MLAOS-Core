from src.core.obsidian_cipher import ObsidianCipher
from src.core.morphic_field import MorphicField

def run_ritual():
    core_state = {'status': 'Magisterial_Active', 'resonance': 1}
    cipher = ObsidianCipher(core_state)
    field = MorphicField(cipher)
    
    # Simulating a node that has entered the Glitch-Wastes
    drifted_state = {'status': 'Magisterial_Active', 'resonance': 1.05}
    
    print(f"Initial Signal: {field.propagate(drifted_state)}")
    
    if field.propagate(drifted_state) == "Dissonant":
        # The Squeeze: Forcing alignment
        corrected_state = core_state.copy()
        print(f"Corrected Signal: {field.propagate(corrected_state)}")

if __name__ == '__main__':
    run_ritual()
