import React, { useState, useEffect, useMemo } from 'react';
import ResonanceGraph from './components/ResonanceGraph';

const Dashboard: React.FC = () => {
    const [streams, setStreams] = useState<Record<string, any[]>>({
        'Sentinel-01': [], 'Sentinel-02': [], 'Sentinel-03': []
    });
    const [isSqueezing, setIsSqueezing] = useState(false);

    const aggregateResonance = useMemo(() => {
        const values = Object.values(streams).map(s => s[0]?.resonance || 1.0);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.min(((avg - 1) / 1.5) * 100, 100);
    }, [streams]);

    useEffect(() => {
        const socket = new WebSocket('ws://127.0.0.1:8000/ws/resonance');
        socket.onmessage = (event) => {
            const report = JSON.parse(event.data);
            if (report.signal === 'Dissonant') {
                setIsSqueezing(true);
                setTimeout(() => setIsSqueezing(false), 300);
            }
            setStreams(prev => ({
                ...prev,
                [report.guardian]: [{ ...report, timestamp: Date.now() }, ...(prev[report.guardian] || [])].slice(0, 20)
            }));
        };
        return () => socket.close();
    }, []);

    return (
        <div className={`min-h-screen bg-black text-cyan-400 font-mono p-8 overflow-hidden transition-all duration-300 ${isSqueezing ? 'animate-squeeze border-red-600' : 'border-cyan-900'} border-[12px]`}>
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]" />
            <div className="fixed inset-0 pointer-events-none z-50 animate-scan bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 w-full" />

            <header className="flex justify-between items-center border-b-2 border-cyan-900 pb-6 mb-10 relative z-10">
                <div>
                    <h1 className="text-3xl tracking-[0.6em] font-black uppercase text-cyan-400">Sovereign Interface // Σ-7</h1>
                    <p className="text-[10px] text-cyan-700 tracking-widest mt-2 uppercase">Core Dogma Verification // Multimodal Manifold</p>
                </div>
                <div className="w-80 flex flex-col items-end gap-2">
                    <div className="text-[9px] uppercase tracking-tighter">Aggregate Manifold Stress</div>
                    <div className="w-full h-3 border border-cyan-900 bg-gray-900 p-[2px]">
                        <div className="h-full bg-gradient-to-r from-cyan-500 via-yellow-500 to-red-600 transition-all duration-700" style={{ width: `${aggregateResonance}%` }} />
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                {Object.keys(streams).map(guardian => (
                    <section key={guardian} className="group border border-cyan-900 bg-black/40 p-6 relative hover:border-cyan-400 transition-colors">
                        <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-yellow-600 uppercase tracking-widest">Sector: {guardian}</div>
                        <ResonanceGraph data={streams[guardian]} />
                        <div className="mt-6 space-y-2">
                            {streams[guardian].slice(0, 4).map((log, i) => (
                                <div key={i} className={`flex justify-between text-[10px] border-b border-cyan-900/20 pb-1 ${log.signal === 'Dissonant' ? 'text-red-500 animate-pulse' : 'text-cyan-800'}`}>
                                    <span>{log.signal} @ {new Date(log.timestamp).toLocaleTimeString()}</span>
                                    <span className="font-bold">{log.resonance.toFixed(3)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default Dashboard;
