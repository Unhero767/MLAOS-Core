import React, { useState, useEffect } from 'react';
import ResonanceGraph from './components/ResonanceGraph';

const Dashboard: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [isSqueezing, setIsSqueezing] = useState(false);

    const performAudit = () => {
        const isHarmonic = Math.random() > 0.2;
        const resonanceValue = isHarmonic ? 1.0 : 1.5 + Math.random();
        
        if (!isHarmonic) {
            setIsSqueezing(true);
            setTimeout(() => setIsSqueezing(false), 400); // Duration of the shake
        }

        const report = { 
            signal: isHarmonic ? 'Harmonic' : 'Dissonant', 
            resonance: resonanceValue, 
            timestamp: Date.now() 
        };
        setLogs(prev => [report, ...prev].slice(0, 20));
    };

    // Phase 14 Automation: The Sovereign Pulsar
    useEffect(() => {
        const interval = setInterval(performAudit, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`min-h-screen bg-black text-cyan-400 font-mono p-8 transition-colors duration-500 ${isSqueezing ? 'animate-squeeze border-red-600' : 'border-cyan-900'} border-4`}>
            <header className="flex justify-between items-center border-b border-cyan-800 pb-4 mb-8">
                <h1 className="text-2xl tracking-[0.2em] uppercase">Sovereign Interface // Σ-7</h1>
                <div className={`px-4 py-1 border ${isSqueezing ? 'text-red-500 border-red-500 shadow-[0_0_15px_red]' : 'text-cyan-400 border-cyan-400'}`}>
                    {isSqueezing ? 'SQUEEZE ACTIVE' : 'SYSTEM: ◦A'}
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 border border-cyan-900 p-6 bg-gray-900/10">
                    <h2 className="text-yellow-500 mb-4 text-xs tracking-widest uppercase">Resonance Stream (Auto-Auditing)</h2>
                    <ResonanceGraph data={logs} />
                </section>

                <section className="border border-cyan-900 p-6 bg-black/40">
                    <h2 className="text-cyan-700 mb-4 text-xs uppercase">Audit Log</h2>
                    <div className="h-64 overflow-y-hidden space-y-2 opacity-80">
                        {logs.map((log, i) => (
                            <div key={i} className={`text-[10px] border-l-2 pl-2 ${log.signal === 'Harmonic' ? 'border-cyan-800' : 'border-red-600 text-red-400'}`}>
                                [{new Date(log.timestamp).toLocaleTimeString()}] {log.signal} @ {log.resonance.toFixed(2)}
                            </div>
                        ))}
                    </div>
                    <button onClick={performAudit} className="w-full mt-6 py-2 border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all uppercase text-xs">
                        Manual Overdrive
                    </button>
                </section>
            </main>
        </div>
    );
};
export default Dashboard;
