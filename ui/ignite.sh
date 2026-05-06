echo "Initiating MLAOS Dual-Manifold Ignition..."
:wq
:qw


python3 -m uvicorn src.core.broadcast_gateway:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Start Vite UI
cd ui && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
