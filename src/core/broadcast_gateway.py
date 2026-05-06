from fastapi import FastAPI
from pydantic import BaseModel
from src.core.obsidian_cipher import ObsidianCipher

app = FastAPI(title="MLAOS Sovereign Broadcast Gateway")
core_state = {'status': 'Magisterial_Active', 'resonance': 1.0}
cipher = ObsidianCipher(core_state)

class NodeState(BaseModel):
    status: str
    resonance: float

@app.get("/")
async def root():
    return {"status": "Broadcast Active", "origin": "Σ-7"}

@app.post("/resonance")
async def verify_resonance(state: NodeState):
    is_valid = cipher.verify_integrity(state.dict()) == "◦A: Consistency Maintained. Obsidian Cipher Intact."
    return {"signal": "Harmonic" if is_valid else "Dissonant"}
