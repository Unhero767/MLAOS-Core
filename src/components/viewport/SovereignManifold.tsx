import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const SovereignManifold: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // --- SOVEREIGN STATE (PERSISTENT) ---
    const [speed, setSpeed] = useState(0.005);
    const [shapeMod, setShapeMod] = useState(0); 
    const [isLithic, setIsLithic] = useState(false);
    const [timeScale, setTimeScale] = useState(1);
    const [luminosity, setLuminosity] = useState(15);
    const [warp, setWarp] = useState(1);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. CORE PHYSICS & VIEWPORT ---
        const scene = new THREE.Scene();
        const now = new Date();
        const sunFactor = -Math.cos(((now.getHours() + now.getMinutes()/60) / 24) * Math.PI * 2);
        scene.background = new THREE.Color(sunFactor < 0 ? 0x000002 : 0x00050a);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        
        containerRef.current.innerHTML = ''; 
        containerRef.current.appendChild(renderer.domElement);

        const worldGroup = new THREE.Group();
        scene.add(worldGroup);

        // --- 2. PROCEDURAL TEXTURE FORGE ---
        const getTex = (c1: string, c2: string) => {
            const canv = document.createElement('canvas'); canv.width = 256; canv.height = 256;
            const ctx = canv.getContext('2d')!;
            const g = ctx.createLinearGradient(0, 0, 256, 256);
            g.addColorStop(0, c1); g.addColorStop(1, c2);
            ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
            for(let i=0; i<30; i++) { ctx.fillStyle="rgba(255,255,255,0.05)"; ctx.beginPath(); ctx.arc(Math.random()*256, Math.random()*256, Math.random()*30, 0, Math.PI*2); ctx.fill(); }
            return new THREE.CanvasTexture(canv);
        };

        // --- 3. THE CORE (SOL/LAOS) ---
        const solGeo = new THREE.IcosahedronGeometry(6, Math.floor(shapeMod * 4));
        const solMat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, emissive: 0x00ff00, emissiveIntensity: luminosity, wireframe: isLithic 
        });
        const sol = new THREE.Mesh(solGeo, solMat);
        sol.castShadow = true; worldGroup.add(sol);

        // --- 4. PLANETARY ANCHORS (TEXTURED) ---
        const pData = [
            { n: 'Mercury', d: 40,  s: 0.04,  c1: '#444', c2: '#777', sz: 1.5 },
            { n: 'Venus',   d: 70,  s: 0.015, c1: '#e6a', c2: '#842', sz: 2.5 },
            { n: 'Earth',   d: 110, s: 0.01,  c1: '#002', c2: '#24f', sz: 3.0 }, // Olney node
            { n: 'Mars',    d: 160, s: 0.008, c1: '#611', c2: '#f30', sz: 2.0 },
            { n: 'Jupiter', d: 250, s: 0.004, c1: '#a64', c2: '#f96', sz: 6.0 }
        ];

        const planetMeshes: THREE.Mesh[] = [];
        pData.forEach(p => {
            const mat = new THREE.MeshStandardMaterial({ map: isLithic ? null : getTex(p.c1, p.c2), wireframe: isLithic });
            const m = new THREE.Mesh(new THREE.SphereGeometry(p.sz, 32, 32), mat);
            m.castShadow = true; m.receiveShadow = true;
            (m as any).orbitDist = p.d; (m as any).orbitSpeed = p.s; (m as any).angle = Math.random()*Math.PI*2;
            planetMeshes.push(m); worldGroup.add(m);
        });

        // --- 5. LIGHTING, STARS & INTERACTION ---
        const sunLight = new THREE.PointLight(0xffffff, luminosity/2, 2000);
        scene.add(sunLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));

        const starGeo = new THREE.BufferGeometry();
        const starV = [];
        for(let i=0; i<20000; i++) starV.push(THREE.MathUtils.randFloatSpread(6000), THREE.MathUtils.randFloatSpread(6000), THREE.MathUtils.randFloatSpread(6000));
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starV, 3));
        const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2 }));
        scene.add(stars);

        camera.position.set(0, 200, 500); camera.lookAt(0,0,0);

        let isDrag = false; let pX = 0, pY = 0;
        renderer.domElement.onmousedown = () => isDrag = true;
        window.onmouseup = () => isDrag = false;
        window.onmousemove = (e) => { if(isDrag) { worldGroup.rotation.y += (e.clientX-pX)*0.01; worldGroup.rotation.x += (e.clientY-pY)*0.01; } pX=e.clientX; pY=e.clientY; };
        renderer.domElement.onwheel = (e) => { camera.position.z = Math.max(50, Math.min(camera.position.z + e.deltaY*0.2, 3000)); };

        const animate = () => {
            const fId = requestAnimationFrame(animate);
            sol.rotation.y += speed;
            planetMeshes.forEach(p => {
                (p as any).angle += (p as any).orbitSpeed * timeScale;
                p.position.x = Math.cos((p as any).angle) * (p as any).orbitDist * warp;
                p.position.z = Math.sin((p as any).angle) * (p as any).orbitDist * warp;
            });
            renderer.render(scene, camera);
        };
        animate();

        return () => renderer.dispose();
    }, [speed, shapeMod, isLithic, timeScale, luminosity, warp]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000' }}>
            <div ref={containerRef} style={{ cursor: 'grab' }} />
            <div style={{ position: 'absolute', top: 20, right: 20, width: '320px', padding: '20px', background: 'rgba(0,0,0,0.95)', border: '2px solid #FFD700', color: '#FFD700', fontFamily: 'monospace', zIndex: 1000 }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>[Σ] MAGISTERIAL_DECK</h2>
                <div style={{ marginBottom: '10px' }}><label>LUMENS</label><input type="range" min="1" max="50" value={luminosity} onChange={(e)=>setLuminosity(parseInt(e.target.value))} style={{ width: '100%' }} /></div>
                <div style={{ marginBottom: '10px' }}><label>WARP</label><input type="range" min="0.5" max="3" step="0.1" value={warp} onChange={(e)=>setWarp(parseFloat(e.target.value))} style={{ width: '100%' }} /></div>
                <div style={{ marginBottom: '10px' }}><label>MORPH</label><input type="range" min="0" max="1" step="0.1" value={shapeMod} onChange={(e)=>setShapeMod(parseFloat(e.target.value))} style={{ width: '100%' }} /></div>
                <button onClick={()=>setIsLithic(!isLithic)} style={{ width: '100%', padding: '10px', background: isLithic ? '#FFD700' : 'transparent', color: isLithic ? '#000' : '#FFD700', border: '1px solid #FFD700', fontWeight: 'bold' }}>
                    {isLithic ? "MANIFEST_TEXTURES" : "RESTORE_WIRE"}
                </button>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#00ff00', fontFamily: 'monospace', pointerEvents: 'none' }}>
                [◦A] SOVEREIGN: {new Date().toLocaleTimeString()}<br/>
                DOMAIN: OLNEY_MERIDIAN | PHASE: 16 [INVIOLATE]
            </div>
        </div>
    );
};
