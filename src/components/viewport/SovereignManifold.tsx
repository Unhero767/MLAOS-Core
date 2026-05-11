import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * [◦A] VOXELFORGE DIAGNOSTIC BEDROCK
 * Absolute minimum viable manifold to isolate the White Screen logic fracture.
 */

export const SovereignManifold: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [systemStatus, setSystemStatus] = useState<string>("Initializing Lithic Engine...");

    useEffect(() => {
        if (!containerRef.current) return;

        let frameId: number;

        try {
            // 1. CORE RENDERER
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0f); // Dark background

            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 100);

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            containerRef.current.innerHTML = ''; // Clear existing
            containerRef.current.appendChild(renderer.domElement);

            // 2. BASIC PHOTOMETRICS
            scene.add(new THREE.AmbientLight(0xffffff, 0.4));
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(20, 50, 20);
            scene.add(light);

            // 3. SAFE INSTANCING (No Bitwise Operations)
            const VECTORS = 1000;
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const mesh = new THREE.InstancedMesh(geometry, material, VECTORS);

            const dummy = new THREE.Matrix4();
            const color = new THREE.Color();

            for (let i = 0; i < VECTORS; i++) {
                dummy.setPosition(
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60
                );
                mesh.setMatrixAt(i, dummy);
                
                color.setHSL(Math.random(), 0.8, 0.5);
                mesh.setColorAt(i, color);
            }

            mesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
            scene.add(mesh);

            setSystemStatus(`[◦A] CORE STABLE: ${VECTORS} Vectors Active.`);

            // 4. ANIMATION LOOP
            const animate = () => {
                frameId = requestAnimationFrame(animate);
                mesh.rotation.y += 0.005;
                mesh.rotation.x += 0.002;
                renderer.render(scene, camera);
            };
            animate();

        } catch (error: any) {
            // Catch the White Screen Fracture and display it
            setSystemStatus(`[Ex∘] CRITICAL FRACTURE: ${error.message}`);
        }

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#ffffff' }}>
            {/* If Three.js crashes, the background defaults to white, but our error text will show */}
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            
            <div style={{ 
                position: 'absolute', 
                top: 20, 
                left: 20, 
                background: 'rgba(10,10,15,0.9)', 
                color: systemStatus.includes('CRITICAL') ? '#ff4444' : '#10b981', 
                padding: '15px', 
                borderRadius: '8px', 
                fontFamily: 'monospace',
                border: `1px solid ${systemStatus.includes('CRITICAL') ? '#ff4444' : '#10b981'}`,
                zIndex: 9999
            }}>
                {systemStatus}
            </div>
        </div>
    );
};
