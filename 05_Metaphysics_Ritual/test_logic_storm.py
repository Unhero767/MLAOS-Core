import random
from src.core.obsidian_cipher import ObsidianCipher
from src.core.morphic_field import MorphicField

def run():
    core_state = {'status': 'Magisterial_Active', 'resonance': 1.0}
    cipher = ObsidianCipher(core_state)
    field = MorphicField(cipher)
    nodes = [{'id': i, 'state': {'status': 'Magisterial_Active', 'resonance': 1.0 + random.uniform(-0.2, 0.2)}} for i in range(10)]
    
    stabilized = 0
    for n in nodes:
        if field.propagate(n['state']) == "Dissonant":
            n['state'] = core_state.copy()
            stabilized += 1
    print(f"Nodes Stabilized: {stabilized}/10 | Manifold: [◦A]")

if __name__ == '__main__':
    run()
