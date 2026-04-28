import React, { useState, useEffect } from 'react';

type MagisterialSymbol = '◦A' | 'Ex∘' | 'Φ' | null;

const ResonancePulse: React.FC = () => {
  const [symbol, setSymbol] = useState<MagisterialSymbol>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Establish the Sovereign Stream
    const socket = new WebSocket('ws://localhost:8080/ws/resonance');

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.symbol) {
        setSymbol(data.symbol);
      }
    };

    return () => socket.close();
  }, []);

  const getFilter = () => {
    switch (symbol) {
      case 'Φ': return 'drop-shadow(0 0 25px #0055ff) contrast(120%)';
      case 'Ex∘': return 'contrast(300%) brightness(150%) drop-shadow(0 0 10px #ff0000) blur(1px)';
      case '◦A': return 'drop-shadow(0 0 8px #ffffff) brightness(1.2)';
      default: return 'grayscale(100%) opacity(0.3)';
    }
  };

  return (
    <div style={{ background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <div 
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.5)',
          filter: getFilter(),
          transition: 'all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
          transform: `scale(${symbol === 'Φ' ? 1.3 : 1})`,
          boxShadow: symbol === 'Ex∘' ? 'inset 0 0 50px #ff0000' : 'none'
        }}
      />
      <div style={{ marginTop: '50px', color: isConnected ? '#fff' : '#444', fontFamily: 'monospace', letterSpacing: '0.2rem' }}>
        {isConnected ? `STREAM_ACTIVE: ${symbol || 'AWAITING_PULSE'}` : 'LINK_BREACH: DISCONNECTED'}
      </div>
    </div>
  );
};

export default ResonancePulse;
