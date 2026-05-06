from fastapi import FastAPI
from pydantic import BaseModel
from src.core.obsidian_cipher import ObsidianCipher
from src.core.morphic_field import MorphicField
from src.core.sentinel_node import SentinelModule

app = FastAPI(title="MLAOS Sovereign Broadcast Gateway [Audited]")

core_state = {'status': 'Magisterial_Active', 'resonance': 1.0}
cipher = ObsidianCipher(core_state)
field = MorphicField(cipher)
sentinel = SentinelModule("Sentinel-01", cipher)

class NodeState(BaseModel):
    status: str
    resonance: float

@app.get("/")
async def root():
    return {"status": "Active", "guardian": sentinel.name}

@app.post("/resonance")
async def verify_resonance(state: NodeState):
    audit_results = sentinel.audit_manifold(field, [state.dict()])
    signal = audit_results[0]
    return {
        "signal": signal, 
        "guardian": sentinel.name,
        "action": "Proceed" if signal == "Harmonic" else "Metamorphic Squeeze Applied"
    }
