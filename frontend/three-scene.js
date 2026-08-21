/**
 * three-scene.js
 * Interactive Three.js scene mounted behind the EcoLife dashboard.
 *
 * Renders:
 *   • A low-poly Earth sphere with continent-like patches and soft clouds
 *   • A glowing atmosphere shell
 *   • Drifting leaf / particle field
 *   • Subtle mouse-driven parallax camera
 *
 * Depends on the importmap defined in index.html.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function initThreeScene({ canvas, prefersReducedMotion = false } = {}) {
    if (!canvas) {
        console.warn('[three-scene] No canvas provided — skipping.');
        return null;
    }

    // -------------------------------------------------------------
    // Renderer
    // -------------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    // -------------------------------------------------------------
    // Scene + Camera
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 0.4, 8);
    camera.lookAt(0, 0, 0);

    // -------------------------------------------------------------
    // Lighting + Environment (procedural, no external HDR file)
    // -------------------------------------------------------------
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x06b6d4, 0.7);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x84cc16, 0.5);
    rimLight.position.set(-3, 3, -4);
    scene.add(rimLight);

    // -------------------------------------------------------------
    // Earth — low-poly sphere with stylized continents
    // -------------------------------------------------------------
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthGeo = new THREE.IcosahedronGeometry(1.5, 4);
    const earthMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8, // ocean blue
        roughness: 0.55,
        metalness: 0.15,
        flatShading: true,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);

    // Continent patches — irregular displaced "land" blobs
    const continentsGroup = new THREE.Group();
    const continentMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.85,
        metalness: 0,
        flatShading: true,
    });
    const continentAccent = new THREE.MeshStandardMaterial({
        color: 0x84cc16,
        roughness: 0.8,
        metalness: 0,
        flatShading: true,
    });

    const continentSeeds = [
        { lat: 0.4, lon: 0.6, scale: 0.7 },
        { lat: -0.5, lon: -0.4, scale: 0.6 },
        { lat: 0.9, lon: -1.1, scale: 0.45 },
        { lat: -1.0, lon: 1.4, scale: 0.55 },
        { lat: 0.2, lon: -0.1, scale: 0.35 },
        { lat: 0.7, lon: 1.9, scale: 0.4 },
    ];
    continentSeeds.forEach((seed, i) => {
        const r = 1.52;
        const phi = Math.acos(seed.lat);
        const theta = seed.lon;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        const geo = new THREE.SphereGeometry(0.45 * seed.scale, 7, 6);
        const mesh = new THREE.Mesh(
            geo,
            i % 2 === 0 ? continentMat : continentAccent
        );
        mesh.position.set(x, y, z);
        // Slightly push outward along the normal so they sit on the surface
        const normal = new THREE.Vector3(x, y, z).normalize();
        mesh.position.add(normal.multiplyScalar(0.05));
        continentsGroup.add(mesh);
    });
    earthGroup.add(continentsGroup);

    // Atmosphere — soft glow shell
    const atmosphereGeo = new THREE.IcosahedronGeometry(1.65, 4);
    const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphere);

    // Outer halo
    const haloGeo = new THREE.IcosahedronGeometry(1.9, 3);
    const haloMat = new THREE.MeshBasicMaterial({
        color: 0x84cc16,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide,
        depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    earthGroup.add(halo);

    // Position earth to the right side of the page
    earthGroup.position.set(2.6, -0.2, 0);

    // -------------------------------------------------------------
    // Floating leaves / particles
    // -------------------------------------------------------------
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
        new THREE.Color(0x16a34a),
        new THREE.Color(0x84cc16),
        new THREE.Color(0x0d9488),
        new THREE.Color(0x06b6d4),
        new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 16;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 8 - 1;

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;

        sizes[i] = 0.04 + Math.random() * 0.07;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // Orbiting accent rings
    // -------------------------------------------------------------
    const ringGeo = new THREE.TorusGeometry(2.2, 0.01, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x16a34a,
        transparent: true,
        opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    earthGroup.add(ring);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.6, 0.008, 16, 120),
        new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.25,
        })
    );
    ring2.rotation.x = Math.PI / 2.2;
    ring2.rotation.z = Math.PI / 6;
    earthGroup.add(ring2);

    // -------------------------------------------------------------
    // Mouse parallax
    // -------------------------------------------------------------
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function onPointerMove(e) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        target.x = x * 0.6;
        target.y = -y * 0.4;
    }
    window.addEventListener('pointermove', onPointerMove);

    // -------------------------------------------------------------
    // Resize handling
    // -------------------------------------------------------------
    function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // -------------------------------------------------------------
    // Animation loop
    // -------------------------------------------------------------
    const startTime = performance.now() / 1000;
    let rafId = 0;
    let running = true;

    function animate() {
        if (!running) return;
        rafId = requestAnimationFrame(animate);

        const t = performance.now() / 1000 - startTime;

        // Smooth parallax
        current.x += (target.x - current.x) * 0.04;
        current.y += (target.y - current.y) * 0.04;

        if (!prefersReducedMotion) {
            earth.rotation.y += 0.0025;
            continentsGroup.rotation.y += 0.0025;
            earthGroup.rotation.y = current.x * 0.3;
            earthGroup.rotation.x = current.y * 0.15;

            ring.rotation.z += 0.0008;
            ring2.rotation.z -= 0.0006;

            // Drifting particles
            const pos = particleGeo.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                pos[i3 + 1] -= 0.0035; // slow downward drift
                pos[i3] += Math.sin(t + i) * 0.0015; // gentle horizontal sway
                if (pos[i3 + 1] < -5) {
                    pos[i3 + 1] = 5;
                    pos[i3] = (Math.random() - 0.5) * 16;
                }
            }
            particleGeo.attributes.position.needsUpdate = true;
        }

        camera.position.x = current.x * 0.5;
        camera.position.y = 0.4 + current.y * 0.3;
        camera.lookAt(earthGroup.position);

        renderer.render(scene, camera);
    }
    animate();

    // Pause when tab is hidden
    function onVisibilityChange() {
        if (document.hidden) {
            running = false;
            cancelAnimationFrame(rafId);
        } else if (!running) {
            running = true;
            animate();
        }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // -------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------
    function dispose() {
        running = false;
        cancelAnimationFrame(rafId);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        earthGeo.dispose();
        earthMat.dispose();
        continentsGroup.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) o.material.dispose();
        });
        continentMat.dispose();
        continentAccent.dispose();
        atmosphereGeo.dispose();
        atmosphereMat.dispose();
        haloGeo.dispose();
        haloMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        renderer.dispose();
    }

    return { dispose, renderer, scene, camera };
}

// Auto-mount when imported as a standalone module.
const canvas = document.getElementById('bg-3d-canvas');
if (canvas) {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Wait for the DOM to settle so the canvas has a real size.
    const mount = () => initThreeScene({ canvas, prefersReducedMotion });
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
        mount();
    }
}
