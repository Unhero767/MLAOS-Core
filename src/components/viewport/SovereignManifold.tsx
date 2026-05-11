import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

/**
 * [◦A] VOXELFORGE C2 - PHASE 17: PRIORITY CULL & DITHERING
 * Logic: 12-bit Focal resolution, 8-bit Distal collapse, Bayer-mask dithering.
 */

interface VoxelData { x: number; y: number; z: number; word: number; dist: number; }

export const SovereignManifold: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [voxelCountDisplay, setVoxelCountDisplay] = useState(0);
    const [focalRadius, setFocalRadius] = useState(150);
    
    const engineRefs = useRef<{
        scene?: THREE.Scene;
        camera?: THREE.PerspectiveCamera;
        worldGroup?: THREE.Group;
        activeMesh?: THREE.InstancedMesh;
    }>({});

    const shaderUniforms = useRef({
        uTime: { value: 0 },
        uFocalRadius: { value: focalRadius },
        uLightDir: { value: new THREE.Vector3(1, 2, 1).normalize() }
    });

    useEffect(() => { shaderUniforms.current.uFocalRadius.value = focalRadius; }, [focalRadius]);

    // 1. HARDENED RENDERER INIT
    useEffect(() => {
        if (!containerRef.current) return;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);
        engineRefs.current.scene = scene;
        
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(250, 250, 500);
        camera.lookAt(0, 0, 0);
        engineRefs.current.camera = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const sun = new THREE.DirectionalLight(0x8b5cf6, 1.0);
        sun.position.set(100, 200, 100);
        scene.add(sun);

        const worldGroup = new THREE.Group();
        scene.add(worldGroup);
        engineRefs.current.worldGroup = worldGroup;

        const animate = () => {
            const fId = requestAnimationFrame(animate);
            shaderUniforms.current.uTime.value = performance.now() / 1000;
            if (worldGroup) worldGroup.rotation.y += 0.001;
            renderer.render(scene, camera);
        };
        animate();

        return () => { renderer.forceContextLoss(); renderer.dispose(); };
    }, []);

    // 2. TRANSMUTATION WITH PRIORITY CULLING
    const executeTransmutation = useCallback(() => {
        const { worldGroup } = engineRefs.current;
        if (!worldGroup) return;

        while(worldGroup.children.length > 0){ 
            const obj = worldGroup.children[0] as any;
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            worldGroup.remove(obj); 
        }

        const parsedVoxels: VoxelData[] = [];
        const size = 18; 
        const offset = size / 2;
        const spacing = 12;

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const wx = (x - offset) * spacing;
                    const wy = (y - offset) * spacing;
                    const wz = (z - offset) * spacing;
                    const dist = Math.sqrt(wx*wx + wy*wy + wz*wz);
                    
                    if (Math.random() > 0.7) {
                        const isFocal = dist < focalRadius;
                        const occupancy = 0xFF << 24;
                        
                        // Bit-Depth Logic
                        let material, lexToken, albedo;
                        if (isFocal) {
                            material = (Math.floor(Math.random() * 255)) << 16;
                            lexToken = (Math.floor(Math.random() * 4095)) << 4; // 12-bit
                            albedo = Math.floor(Math.random() * 15);
                        } else {
                            material = (Math.floor(Math.random() * 127)) << 16;
                            lexToken = (Math.floor(Math.random() * 255)) << 4; // Collapsed to 8-bit
                            albedo = 0x1; // Neutral Grey for Distal
                        }

                        parsedVoxels.push({ x: wx, y: wy, z: wz, word: (occupancy | material | lexToken | albedo) >>> 0, dist });
                    }
                }
            }
        }

        const geometry = new THREE.BoxGeometry(spacing * 0.85, spacing * 0.85, spacing * 0.85);
        const material = new THREE.MeshStandardMaterial();

        material.onBeforeCompile = (shader) => {
            shader.uniforms.uLightDir = shaderUniforms.current.uLightDir;
            shader.uniforms.uFocalRadius = shaderUniforms.current.uFocalRadius;
            
            shader.vertexShader = `
                attribute float aVoxelWord;
                attribute float aDist;
                varying float vWord;
                varying float vDist;
                varying vec3 vNormalVec;
                ${shader.vertexShader}
            `.replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                 vWord = aVoxelWord;
                 vDist = aDist;
                 vNormalVec = normal;`
            );

            shader.fragmentShader = `
                varying float vWord;
                varying float vDist;
                varying vec3 vNormalVec;
                uniform vec3 uLightDir;
                uniform float uFocalRadius;

                // Bayer Matrix for Chromatic Dithering
                float dither(vec2 pos) {
                    int x = int(mod(pos.x, 4.0));
                    int y = int(mod(pos.y, 4.0));
                    float m[16] = float[](
                        0.0, 8.0, 2.0, 10.0,
                        12.0, 4.0, 14.0, 6.0,
                        3.0, 11.0, 1.0, 9.0,
                        15.0, 7.0, 13.0, 5.0
                    );
                    return m[y * 4 + x] / 16.0;
                }

                vec4 manifestCulledRadiance(uint word, vec3 normal, vec3 lightDir) {
                    uint occupancy = (word >> 24u) & 0xFFu;
                    if (occupancy == 0u) return vec4(0.0);

                    uint mat = (word >> 16u) & 0xFFu;
                    uint lex = (word >> 4u) & 0xFFFu;
                    
                    bool isDistal = vDist > uFocalRadius;
                    vec3 baseColor = isDistal ? vec3(0.5) : vec3(0.8, 0.6, 1.0);
                    
                    // Apply Dithering to Distal Cluster Banding
                    if (isDistal) {
                        float d = dither(gl_FragCoord.xy);
                        baseColor += (d - 0.5) * 0.15; 
                    }

                    float diffuse = max(dot(normalize(normal), normalize(lightDir)), 0.2);
                    return vec4(baseColor * diffuse * (float(mat)/255.0 + 0.5), 1.0);
                }

                ${shader.fragmentShader}
            `.replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>
                 gl_FragColor = manifestCulledRadiance(uint(vWord), vNormalVec, uLightDir);`
            );
        };

        const mesh = new THREE.InstancedMesh(geometry, material, parsedVoxels.length);
        const wordBuf = new Float32Array(parsedVoxels.length);
        const distBuf = new Float32Array(parsedVoxels.length);
        const dummy = new THREE.Matrix4();

        parsedVoxels.forEach((v, i) => {
            dummy.setPosition(v.x, v.y, v.z);
            mesh.setMatrixAt(i, dummy);
            wordBuf[i] = v.word;
            distBuf[i] = v.dist;
        });

        mesh.geometry.setAttribute('aVoxelWord', new THREE.InstancedBufferAttribute(wordBuf, 1));
        mesh.geometry.setAttribute('aDist', new THREE.InstancedBufferAttribute(distBuf, 1));
        worldGroup.add(mesh);
        setVoxelCountDisplay(parsedVoxels.length);
    }, [focalRadius]);

    useEffect(() => { executeTransmutation(); }, [executeTransmutation]);

    return (
        <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: 30, right: 30, width: '280px', background: 'rgba(22, 22, 35, 0.9)', border: '1px solid #8b5cf6', borderRadius: '12px', padding: '20px', color: '#f8f9fa', fontFamily: 'monospace' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#8b5cf6' }}>◆ SOVEREIGN AUDIT</h3>
                <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>FOCAL RADIUS</span>
                        <span>{focalRadius}v</span>
                    </div>
                    <input type="range" min="50" max="400" step="10" value={focalRadius} onChange={(e)=>setFocalRadius(parseInt(e.target.value))} style={{ width: '100%' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0f0' }}>
                    [◦A] STATUS: COMPLIANT<br/>
                    VECTORS: {voxelCountDisplay}<br/>
                    DITHER: ACTIVE (BAYER_4x4)
                </div>
            </div>
        </div>
    );
};
