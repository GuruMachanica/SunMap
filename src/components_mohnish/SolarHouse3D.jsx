import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SolarHouse3D({ timeMode = 'morning' }) {
  const mountRef = useRef(null);
  const sceneObjectsRef = useRef({});

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.015);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 18, 52);
    camera.lookAt(0, 4, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    currentMount.appendChild(renderer.domElement);

    // 3. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    sunLight.position.set(-25, 30, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    const shadowSize = 35;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Hemisphere light for natural sky/ground bounce
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x334155, 0.8);
    scene.add(hemiLight);

    // Visual Sun Orb in distance
    const sunOrbGeom = new THREE.SphereGeometry(2.5, 32, 32);
    const sunOrbMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    const sunOrb = new THREE.Mesh(sunOrbGeom, sunOrbMat);
    scene.add(sunOrb);

    // 4. Ground Terrain & Driveway
    const groundGeom = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // Lawn / Grass Area
    const lawnGeom = new THREE.PlaneGeometry(48, 36);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.9,
      metalness: 0.05
    });
    const lawn = new THREE.Mesh(lawnGeom, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0, 8);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // Driveway & Pathway
    const drivewayGeom = new THREE.PlaneGeometry(14, 26);
    const drivewayMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6
    });
    const driveway = new THREE.Mesh(drivewayGeom, drivewayMat);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(-11, 0.02, 13);
    driveway.receiveShadow = true;
    scene.add(driveway);

    // 5. Architectural Modern House
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    // House Main Wall Materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.7,
      metalness: 0.05
    });
    const accentWallMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.5,
      metalness: 0.2
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.35
    });

    // Main House Body (Left & Center Section)
    const mainBodyGeom = new THREE.BoxGeometry(22, 7.5, 16);
    const mainBody = new THREE.Mesh(mainBodyGeom, wallMat);
    mainBody.position.set(3, 3.75, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    houseGroup.add(mainBody);

    // Garage Wing (Left Front)
    const garageGeom = new THREE.BoxGeometry(12, 6.5, 14);
    const garage = new THREE.Mesh(garageGeom, wallMat);
    garage.position.set(-11, 3.25, 4);
    garage.castShadow = true;
    garage.receiveShadow = true;
    houseGroup.add(garage);

    // Garage Door
    const garageDoorGeom = new THREE.BoxGeometry(9.5, 5, 0.3);
    const garageDoorMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.5
    });
    const garageDoor = new THREE.Mesh(garageDoorGeom, garageDoorMat);
    garageDoor.position.set(-11, 2.6, 11.1);
    garageDoor.castShadow = true;
    houseGroup.add(garageDoor);

    // Upper Penthouse / Extension (Right)
    const upperGeom = new THREE.BoxGeometry(14, 4.5, 12);
    const upper = new THREE.Mesh(upperGeom, accentWallMat);
    upper.position.set(6, 9.5, -1);
    upper.castShadow = true;
    upper.receiveShadow = true;
    houseGroup.add(upper);

    // Pitched Roof Structure (Main Roof Facet Facing Front/South)
    // Custom Prism / Wedge for realistic sloping solar roof
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-12, 0);
    roofShape.lineTo(12, 0);
    roofShape.lineTo(12, 4.8);
    roofShape.lineTo(-12, 4.8);
    roofShape.closePath();

    // Main Slanted Roof Plane (Angled 28 degrees, optimal for solar)
    const mainRoofSlopeGeom = new THREE.BoxGeometry(25, 0.4, 11.5);
    const mainRoofSlope = new THREE.Mesh(mainRoofSlopeGeom, roofMat);
    mainRoofSlope.position.set(3, 9.6, 2.5);
    mainRoofSlope.rotation.x = 0.42; // ~24 deg tilt
    mainRoofSlope.castShadow = true;
    mainRoofSlope.receiveShadow = true;
    houseGroup.add(mainRoofSlope);

    // Garage Roof Slope (Left)
    const garageRoofSlopeGeom = new THREE.BoxGeometry(13.5, 0.4, 9);
    const garageRoofSlope = new THREE.Mesh(garageRoofSlopeGeom, roofMat);
    garageRoofSlope.position.set(-11, 7.8, 4.2);
    garageRoofSlope.rotation.x = 0.36;
    garageRoofSlope.castShadow = true;
    garageRoofSlope.receiveShadow = true;
    houseGroup.add(garageRoofSlope);

    // Upper Level Solar Roof Slope
    const upperRoofSlopeGeom = new THREE.BoxGeometry(15.5, 0.4, 8);
    const upperRoofSlope = new THREE.Mesh(upperRoofSlopeGeom, roofMat);
    upperRoofSlope.position.set(6, 12.8, -0.5);
    upperRoofSlope.rotation.x = 0.38;
    upperRoofSlope.castShadow = true;
    upperRoofSlope.receiveShadow = true;
    houseGroup.add(upperRoofSlope);

    // 6. Photovoltaic Solar Panels Array (Matching reference design!)
    const solarPanels = [];
    
    // Panel Frame & Silicon Cell Materials
    const panelFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9
    });
    
    const panelCellMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Deep solar blue
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });

    // Helper to create a single high-efficiency PV module
    function createSolarModule(w = 2.4, h = 4.2) {
      const moduleGroup = new THREE.Group();
      
      // Aluminum Outer Frame
      const frameGeom = new THREE.BoxGeometry(w, 0.08, h);
      const frame = new THREE.Mesh(frameGeom, panelFrameMat);
      moduleGroup.add(frame);
      
      // Silicon Photovoltaic Glass Surface
      const glassGeom = new THREE.BoxGeometry(w * 0.95, 0.09, h * 0.95);
      const glass = new THREE.Mesh(glassGeom, panelCellMat);
      moduleGroup.add(glass);

      // Grid busbar lines (thin metallic lines on panel)
      const lineGeom = new THREE.PlaneGeometry(w * 0.9, h * 0.9);
      const lineMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const grid = new THREE.Mesh(lineGeom, lineMat);
      grid.rotation.x = -Math.PI / 2;
      grid.position.y = 0.05;
      moduleGroup.add(grid);

      return { group: moduleGroup, glassMesh: glass };
    }

    // Array of Solar Panels on Main Roof Slope (2 rows of 6 panels = 12 panels)
    const mainRoofPanelsGroup = new THREE.Group();
    mainRoofPanelsGroup.position.copy(mainRoofSlope.position);
    mainRoofPanelsGroup.rotation.copy(mainRoofSlope.rotation);
    houseGroup.add(mainRoofPanelsGroup);

    const cols = 6;
    const rows = 2;
    const panelW = 3.4;
    const panelH = 4.6;
    const gap = 0.25;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const mod = createSolarModule(panelW, panelH);
        const xPos = (c - (cols - 1) / 2) * (panelW + gap);
        const zPos = (r - (rows - 1) / 2) * (panelH + gap);
        mod.group.position.set(xPos, 0.28, zPos);
        mainRoofPanelsGroup.add(mod.group);
        solarPanels.push(mod.glassMesh);
      }
    }

    // Array of Solar Panels on Upper Penthouse Roof (1 row of 3 panels)
    const upperRoofPanelsGroup = new THREE.Group();
    upperRoofPanelsGroup.position.copy(upperRoofSlope.position);
    upperRoofPanelsGroup.rotation.copy(upperRoofSlope.rotation);
    houseGroup.add(upperRoofPanelsGroup);

    for (let c = 0; c < 3; c++) {
      const mod = createSolarModule(panelW, panelH * 0.9);
      const xPos = (c - 1) * (panelW + gap);
      mod.group.position.set(xPos, 0.28, 0);
      upperRoofPanelsGroup.add(mod.group);
      solarPanels.push(mod.glassMesh);
    }

    // 7. Architectural Details: Glass Windows with Interior Warm Glow
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.85
    });

    // Front Panorama Windows (Row of 6 floor-to-ceiling windows)
    for (let i = 0; i < 5; i++) {
      const winGeom = new THREE.BoxGeometry(2.2, 4.2, 0.15);
      const win = new THREE.Mesh(winGeom, windowMat);
      win.position.set(-1.5 + i * 2.8, 3.2, 8.1);
      houseGroup.add(win);
    }

    // Front Glass Entry Door
    const doorFrameGeom = new THREE.BoxGeometry(3.5, 5, 0.2);
    const doorFrame = new THREE.Mesh(doorFrameGeom, accentWallMat);
    doorFrame.position.set(11, 2.5, 8.1);
    houseGroup.add(doorFrame);

    const doorGlassGeom = new THREE.BoxGeometry(2.8, 4.4, 0.22);
    const doorGlass = new THREE.Mesh(doorGlassGeom, windowMat);
    doorGlass.position.set(11, 2.5, 8.1);
    houseGroup.add(doorGlass);

    // Tesla Powerwall / Home Battery Unit on the side wall
    const batteryGeom = new THREE.BoxGeometry(0.5, 3.5, 2.2);
    const batteryMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8
    });
    const battery = new THREE.Mesh(batteryGeom, batteryMat);
    battery.position.set(-17.2, 2.5, 2);
    battery.castShadow = true;
    houseGroup.add(battery);

    // Battery LED Status Light
    const ledGeom = new THREE.BoxGeometry(0.55, 0.15, 1.8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const batteryLed = new THREE.Mesh(ledGeom, ledMat);
    batteryLed.position.set(-17.2, 3.8, 2);
    houseGroup.add(batteryLed);

    // Ambient floating sun particles / dust motes
    const particleCount = 120;
    const particlesGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 60;
      particlePositions[i + 1] = Math.random() * 25;
      particlePositions[i + 2] = (Math.random() - 0.5) * 60;
    }

    particlesGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.25,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particleSystem);

    // Store references for dynamic state updates
    sceneObjectsRef.current = {
      scene,
      camera,
      renderer,
      sunLight,
      ambientLight,
      hemiLight,
      sunOrb,
      solarPanels,
      windowMat,
      particleSystem,
      houseGroup
    };

    // 8. Interactive Mouse Drag / Tilt Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = -0.35;
    let targetRotationX = 0.05;

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (!isDragging) {
        // Subtle parallax when hovering without drag
        const normalizedX = (e.clientX / width) * 2 - 1;
        const normalizedY = -(e.clientY / height) * 2 + 1;
        targetRotationY = -0.35 + normalizedX * 0.15;
        targetRotationX = 0.05 + normalizedY * 0.08;
        return;
      }
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.2, Math.min(0.35, targetRotationX + deltaY * 0.005));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth house rotation interpolation
      houseGroup.rotation.y += (targetRotationY - houseGroup.rotation.y) * 0.08;
      houseGroup.rotation.x += (targetRotationX - houseGroup.rotation.x) * 0.08;

      // Gentle floating particles
      particleSystem.rotation.y = time * 0.03;

      // Subtle solar panel glass reflection shimmer
      const pulse = 0.25 + Math.sin(time * 2.5) * 0.08;
      if (sceneObjectsRef.current.currentEmissiveIntensity !== undefined) {
        solarPanels.forEach(panel => {
          if (panel.material) {
            panel.material.emissiveIntensity = THREE.MathUtils.lerp(
              panel.material.emissiveIntensity,
              sceneObjectsRef.current.currentEmissiveIntensity * (1 + Math.sin(time * 3) * 0.1),
              0.05
            );
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 10. Dynamic Time-of-Day Lighting & Atmosphere Reaction
  useEffect(() => {
    const refs = sceneObjectsRef.current;
    if (!refs.sunLight) return;

    const { sunLight, ambientLight, hemiLight, sunOrb, solarPanels, windowMat, scene } = refs;

    // Lighting Presets based on selected mode
    const modes = {
      morning: {
        sunPos: [-32, 22, 28],
        sunColor: 0xffe8b3,
        sunIntensity: 2.2,
        ambColor: 0xffeedb,
        ambIntensity: 0.65,
        hemiSky: 0x93c5fd,
        hemiGround: 0x475569,
        panelColor: 0x0284c7,
        panelEmissive: 0.35,
        windowEmissive: 0.1,
        fogColor: 0x0c1322,
        sunOrbPos: [-70, 45, 60]
      },
      noon: {
        sunPos: [0, 45, 15],
        sunColor: 0xffffff,
        sunIntensity: 2.8,
        ambColor: 0xffffff,
        ambIntensity: 0.85,
        hemiSky: 0x38bdf8,
        hemiGround: 0x64748b,
        panelColor: 0x0369a1,
        panelEmissive: 0.55, // Intense peak glow
        windowEmissive: 0.05,
        fogColor: 0x090d16,
        sunOrbPos: [0, 95, 30]
      },
      sunset: {
        sunPos: [36, 12, 24],
        sunColor: 0xf97316,
        sunIntensity: 2.4,
        ambColor: 0xfde047,
        ambIntensity: 0.5,
        hemiSky: 0xfb923c,
        hemiGround: 0x334155,
        panelColor: 0xd97706,
        panelEmissive: 0.45,
        windowEmissive: 0.4,
        fogColor: 0x180d16,
        sunOrbPos: [75, 25, 50]
      },
      night: {
        sunPos: [20, 30, -20],
        sunColor: 0x60a5fa, // Moonlight
        sunIntensity: 0.4,
        ambColor: 0x1e293b,
        ambIntensity: 0.25,
        hemiSky: 0x0f172a,
        hemiGround: 0x020617,
        panelColor: 0x0f172a,
        panelEmissive: 0.05,
        windowEmissive: 0.95, // Bright warm home lighting
        fogColor: 0x030712,
        sunOrbPos: [45, 60, -45]
      }
    };

    const target = modes[timeMode] || modes.morning;

    // Apply lighting transitions
    sunLight.position.set(...target.sunPos);
    sunLight.color.setHex(target.sunColor);
    sunLight.intensity = target.sunIntensity;

    ambientLight.color.setHex(target.ambColor);
    ambientLight.intensity = target.ambIntensity;

    hemiLight.color.setHex(target.hemiSky);
    hemiLight.groundColor.setHex(target.hemiGround);

    sunOrb.position.set(...target.sunOrbPos);
    sunOrb.material.color.setHex(target.sunColor);

    if (scene && scene.fog) {
      scene.fog.color.setHex(target.fogColor);
    }

    refs.currentEmissiveIntensity = target.panelEmissive;
    solarPanels.forEach(panel => {
      if (panel.material) {
        panel.material.color.setHex(target.panelColor);
        panel.material.emissive.setHex(target.panelColor);
        panel.material.emissiveIntensity = target.panelEmissive;
      }
    });

    if (windowMat) {
      windowMat.emissiveIntensity = target.windowEmissive;
    }
  }, [timeMode]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        cursor: 'grab'
      }}
    />
  );
}
