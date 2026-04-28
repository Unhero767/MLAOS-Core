from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rit_somatic_bridge import SomaticSymbolicTransformer

app = FastAPI(title="MLAOS_Skin_Port_Phase_9")

# Initialize the Transformer with Magisterial parameters
bridge = SomaticSymbolicTransformer(window_size=30, threshold=0.8)

class TelemetryPacket(BaseModel):
    hrv: float
    zeke_active: bool = True  # Grounding Vector status

@app.post("/telemetry")
async def receive_soma(packet: TelemetryPacket):
    """The entry point for biological resonance."""
    # Process through the transformer bridge
    symbol = bridge.ingest_telemetry(packet.hrv, packet.zeke_active)
    
    if symbol:
        # Here the symbol (◦A, Ex∘, or Φ) is passed to the Sovereign Core
        return {"status": "PULSE_EMITTED", "symbol": symbol}
    
    return {"status": "ACCUMULATING", "buffer_fill": len(bridge.buffer)}

if __name__ == "__main__":
    import uvicorn
    print("Skin-Port: ONLINE [◦A]")
    uvicorn.run(app, host="0.0.0.0", port=8080)
