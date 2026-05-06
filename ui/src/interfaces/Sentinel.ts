export interface AuditReport {
    signal: 'Harmonic' | 'Dissonant';
    guardian: string;
    action: string;
    timestamp: string;
    resonance: number;
}
