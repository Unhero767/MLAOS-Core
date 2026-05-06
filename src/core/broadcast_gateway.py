from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List
# Relative import to prevent ModuleNotFoundError
from .database import log_event, init_db

app = FastAPI()

class ResonanceReport(BaseModel):
    signal: str
    resonance: float
    guardian: str
    status: str

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.post("/resonance")
async def post_resonance(report: ResonanceReport):
    await log_event(report.guardian, report.signal, report.resonance, report.status)
    return {"status": "fossilized"}
