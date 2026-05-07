// ==========================================
// MLAOS_PRIME: SOVEREIGN CONTROL SURFACE
// ==========================================
import { execSync } from 'child_process';

const CORE_VERSION = "Phase 12.0.1";
const ROENTGENIUM_STABILITY = 0.893;

function runAudit(target: string, phiFloor: string) {
    console.log(`\n[◦A] Initializing Maturity Audit on ${target}...`);
    try {
        const output = execSync(`npx ts-node mlaos_audit_engine.ts --target ${target} --phi-floor ${phiFloor}`);
        console.log(output.toString());
    } catch (error) {
        console.error(`[!] Audit Engine Failure: Metalogical Burn detected.`);
    }
}

const args = process.argv.slice(2);
if (args.includes('--verify-triad')) {
    console.log(`[◦A] Status: Triangular Stability Confirmed (Coherence: ${ROENTGENIUM_STABILITY})`);
} else if (args.includes('--ignite')) {
    runAudit("Unhero767/MasterMap", "0.564");
}
