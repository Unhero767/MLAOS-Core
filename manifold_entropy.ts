// ==========================================
// THE GLITCH-WASTE ENTROPY FIELD
// ==========================================

interface UnformedVoxel {
    position: { x: number, y: number, z: number };
    velocity: { x: number, y: number, z: number };
    drift: number;
    driftSpeed: number;
    entropyLevel: number; // Represents alpha/opacity (δ)
    isCrystallized: boolean;
}

class EntropyField {
    private ghosts: UnformedVoxel[] = [];
    private readonly MANIFOLD_CEILING = 100;
    private readonly T0_FLOOR = -10;

    constructor(particleCount: number) {
        for (let i = 0; i < particleCount; i++) {
            this.ghosts.push(this.spawnGhost());
        }
    }

    private spawnGhost(): UnformedVoxel {
        return {
            position: { 
                x: (Math.random() - 0.5) * 64, // 32x32 manifold spread
                y: this.T0_FLOOR, 
                z: (Math.random() - 0.5) * 64 
            },
            velocity: { 
                x: 0, 
                y: 0.05 + Math.random() * 0.1, // Upward heat dissipation
                z: 0 
            },
            drift: Math.random() * Math.PI * 2,
            driftSpeed: 0.003 + Math.random() * 0.005,
            entropyLevel: 0.1 + Math.random() * 0.3,
            isCrystallized: false // Default to Non-equilibrium
        };
    }

    public processLogicStorm() {
        this.ghosts.forEach(ghost => {
            if (ghost.isCrystallized) return;
            ghost.drift += ghost.driftSpeed;
            ghost.position.x += Math.sin(ghost.drift) * 0.15;
            ghost.position.y += ghost.velocity.y;
            ghost.position.z += Math.cos(ghost.drift) * 0.15;

            if (ghost.position.y > this.MANIFOLD_CEILING) {
                Object.assign(ghost, this.spawnGhost());
            }
        });
    }
}

// ==========================================
// IGNITION SEQUENCE
// ==========================================

console.log("\n[Σ-7] Initializing Volumetric Entropy Field at T_0...");
const field = new EntropyField(65);

console.log("[Σ-7] Spawning 65 Unformed Voxels (δ-variants)...");
console.log("[Σ-7] Applying Paraconsistent Pressure.");

// Simulate one frame of the background loop
field.processLogicStorm();

console.log("\n[◦A] MANIFOLD SECURED: Glitch-Waste simulation active.");
console.log("[◦A] Awaiting Phase Transition trigger to crystallize Croma Prime.\n");
