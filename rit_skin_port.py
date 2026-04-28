import sys
import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rit_somatic_bridge import SomaticSymbolicTransformer
from eng_archetype_mapper import map_symbol_to_archetype

sys.path.append(os.getcwd())
app = FastAPI(title="MLAOS_Skin_Port_Phase_10")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bridge = SomaticSymbolicTransformer(window_size=30, threshold=0.8)
active_observers = []
current_archetype = {"name": "The Ghost", "me": "Me_None"}

class TelemetryPacket(BaseModel):
    hrv: float
    zeke_active: bool = True

@app.websocket("/ws/resonance")
async def resonance_stream(websocket: WebSocket):
    await websocket.accept()
    active_observers.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        if websocket in active_observers:
            active_observers.remove(websocket)

@app.post("/telemetry")
async def receive_soma(packet: TelemetryPacket):
    global current_archetype
    symbol = bridge.ingest_telemetry(packet.hrv, packet.zeke_active)
    if symbol:
        current_archetype = map_symbol_to_archetype(symbol)
        payload = {"symbol": symbol, "archetype": current_archetype}
        for observer in active_observers:
            try:
                await observer.send_json(payload)
            except:
                continue
        return {"status": "ARCHETYPE_EMITTED", "payload": payload}
    return {"status": "ACCUMULATING", "buffer_fill": len(bridge.buffer)}

if __name__ == "__main__":
    import uvicorn
    print("Skin-Port V10: ARCHETYPAL_READY [◦A]")
    uvicorn.run(app, host="0.0.0.0", port=8080)
