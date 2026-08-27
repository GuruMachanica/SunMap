import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export default function HouseCanvas({ mode = 'morning' }) {
  const canvasRef = useRef(null);
  const lightsRef = useRef({});
  const materialsRef = useRef({ emissives: [], solar: [] });
  const pointLightsRef = useRef([]);
  const houseContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const currentModeRef = useRef(mode);
  const isTransitioningRef = useRef(false);

  // Time Rig Preset Definitions
  const timePresets = {
    morning: {
      sunColor: '#FFE8D6',
      sunIntensity: 2.4,
      sunPos: [15, 10, 8],
      ambientColor: '#C2E0FF',
      ambientIntensity: 0.7,
      windowIntensity: 0.0,
      windowColor: '#ff9e3b',
      clearColor: 0x0e1626,
      solarIntensity: 0.25
    },
    afternoon: {
      sunColor: '#FFFDF0',
      sunIntensity: 3.2,
      sunPos: [2, 22, 10],
      ambientColor: '#E5F0FF',
      ambientIntensity: 1.1,
      windowIntensity: 0.0,
      windowColor: '#ff9e3b',
      clearColor: 0x0f1a2e,
      solarIntensity: 0.35
    },
    evening: {
      sunColor: '#FF7A29',
      sunIntensity: 2.6,
      sunPos: [-18, 4, 6],
      ambientColor: '#7B5294',
      ambientIntensity: 0.55,
      windowIntensity: 1.8,
      windowColor: '#FFAE42',
      clearColor: 0x180e22,
      solarIntensity: 0.15
    },
    night: {
      sunColor: '#4A6984',
      sunIntensity: 0.25,
      sunPos: [-8, 14, -8],
      ambientColor: '#0D1629',
      ambientIntensity: 0.12,
      windowIntensity: 3.4,
      windowColor: '#FF9F1C',
      clearColor: 0x050811,
      solarIntensity: 0.05
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    // 1. Scene & Ground Clipping Plane
    const scene = new THREE.Scene();
    const initialPreset = timePresets[mode] || timePresets.morning;
    scene.background = new THREE.Color(initialPreset.clearColor);

    // Ground clipping plane at Y: 0 to smoothly submerge model below earth
    const groundClipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02);

    // 2. Camera: Eye-level perspective
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9.0);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer with Local Clipping Enabled
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.localClippingEnabled = true;

    // 4. Clamped Interactive OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI / 3.8;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minAzimuthAngle = -Math.PI / 3.5;
    controls.maxAzimuthAngle = Math.PI / 3.5;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const sunLight = new THREE.DirectionalLight(
      initialPreset.sunColor,
      initialPreset.sunIntensity
    );
    sunLight.position.set(...initialPreset.sunPos);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    const d = 8;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(
      initialPreset.ambientColor,
      initialPreset.ambientIntensity
    );
    scene.add(ambientLight);

    lightsRef.current = { sunLight, ambientLight, scene, camera, renderer };

    // 6. Ground & Earth Base (Stays fixed while house submerges)
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x3d4a36,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(35, 35), lawnMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xc2c5c8,
      roughness: 0.7,
      metalness: 0.08
    });
    const driveway = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 8.0), concreteMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(-2.2, 0.005, 3.8);
    driveway.receiveShadow = true;
    scene.add(driveway);

    const walkway = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 5.0), concreteMat);
    walkway.rotation.x = -Math.PI / 2;
    walkway.position.set(2.4, 0.006, 2.5);
    walkway.receiveShadow = true;
    scene.add(walkway);

    // 7. Root houseContainer Group (Submerges & Rises from Earth)
    const houseContainer = new THREE.Group();
    houseContainer.position.set(0, 0, 0);
    scene.add(houseContainer);
    houseContainerRef.current = houseContainer;

    materialsRef.current.emissives = [];
    materialsRef.current.solar = [];
    pointLightsRef.current = [];

    // --- Architectural Materials with Clipping Enabled ---
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe2e5e8,
      roughness: 0.85,
      metalness: 0.02,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });

    const trimWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.5,
      metalness: 0.05,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x2a2e35,
      roughness: 0.35,
      metalness: 0.4,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });

    const solarGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.92,
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: initialPreset.solarIntensity,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });
    materialsRef.current.solar.push(solarGlassMat);

    const solarFrameMat = new THREE.MeshStandardMaterial({
      color: 0xbcc3ce,
      roughness: 0.2,
      metalness: 0.95,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });

    const windowGlassMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.05,
      metalness: 0.8,
      emissive: new THREE.Color(initialPreset.windowColor),
      emissiveIntensity: initialPreset.windowIntensity,
      transparent: true,
      opacity: 0.92,
      clippingPlanes: [groundClipPlane],
      clipShadows: true
    });
    materialsRef.current.emissives.push(windowGlassMat);

    // --- Construct Architecture inside houseContainer ---
    // A. Main Body
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(7.5, 2.2, 4.5), wallMat);
    mainBody.position.set(0, 1.1, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    houseContainer.add(mainBody);

    // B. Pitched Metal Roof (sloping forward toward camera)
    const roofTilt = Math.PI * (20 / 180);
    const frontRoof = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.08, 2.8), roofMat);
    frontRoof.position.set(0, 2.45, 0.95);
    frontRoof.rotation.x = roofTilt;
    frontRoof.castShadow = true;
    frontRoof.receiveShadow = true;
    houseContainer.add(frontRoof);

    const rearRoof = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.08, 2.8), roofMat);
    rearRoof.position.set(0, 2.45, -1.35);
    rearRoof.rotation.x = -roofTilt;
    rearRoof.castShadow = true;
    rearRoof.receiveShadow = true;
    houseContainer.add(rearRoof);

    const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.12, 0.16), roofMat);
    ridgeCap.position.set(0, 2.92, -0.2);
    houseContainer.add(ridgeCap);

    const frontFascia = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.12, 0.14), roofMat);
    frontFascia.position.set(0, 1.98, 2.28);
    houseContainer.add(frontFascia);

    // C. 2x6 Solar Array on Front Slope
    const rows = 2;
    const cols = 6;
    const pw = 0.85;
    const ph = 1.35;
    const gx = 0.08;
    const gy = 0.08;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -2.6 + c * (pw + gx);
        const offsetDown = (r - 0.5) * (ph + gy);

        const y = 2.45 - offsetDown * Math.sin(roofTilt) + 0.06;
        const z = 0.95 + offsetDown * Math.cos(roofTilt);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.03, ph), solarFrameMat);
        frame.position.set(x, y, z);
        frame.rotation.x = roofTilt;
        houseContainer.add(frame);

        const cell = new THREE.Mesh(new THREE.BoxGeometry(pw * 0.94, 0.032, ph * 0.94), solarGlassMat);
        cell.position.set(x, y + 0.005, z);
        cell.rotation.x = roofTilt;
        houseContainer.add(cell);
      }
    }

    // D. Garage
    const garageFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 0.06), trimWhiteMat);
    garageFrame.position.set(-2.2, 0.85, 2.28);
    houseContainer.add(garageFrame);

    for (let i = 0; i < 4; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.32, 0.03), trimWhiteMat);
      panel.position.set(-2.2, 0.25 + i * 0.38, 2.32);
      houseContainer.add(panel);
    }

    // E. Gabled Entrance Pavilion & French Doors
    const entranceBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 1.2), wallMat);
    entranceBody.position.set(2.4, 1.2, 2.5);
    entranceBody.castShadow = true;
    entranceBody.receiveShadow = true;
    houseContainer.add(entranceBody);

    const gableRoofL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), roofMat);
    gableRoofL.position.set(1.9, 2.65, 2.5);
    gableRoofL.rotation.z = Math.PI * (24 / 180);
    houseContainer.add(gableRoofL);

    const gableRoofR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), roofMat);
    gableRoofR.position.set(2.9, 2.65, 2.5);
    gableRoofR.rotation.z = -Math.PI * (24 / 180);
    houseContainer.add(gableRoofR);

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.65, 0.06), trimWhiteMat);
    doorFrame.position.set(2.4, 0.85, 3.12);
    houseContainer.add(doorFrame);

    const doorGlassL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.45, 0.04), windowGlassMat);
    doorGlassL.position.set(2.05, 0.85, 3.14);
    houseContainer.add(doorGlassL);

    const doorGlassR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.45, 0.04), windowGlassMat);
    doorGlassR.position.set(2.75, 0.85, 3.14);
    houseContainer.add(doorGlassR);

    // F. Windows & Interior PointLights
    for (let i = 0; i < 4; i++) {
      const wx = -0.6 + i * 0.75;
      const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.35, 0.06), trimWhiteMat);
      wFrame.position.set(wx, 1.05, 2.27);
      houseContainer.add(wFrame);

      const wGlass = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.25, 0.04), windowGlassMat);
      wGlass.position.set(wx, 1.05, 2.29);
      houseContainer.add(wGlass);

      const pLight = new THREE.PointLight(initialPreset.windowColor, initialPreset.windowIntensity, 4.0, 1.2);
      pLight.position.set(wx, 1.05, 1.9);
      houseContainer.add(pLight);
      pointLightsRef.current.push(pLight);
    }

    const doorPointLight = new THREE.PointLight(initialPreset.windowColor, initialPreset.windowIntensity, 5.0, 1.2);
    doorPointLight.position.set(2.4, 1.0, 2.7);
    houseContainer.add(doorPointLight);
    pointLightsRef.current.push(doorPointLight);

    // Resize Handler
    const handleResize = () => {
      const newW = canvas.clientWidth || window.innerWidth;
      const newH = canvas.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // 8. Chained GSAP Timeline: Cinematic "Rise from Earth" Transition
  useEffect(() => {
    if (mode === currentModeRef.current) return;
    currentModeRef.current = mode;

    const house = houseContainerRef.current;
    const controls = controlsRef.current;
    const { sunLight, ambientLight, scene, camera } = lightsRef.current;
    if (!house || !sunLight || !ambientLight) return;

    const targetPreset = timePresets[mode] || timePresets.morning;

    // Lock controls during transition to prevent camera jitter
    if (controls) controls.enabled = false;
    isTransitioningRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        if (controls) controls.enabled = true;
        isTransitioningRef.current = false;
      }
    });

    // Phase A: Submerge into Earth (0.45s)
    tl.to(house.position, {
      y: -3.8,
      duration: 0.45,
      ease: 'power2.in'
    });

    // Camera subtle pullback
    tl.to(camera.position, {
      z: 9.3,
      duration: 0.45,
      ease: 'power2.in'
    }, '<');

    // Phase B: Instant Stage Swap at bottom (Y: -3.8)
    tl.call(() => {
      // Set Sun Light
      sunLight.color.set(targetPreset.sunColor);
      sunLight.intensity = targetPreset.sunIntensity;
      sunLight.position.set(...targetPreset.sunPos);

      // Set Ambient Light
      ambientLight.color.set(targetPreset.ambientColor);
      ambientLight.intensity = targetPreset.ambientIntensity;

      // Set Window Glow
      materialsRef.current.emissives.forEach((mat) => {
        mat.emissive.set(targetPreset.windowColor);
        mat.emissiveIntensity = targetPreset.windowIntensity;
      });

      pointLightsRef.current.forEach((pLight) => {
        pLight.color.set(targetPreset.windowColor);
        pLight.intensity = targetPreset.windowIntensity;
      });

      materialsRef.current.solar.forEach((mat) => {
        mat.emissiveIntensity = targetPreset.solarIntensity;
      });

      // Clear Color
      if (scene && scene.background) {
        scene.background.set(targetPreset.clearColor);
      }
    });

    // Phase C: Rise from Earth with Spring Overshoot (0.8s)
    tl.to(house.position, {
      y: 0.0,
      duration: 0.8,
      ease: 'power3.out'
    });

    tl.to(camera.position, {
      z: 9.0,
      duration: 0.8,
      ease: 'power3.out'
    }, '<');

  }, [mode]);

  return (
    <canvas
      id="bg-canvas"
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto',
        display: 'block'
      }}
    />
  );
}
