from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List
from .database import log_event, init_db

app = FastAPI()

# Living Stream: Track active UI connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.websocket("/ws/resonance")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/resonance")
async def post_resonance(report: dict):
    # Fossilize in DB
    await log_event(
        report.get("guardian"), 
        report.get("signal"), 
        report.get("resonance"), 
        report.get("status")
    )
    # Broadcast to UI in real-time
    await manager.broadcast(report)
    return {"status": "fossilized_and_streamed"}
