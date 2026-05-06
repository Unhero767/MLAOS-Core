import React, { useState, useEffect } from 'react';
import ResonanceGraph from './components/ResonanceGraph';

const Dashboard: React.FC = () => {
    const [streams, setStreams] = useState<Record<string, any[]>>({
        'Sentinel-01': [], 'Sentinel-02': [], 'Sentinel-03': []
    });
    const [isSqueezing, setIsSqueezing] = useState(false);

    useEffect(() => {
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/resonance');
        socket.onmessage = (event) => {
            const report = JSON.parse(event.data);
            const id = report.guardian;
            if (!id) return;

            if (report.signal === 'Dissonant') {
                setIsSqueezing(true);
                setTimeout(() => setIsSqueezing(false), 300);
            }

            setStreams(prev => ({
                ...prev,
                [id]: [{ ...report, timestamp: Date.now() }, ...(prev[id] || [])].slice(0, 15)
            }));
        };
        return () => socket.close();
    }, []);

    return (
        <div className={`min-h-screen bg-black text-cyan-400 font-mono p-8 transition-all duration-300 ${isSqueezing ? 'animate-squeeze border-red-900' : 'border-cyan-900'} border-8`}>
            <h1 className="text-2xl mb-8 tracking-[0.4em] uppercase border-b border-cyan-900 pb-2">Multi-Sentinel Array // Σ-7</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.keys(streams).map(guardian => (
                    <section key={guardian} className="border border-cyan-900 p-4 bg-gray-900/10">
                        <h2 className="text-yellow-600 mb-4 text-xs tracking-widest uppercase">{guardian}</h2>
                        <ResonanceGraph data={streams[guardian]} />
                        <div className="mt-4 space-y-1 opacity-50 text-[10px]">
                            {streams[guardian].slice(0, 3).map((log, i) => (
                                <div key={i} className={log.signal === 'Dissonant' ? 'text-red-500' : ''}>
                                    {log.signal} :: {log.resonance.toFixed(2)}
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};
export default Dashboard;
