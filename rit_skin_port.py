import sys
import os
import sqlite3
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# MLAOS Internal Module Imports
sys.path.append(os.getcwd())
from rit_somatic_bridge import SomaticSymbolicTransformer
from eng_archetype_mapper import map_symbol_to_archetype
from eng_chronos_logger import log_shift, initialize_ledger
from eng_predictive_burn import predict_next_state

app = FastAPI(title="MLAOS_Skin_Port_Phase_12")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
)

initialize_ledger()
bridge = SomaticSymbolicTransformer(window_size=30, threshold=0.8)
active_observers = []
last_stable_symbol = "◦A"

class TelemetryPacket(BaseModel):
    hrv: float
    zeke_active: bool = True

@app.get("/history")
async def get_history():
    conn = sqlite3.connect("chronos_ledger.db")
    cursor = conn.cursor()
    cursor.execute("SELECT symbol, me_schema, timestamp FROM shifts ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    conn.close()
    return [{"symbol": r[0], "me": r[1], "time": r[2]} for r in rows]

@app.websocket("/ws/resonance")
async def resonance_stream(websocket: WebSocket):
    await websocket.accept()
    active_observers.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        if websocket in active_observers:
            active_observers.remove(websocket)

async def broadcast(data):
    for observer in active_observers:
        try:
            await observer.send_json(data)
        except:
            continue

@app.post("/telemetry")
async def receive_soma(packet: TelemetryPacket):
    global last_stable_symbol
    
    # Check for Ghost Prediction every 5 pulses
    if len(bridge.buffer) > 0 and len(bridge.buffer) % 5 == 0:
        prediction = predict_next_state(bridge.buffer, last_stable_symbol)
        await broadcast({"ghost_symbol": prediction, "status": "PREDICTING"})

    symbol = bridge.ingest_telemetry(packet.hrv, packet.zeke_active)
    
    if symbol:
        last_stable_symbol = symbol
        archetype = map_symbol_to_archetype(symbol)
        log_shift(symbol, archetype, packet.zeke_active)
        payload = {"symbol": symbol, "archetype": archetype, "status": "ARCHETYPE_LOGGED"}
        await broadcast(payload)
        return payload
        
    return {"status": "ACCUMULATING", "buffer_fill": len(bridge.buffer)}

if __name__ == "__main__":
    import uvicorn
    print("Skin-Port V12: METALOGICAL_BURN_ACTIVE [◦A]")
    uvicorn.run(app, host="0.0.0.0", port=8080)
