import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * [◦A] MLAOS PHASE 16: SOVEREIGN MANIFOLD
 * Integrated Heliocentric Engine, Diurnal Logic, and Command Console.
 */
export const SovereignManifold: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // --- STATE BRIDGES ---
    const [speed, setSpeed] = useState(0.005);
    const [isLithic, setIsLithic] = useState(true);
    const [timeScale, setTimeScale] = useState(1); 
    const [luminosity, setLuminosity] = useState(10);
    const [manifoldWarp, setManifoldWarp] = useState(1);
    const [chromaDrift, setChromaDrift] = useState(0x00ff00);
    const [isPurging, setIsPurging] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const now = new Date();
        const sunFactor = -Math.cos(((now.getHours() + now.getMinutes()/60) / 24) * Math.PI * 2);
        scene.background = new THREE.Color(isPurging ? 0x050000 : (sunFactor < 0 ? 0x000002 : 0x001122));

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        containerRef.current.innerHTML = ''; 
        containerRef.current.appendChild(renderer.domElement);

        const worldGroup = new THREE.Group();
        scene.add(worldGroup);

        // --- CORE & PLANETS ---
        const sol = new THREE.Mesh(
            new THREE.IcosahedronGeometry(6, 4),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: chromaDrift, emissiveIntensity: luminosity, wireframe: isLithic })
        );
        worldGroup.add(sol);

        const planets = [
            { n: 'Mercury', d: 40, c: 0x888888, s: 0.04 },
            { n: 'Earth',   d: 110, c: 0x2233ff, s: 0.01 }, // Olney node
            { n: 'Jupiter', d: 220, c: 0xffa500, s: 0.004 }
        ];

        const planetMeshes: THREE.Mesh[] = [];
        planets.forEach(p => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(3,3,3), new THREE.MeshStandardMaterial({ color: p.c, emissive: p.c, emissiveIntensity: 1, wireframe: true }));
            (mesh as any).orbitDist = p.d; (mesh as any).orbitSpeed = p.s; (mesh as any).angle = Math.random() * Math.PI * 2;
            planetMeshes.push(mesh);
            worldGroup.add(mesh);
        });

        // --- ENVIRONMENT ---
        const starGeo = new THREE.BufferGeometry();
        const starV = [];
        for (let i = 0; i < 20000; i++) starV.push(THREE.MathUtils.randFloatSpread(5000), THREE.MathUtils.randFloatSpread(5000), THREE.MathUtils.randFloatSpread(5000));
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starV, 3));
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: isPurging ? 0xff0000 : 0xffffff, size: 2 })));
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        camera.position.set(0, 150, 400);
        camera.lookAt(0, 0, 0);

        // --- INTERACTION ---
        let isDragging = false; let pX = 0, pY = 0;
        renderer.domElement.onmousedown = () => isDragging = true;
        window.onmouseup = () => isDragging = false;
        window.onmousemove = (e) => { if (isDragging) { worldGroup.rotation.y += (e.clientX - pX) * 0.01; worldGroup.rotation.x += (e.clientY - pY) * 0.01; } pX = e.clientX; pY = e.clientY; };
        renderer.domElement.onwheel = (e) => { camera.position.z = Math.max(50, Math.min(camera.position.z + e.deltaY * 0.2, 2000)); };

        const animate = () => {
            const frameId = requestAnimationFrame(animate);
            sol.rotation.y += speed;
            sol.scale.setScalar(manifoldWarp);
            planetMeshes.forEach(p => {
                (p as any).angle += (p as any).orbitSpeed * timeScale;
                p.position.x = Math.cos((p as any).angle) * (p as any).orbitDist * manifoldWarp;
                p.position.z = Math.sin((p as any).angle) * (p as any).orbitDist * manifoldWarp;
            });
            renderer.render(scene, camera);
        };
        animate();

        return () => renderer.dispose();
    }, [speed, isLithic, timeScale, luminosity, manifoldWarp, chromaDrift, isPurging]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000', color: '#FFD700', fontFamily: 'monospace' }}>
            <div ref={containerRef} />
            <div style={{ position: 'absolute', top: 20, right: 20, width: '320px', padding: '20px', background: 'rgba(0,0,0,0.9)', border: '2px solid #FFD700', zIndex: 1000 }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>[Σ] COMMAND_DECK</h2>
                <input type="range" min="1" max="50" value={luminosity} onChange={(e) => setLuminosity(parseInt(e.target.value))} style={{ width: '100%' }} />
                <button onClick={() => setChromaDrift(Math.random() * 0xffffff)} style={{ width: '100%', marginTop: '10px' }}>CHROMATIC_DRIFT</button>
                <button onMouseDown={() => setIsPurging(true)} onMouseUp={() => setIsPurging(false)} style={{ width: '100%', marginTop: '10px', color: 'red' }}>EXECUTE_PURGE</button>
            </div>
        </div>
    );
};
