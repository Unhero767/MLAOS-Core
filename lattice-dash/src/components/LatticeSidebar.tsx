import React, { useState, useEffect } from 'react';
import HistoryEcho from './HistoryEcho';

interface Archetype {
  name: string;
  action: string;
  me: string;
}

interface Echo {
  symbol: string;
  me: string;
  time: string;
}

interface Props {
  archetype: Archetype | null;
}

const LatticeSidebar: React.FC<Props> = ({ archetype }) => {
  const [history, setHistory] = useState<Echo[]>([]);

  // Fetch echoes from the Scribe when the archetype shifts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8080/history');
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        // Silence in the archive
      }
    };
    fetchHistory();
  }, [archetype]);

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      borderRight: '1px solid #222',
      background: '#050505',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      overflow: 'hidden'
    }}>
      <section style={{ marginBottom: '60px' }}>
        <div style={{ fontSize: '0.7rem', color: '#333', marginBottom: '10px' }}>
          [Σ-7] CURRENT_VIBRATION
        </div>
        <div style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '2px', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          {archetype?.me || 'ME_NULL'}
        </div>
        <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#00ff00', opacity: 0.8 }}>
          {archetype?.name || 'AWAITING_SOMA'}
        </div>
      </section>

      <section style={{ flexGrow: 1 }}>
        <div style={{ fontSize: '0.6rem', color: '#222', marginBottom: '20px', letterSpacing: '1px' }}>
          HISTORY_ECHOES
        </div>
        <div className="history-stack">
          {history.map((echo, index) => (
            <HistoryEcho 
              key={index} 
              symbol={echo.symbol} 
              me={echo.me} 
              timestamp={echo.time} 
            />
          ))}
        </div>
      </section>

      <section style={{ borderTop: '1px solid #111', paddingTop: '20px' }}>
        <div style={{ fontSize: '0.6rem', color: '#333' }}>SOVEREIGN_ACTION:</div>
        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{archetype?.action || 'IDLE'}</div>
      </section>
    </div>
  );
};

export default LatticeSidebar;
