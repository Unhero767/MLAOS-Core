import React from 'react';

interface EchoProps {
  symbol: string;
  me: string;
  timestamp: string;
}

const HistoryEcho: React.FC<EchoProps> = ({ symbol, me, timestamp }) => {
  const shortTime = new Date(timestamp).toLocaleTimeString([], { hour12: false });
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
      opacity: 0.4,
      filter: 'grayscale(100%)',
      borderLeft: '2px solid #333',
      paddingLeft: '10px',
      fontSize: '0.7rem',
      fontFamily: 'monospace'
    }}>
      <span style={{ color: '#fff', marginRight: '10px' }}>[{symbol}]</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#888' }}>{me}</span>
        <span style={{ color: '#444', fontSize: '0.6rem' }}>{shortTime}</span>
      </div>
    </div>
  );
};

export default HistoryEcho;
