#!/bin/bash
echo "--- [Σ-7] Initiating Dual-Manifold Ignition ---"

# Kill lingering ghosts
lsof -ti:3000,8000 | xargs kill -9 2>/dev/null

# Ignite Backend
echo "[1/2] Materializing Logic Gateway..."
python3 -m uvicorn src.core.broadcast_gateway:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Ignite Frontend
echo "[2/2] Materializing Sovereign UI..."
cd ui && npm run dev &
FRONTEND_PID=$!

# Structural Protection
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
