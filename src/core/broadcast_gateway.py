import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List
from .database import log_event, init_db

app = FastAPI()

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
    print("--- [Σ-7] Port 8000: Gateway & Stone Integrated ---")

@app.websocket("/ws/resonance")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/resonance")
async def post_resonance(report: dict):
    await log_event(
        report.get("guardian"), 
        report.get("signal"), 
        report.get("resonance"), 
        report.get("status")
    )
    await manager.broadcast(report)
    return {"status": "fossilized_on_8000"}
