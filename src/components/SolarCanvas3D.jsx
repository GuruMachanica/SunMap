import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Neighborhood 3D", pos: [38, 28, 44], target: [0, 4, 0] },
  { id: "top", label: "City Map (2D CAD)", pos: [0, 65, 0.01], target: [0, 0, 0] },
  { id: "close", label: "Rooftop Zoom", pos: [16, 16, 16], target: [0, 8, 0] },
  { id: "street", label: "Street Level", pos: [32, 3.5, 32], target: [0, 6, 0] }
];

const SolarCanvas3D = ({
  elevation = 55,
  azimuth = 180,
  shadingMode = "realistic",
  scenePreset = "commercial",
  onMeshStatsUpdate,
  panelTilt = 25
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const solarPanelsRef = useRef([]);
  const [activeCamPreset, setActiveCamPreset] = useState("orbit");

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f17);
    scene.fog = new THREE.FogExp2(0x0c0f17, 0.008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    camera.position.set(38, 28, 44);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    currentMount.appendChild(renderer.domElement);

    // 2. Realistic Sky & Lighting Environment
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1c1917, 0.95);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Primary High Sun Light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 4.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Elevated Glowing Sun Disk
    const sunGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd159 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    // 3. Ground Terrain & City Asphalt
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(160, 80, 0x334155, 0x18202f);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    // 4. Smooth Orbit Controller
    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.PI / 4;
    let phi = Math.PI / 4.5;
    let radius = 62;
    let target = new THREE.Vector3(0, 4, 0);

    const updateCameraPos = () => {
      camera.position.x = target.x + radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = target.y + radius * Math.sin(phi);
      camera.position.z = target.z + radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(target);
    };
    updateCameraPos();

    const onMouseDown = (e) => {
      if (e.button === 0) isDragging = true;
      if (e.button === 2) isPanning = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (isDragging) {
        theta -= deltaX * 0.005;
        phi = Math.max(0.06, Math.min(Math.PI / 2 - 0.03, phi + deltaY * 0.005));
        updateCameraPos();
      } else if (isPanning) {
        const panSpeed = 0.06;
        target.x -= deltaX * panSpeed;
        target.z -= deltaY * panSpeed;
        updateCameraPos();
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e) => {
      radius = Math.max(12, Math.min(120, radius + e.deltaY * 0.04));
      updateCameraPos();
    };

    const onContextMenu = (e) => e.preventDefault();

    currentMount.addEventListener("mousedown", onMouseDown);
    currentMount.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: true });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousedown", onMouseDown);
      currentMount.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("wheel", onWheel);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Elevated Sun Position with Dynamic Sky & Warmth
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 68; // Elevated sun distance

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(1.5, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.05, y * 1.05, z * 1.05);

    if (elevation < 12) {
      sceneRef.current.background = new THREE.Color(0x1e1008);
      sunLightRef.current.color.setHex(0xff5511);
      sunLightRef.current.intensity = 2.0;
    } else if (elevation < 30) {
      sceneRef.current.background = new THREE.Color(0x0e1726);
      sunLightRef.current.color.setHex(0xffaa33);
      sunLightRef.current.intensity = 3.2;
    } else {
      sceneRef.current.background = new THREE.Color(0x0a0f1d);
      sunLightRef.current.color.setHex(0xfffaed);
      sunLightRef.current.intensity = 4.4;
    }
  }, [elevation, azimuth]);

  // Construct Realistic Full-Scale 3D Neighborhoods for All Modes
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    solarPanelsRef.current = [];

    // Helper Materials
    const getBuildingMat = (color = 0x334155) => {
      if (shadingMode === "heatmap") return new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.2 });
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
      return new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.2 });
    };

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      roughness: 0.08,
      metalness: 0.95,
      transparent: true,
      opacity: 0.8
    });

    const getSolarPanelMat = () => {
      if (shadingMode === "heatmap") {
        return new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.6 });
      }
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      return new THREE.MeshStandardMaterial({ color: 0x0a101d, emissive: 0x1e3a8a, emissiveIntensity: 0.3, roughness: 0.12, metalness: 0.9 });
    };

    // Helper: Add Trees
    const addTree = (x, z, scale = 1.0) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 1.8 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x452c1e, roughness: 0.9 })
      );
      trunk.position.set(x, 0.9 * scale, z);
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.3 * scale, 1),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 })
      );
      foliage.position.set(x, 2.4 * scale, z);
      foliage.castShadow = true;
      group.add(foliage);
    };

    // Helper: Add Stylized Low-Poly Car
    const addCar = (x, z, rotY = 0, color = 0xd97706) => {
      const car = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.8), new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.7 }));
      car.position.set(x, 0.55, z);
      car.rotation.y = rotY;
      car.castShadow = true;
      group.add(car);
    };

    // Helper: Add Solar Panel Array with Dynamic Tilt Support
    let panelsCount = 0;
    const addSolarArray = (startX, startZ, rows, cols, panelW, panelD, roofY, baseTiltRad = 0) => {
      const activeTilt = baseTiltRad !== 0 ? baseTiltRad : (panelTilt * Math.PI) / 180;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const panelGeo = new THREE.BoxGeometry(panelW, 0.12, panelD);
          const panelMesh = new THREE.Mesh(panelGeo, getSolarPanelMat());
          panelMesh.position.set(
            startX + c * (panelW + 0.35),
            roofY + 0.18 + Math.sin(activeTilt) * (r * panelD * 0.4),
            startZ + r * (panelD + 0.35)
          );
          panelMesh.rotation.x = activeTilt;
          panelMesh.castShadow = true;
          panelMesh.receiveShadow = true;
          group.add(panelMesh);
          solarPanelsRef.current.push(panelMesh);
          panelsCount++;
        }
      }
    };

    let totalRooftopArea = 0;

    // SCENE 1: COMMERCIAL TECH PARK & CAMPUS
    if (scenePreset === "commercial") {
      // Main 10-Story Office Tower
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(18, 14, 18), getBuildingMat(0x1e293b));
      b1.position.set(-6, 7, -2);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      const glass1 = new THREE.Mesh(new THREE.BoxGeometry(18.2, 10, 18.2), glassMat);
      glass1.position.set(-6, 8, -2);
      group.add(glass1);

      addSolarArray(-12, -8, 6, 6, 2.2, 1.5, 14.2);

      // Secondary Research Wing (5 Stories)
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 12), getBuildingMat(0x334155));
      b2.position.set(13, 3.5, -4);
      b2.castShadow = true;
      b2.receiveShadow = true;
      group.add(b2);

      const glass2 = new THREE.Mesh(new THREE.BoxGeometry(14.2, 4, 12.2), glassMat);
      glass2.position.set(13, 4, -4);
      group.add(glass2);

      addSolarArray(8, -8, 4, 4, 2.0, 1.5, 7.2);

      // Glass Skybridge connecting buildings
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 2.5), glassMat);
      bridge.position.set(3.5, 5.5, -3);
      group.add(bridge);

      // Carport Solar Canopy in Front
      for (let cp = -12; cp <= 12; cp += 8) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 8), getBuildingMat(0x94a3b8));
        pole.position.set(cp, 1.5, 16);
        pole.castShadow = true;
        group.add(pole);

        const canopy = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.15, 5), getSolarPanelMat());
        canopy.position.set(cp, 3.1, 16);
        canopy.rotation.x = -0.25;
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        group.add(canopy);
        panelsCount += 12;
      }

      // Asphalt Roads & Cars
      addCar(-8, 16, Math.PI / 2, 0xef4444);
      addCar(0, 16, Math.PI / 2, 0x3b82f6);
      addCar(8, 16, Math.PI / 2, 0xffffff);

      // Trees
      addTree(-18, 8);
      addTree(-18, -10);
      addTree(22, 6);
      addTree(22, -10);
      addTree(3, 12);

      totalRooftopArea = 210.0;
    }

    // SCENE 2: URBAN HIGH-RISE METROPOLITAN DISTRICT
    else if (scenePreset === "highrise") {
      const towers = [
        { x: 0, z: 0, w: 12, d: 12, h: 32, color: 0x0f172a }, // Main Skyscraper
        { x: -16, z: -10, w: 10, d: 10, h: 22, color: 0x1e293b },
        { x: 16, z: -8, w: 10, d: 10, h: 26, color: 0x334155 },
        { x: -14, z: 12, w: 9, d: 9, h: 16, color: 0x1e293b },
        { x: 14, z: 14, w: 9, d: 9, h: 18, color: 0x334155 }
      ];

      towers.forEach((t) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), getBuildingMat(t.color));
        b.position.set(t.x, t.h / 2, t.z);
        b.castShadow = true;
        b.receiveShadow = true;
        group.add(b);

        const g = new THREE.Mesh(new THREE.BoxGeometry(t.w + 0.2, t.h - 4, t.d + 0.2), glassMat);
        g.position.set(t.x, t.h / 2, t.z);
        group.add(g);

        // Add solar arrays on rooftops
        addSolarArray(t.x - t.w / 2 + 1.5, t.z - t.d / 2 + 1.5, 3, 3, 1.8, 1.4, t.h + 0.2);
      });

      // City street foliage
      addTree(-7, 7);
      addTree(7, 7);
      addTree(-7, -7);
      addTree(7, -7);

      totalRooftopArea = 145.0;
    }

    // SCENE 3: SUBURBAN RESIDENTIAL NEIGHBORHOOD
    else if (scenePreset === "residential") {
      const houses = [
        { x: -14, z: -10 },
        { x: 0, z: -10 },
        { x: 14, z: -10 },
        { x: -14, z: 10 },
        { x: 0, z: 10 },
        { x: 14, z: 10 }
      ];

      houses.forEach((h) => {
        // House Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 9), getBuildingMat(0x334155));
        base.position.set(h.x, 2.25, h.z);
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        // Pitched Gabled Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3.8, 4), getBuildingMat(0x0f172a));
        roof.position.set(h.x, 6.2, h.z);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        group.add(roof);

        // South-Facing Sloped Solar Array
        addSolarArray(h.x - 2.8, h.z, 2, 3, 1.6, 1.2, 5.4, -0.45);

        // Trees per yard
        addTree(h.x + 6, h.z + 5, 0.9);
      });

      totalRooftopArea = 128.0;
    }

    // SCENE 4: UTILITY SOLAR FARM & SUBSTATION GRID
    else {
      // 32 Dual-Axis Solar Tracker Tables
      for (let x = -24; x <= 24; x += 8) {
        for (let z = -20; z <= 20; z += 8) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.6, 8), getBuildingMat(0x94a3b8));
          leg.position.set(x, 0.8, z);
          leg.castShadow = true;
          group.add(leg);

          const panel = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.14, 3.6), getSolarPanelMat());
          panel.position.set(x, 1.7, z);
          panel.rotation.x = -((panelTilt * Math.PI) / 180);
          panel.castShadow = true;
          panel.receiveShadow = true;
          group.add(panel);
          solarPanelsRef.current.push(panel);
          panelsCount += 8;
        }
      }

      // Central Grid Inverter Substation
      const sub = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 8), getBuildingMat(0x475569));
      sub.position.set(0, 1.75, 28);
      sub.castShadow = true;
      group.add(sub);

      totalRooftopArea = 320.0;
    }

    if (onMeshStatsUpdate) {
      onMeshStatsUpdate({ totalRooftopArea, panelsCount });
    }
  }, [scenePreset, shadingMode, panelTilt]);

  const handleSetPreset = (preset) => {
    setActiveCamPreset(preset.id);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    cam.position.set(...preset.pos);
    cam.lookAt(new THREE.Vector3(...preset.target));
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera View Angle Buttons */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 glass-panel p-1 rounded-2xl flex items-center gap-1 font-mono text-[11px] hidden sm:flex shadow-xl">
        {CAMERA_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSetPreset(p)}
            className={`px-3.5 py-1.5 rounded-xl transition-all font-bold ${
              activeCamPreset === p.id
                ? "bg-amber-400 text-black shadow"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Orbit Tip Overlay */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel-subtle px-3.5 py-2 rounded-2xl font-mono text-[11px] text-zinc-300 pointer-events-none flex items-center gap-2.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span><strong>Left-Click:</strong> Orbit 3D • <strong>Right-Click:</strong> Pan Map • <strong>Scroll:</strong> Zoom</span>
      </div>
    </div>
  );
};

export default SolarCanvas3D;
