import React, { useState } from 'react';
import ResonanceGraph from './components/ResonanceGraph';

const Dashboard: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const fetchAudit = () => {
        const isHarmonic = Math.random() > 0.3;
        const report = { signal: isHarmonic ? 'Harmonic' : 'Dissonant', resonance: isHarmonic ? 1.0 : 1.5, timestamp: Date.now() };
        setLogs(prev => [report, ...prev].slice(0, 10));
    };
    return (
        <div className="min-h-screen bg-black text-cyan-400 font-mono p-8 border-4 border-cyan-900">
            <h1 className="text-2xl mb-4">SOVEREIGN INTERFACE // Σ-7</h1>
            <ResonanceGraph data={logs} />
            <button onClick={fetchAudit} className="mt-4 px-4 py-2 border border-cyan-400 hover:bg-cyan-400 hover:text-black">INITIATE AUDIT</button>
        </div>
    );
};
export default Dashboard;
