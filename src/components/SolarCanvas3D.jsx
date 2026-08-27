import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FaEye, FaCompressArrowsAlt, FaVideo, FaSearchPlus } from "react-icons/fa";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Orbit 3D", pos: [24, 18, 28], target: [0, 4, 0] },
  { id: "top", label: "Top-Down (CAD)", pos: [0, 40, 0.01], target: [0, 0, 0] },
  { id: "close", label: "Rooftop Zoom", pos: [12, 12, 12], target: [0, 6, 0] },
  { id: "street", label: "Street Level", pos: [22, 2, 22], target: [0, 5, 0] }
];

const SolarCanvas3D = ({
  elevation = 45,
  azimuth = 180,
  shadingMode = "realistic",
  scenePreset = "commercial",
  onMeshStatsUpdate
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const sunRaysRef = useRef(null);
  const [activeCamPreset, setActiveCamPreset] = useState("orbit");

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(24, 18, 28);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    currentMount.appendChild(renderer.domElement);

    // 2. High-Fidelity Lighting Environment
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x18181b, 0.65);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 3.8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Glowing Sun Visualizer Sphere
    const sunGeo = new THREE.SphereGeometry(1.5, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc33 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    // Sun Rays Visualizer Lines
    const rayMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25 });
    const rayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const sunRays = new THREE.Line(rayGeo, rayMat);
    scene.add(sunRays);
    sunRaysRef.current = sunRays;

    // 3. Ground Terrain & Roads
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Site Asphalt Grid & Plot Lines
    const gridHelper = new THREE.GridHelper(100, 50, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Group for building meshes
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    // 4. Smooth Orbit & Zoom Controller
    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.PI / 4;
    let phi = Math.PI / 5;
    let radius = 42;
    let target = new THREE.Vector3(0, 3, 0);

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
        theta -= deltaX * 0.006;
        phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.04, phi + deltaY * 0.006));
        updateCameraPos();
      } else if (isPanning) {
        const panSpeed = 0.04;
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
      radius = Math.max(8, Math.min(85, radius + e.deltaY * 0.035));
      updateCameraPos();
    };

    const onContextMenu = (e) => e.preventDefault();

    currentMount.addEventListener("mousedown", onMouseDown);
    currentMount.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: true });

    // 5. Animation Loop
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

  // Update Sun Vector when Elevation or Azimuth changes
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 42;

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(0.8, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.05, y * 1.05, z * 1.05);

    // Sky Background and Lighting Tint dynamically based on Elevation
    if (elevation < 12) {
      // Golden Sunset/Sunrise
      sceneRef.current.background = new THREE.Color(0x1a0f0a);
      sunLightRef.current.color.setHex(0xff6622);
      sunLightRef.current.intensity = 1.8;
    } else if (elevation < 30) {
      // Warm Morning/Afternoon
      sceneRef.current.background = new THREE.Color(0x0f172a);
      sunLightRef.current.color.setHex(0xffb84d);
      sunLightRef.current.intensity = 2.8;
    } else {
      // Crisp Solar Noon
      sceneRef.current.background = new THREE.Color(0x090d16);
      sunLightRef.current.color.setHex(0xfff7e6);
      sunLightRef.current.intensity = 4.0;
    }

    // Update Ray line
    if (sunRaysRef.current) {
      const positions = new Float32Array([x, y, z, 0, 6, 0]);
      sunRaysRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    }
  }, [elevation, azimuth]);

  // Construct Photorealistic 3D Architectural Topologies
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    // Clear old objects
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    // Helper Materials
    const getBuildingMat = (color = 0x334155) => {
      if (shadingMode === "heatmap") {
        return new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.2 });
      } else if (shadingMode === "occlusion") {
        return new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.0 });
      } else if (shadingMode === "wireframe") {
        return new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
      }
      return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.25 });
    };

    const getSolarPanelMat = (irradianceMultiplier = 1.0) => {
      if (shadingMode === "heatmap") {
        // High Irradiance Golden Amber
        return new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.45 * irradianceMultiplier,
          roughness: 0.3,
          metalness: 0.5
        });
      } else if (shadingMode === "occlusion") {
        return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.2 });
      } else if (shadingMode === "wireframe") {
        return new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      }
      // Realistic Photovoltaic Blue-Black Silicon with metallic shine
      return new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x1e3a8a,
        emissiveIntensity: 0.2,
        roughness: 0.15,
        metalness: 0.85
      });
    };

    // Glass Window Material
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75
    });

    let totalRooftopArea = 0;
    let panelsCount = 0;

    // Helper: Add detailed solar panel array on a roof
    const addSolarArray = (startX, startZ, rows, cols, panelW, panelD, roofY, tiltRad = 0) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const panelGeo = new THREE.BoxGeometry(panelW, 0.12, panelD);
          const panelMesh = new THREE.Mesh(panelGeo, getSolarPanelMat());
          panelMesh.position.set(
            startX + c * (panelW + 0.3),
            roofY + 0.15 + (tiltRad !== 0 ? Math.sin(tiltRad) * (r * panelD) : 0),
            startZ + r * (panelD + 0.3)
          );
          if (tiltRad !== 0) panelMesh.rotation.x = tiltRad;
          panelMesh.castShadow = true;
          panelMesh.receiveShadow = true;
          group.add(panelMesh);
          panelsCount++;
        }
      }
    };

    // Helper: Add Decorative Landscaping Trees
    const addTree = (x, z) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 2, 8),
        new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 })
      );
      trunk.position.set(x, 1, z);
      trunk.castShadow = true;
      group.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.4, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      foliage.position.set(x, 2.6, z);
      foliage.castShadow = true;
      group.add(foliage);
    };

    if (scenePreset === "commercial") {
      // 1. Commercial Complex (Main Office + Tower Wing)
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 16), getBuildingMat(0x1e293b));
      b1.position.set(-3, 3, 0);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      // Glass ribbon windows
      const glass1 = new THREE.Mesh(new THREE.BoxGeometry(14.2, 1.2, 16.2), glassMat);
      glass1.position.set(-3, 3.5, 0);
      group.add(glass1);

      // Parapet Roof Border
      const parapet = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.4, 15.8), getBuildingMat(0x0f172a));
      parapet.position.set(-3, 6.2, 0);
      group.add(parapet);

      // Solar Array on Main Roof
      addSolarArray(-8, -6, 6, 5, 2.2, 1.6, 6.2);

      // Tower Wing
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(8, 14, 8), getBuildingMat(0x334155));
      b2.position.set(10, 7, -4);
      b2.castShadow = true;
      b2.receiveShadow = true;
      group.add(b2);

      const glass2 = new THREE.Mesh(new THREE.BoxGeometry(8.2, 8, 8.2), glassMat);
      glass2.position.set(10, 8, -4);
      group.add(glass2);

      addSolarArray(8, -6, 3, 3, 1.8, 1.4, 14.2);

      // HVAC units on roof
      const hvac = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2.5), getBuildingMat(0x64748b));
      hvac.position.set(-7, 6.8, 4);
      hvac.castShadow = true;
      group.add(hvac);

      // Trees
      addTree(-13, 8);
      addTree(-13, -8);
      addTree(14, 8);

      totalRooftopArea = 142.5;
    } else if (scenePreset === "highrise") {
      // 2. Metropolitan High-Rise Skyscraper
      const tower = new THREE.Mesh(new THREE.BoxGeometry(10, 24, 10), getBuildingMat(0x1e293b));
      tower.position.set(0, 12, 0);
      tower.castShadow = true;
      tower.receiveShadow = true;
      group.add(tower);

      // Glass exterior facade
      const glass = new THREE.Mesh(new THREE.BoxGeometry(10.2, 20, 10.2), glassMat);
      glass.position.set(0, 12, 0);
      group.add(glass);

      // Rooftop solar array & perimeter canopy
      addSolarArray(-3.5, -3.5, 4, 4, 1.8, 1.5, 24.2);

      addTree(9, 9);
      addTree(-9, -9);
      addTree(-9, 9);

      totalRooftopArea = 57.7;
    } else if (scenePreset === "residential") {
      // 3. Residential Gabled Sloped Home
      const base = new THREE.Mesh(new THREE.BoxGeometry(10, 4.5, 10), getBuildingMat(0x334155));
      base.position.set(0, 2.25, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Sloped Gabled Roof
      const roofGeo = new THREE.ConeGeometry(8, 4, 4);
      const roof = new THREE.Mesh(roofGeo, getBuildingMat(0x0f172a));
      roof.position.set(0, 6.5, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      roof.receiveShadow = true;
      group.add(roof);

      // Sloped South-Facing Solar Panels
      addSolarArray(-3, 0, 3, 4, 1.8, 1.3, 5.5, -0.45);

      addTree(-8, 6);
      addTree(8, 6);

      totalRooftopArea = 48.0;
    } else {
      // 4. Utility Solar Farm Tracker Matrix
      for (let x = -12; x <= 12; x += 6) {
        for (let z = -12; z <= 12; z += 6) {
          // Support Strut
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.5, 8), getBuildingMat(0x94a3b8));
          leg.position.set(x, 0.75, z);
          leg.castShadow = true;
          group.add(leg);

          // Solar Module (20 deg south tilt)
          const panel = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.15, 3.2), getSolarPanelMat());
          panel.position.set(x, 1.6, z);
          panel.rotation.x = -0.38; // 22 deg tilt
          panel.castShadow = true;
          panel.receiveShadow = true;
          group.add(panel);
          panelsCount++;
        }
      }
      totalRooftopArea = 187.5;
    }

    if (onMeshStatsUpdate) {
      onMeshStatsUpdate({ totalRooftopArea, panelsCount });
    }
  }, [scenePreset, shadingMode]);

  // Handle Camera Presets
  const handleSetPreset = (preset) => {
    setActiveCamPreset(preset.id);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    cam.position.set(...preset.pos);
    cam.lookAt(new THREE.Vector3(...preset.target));
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera View Angle Buttons */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 glass-panel p-1 rounded-2xl flex items-center gap-1 font-mono text-[11px] hidden sm:flex">
        {CAMERA_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSetPreset(p)}
            className={`px-3 py-1 rounded-xl transition-all font-bold ${
              activeCamPreset === p.id
                ? "bg-amber-400 text-black shadow"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Orbit Tip Overlay */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel-subtle px-3.5 py-2 rounded-2xl font-mono text-[11px] text-zinc-300 pointer-events-none flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span><strong>Left Click Drag:</strong> 3D Orbit • <strong>Right Click Drag:</strong> Pan • <strong>Scroll:</strong> Zoom</span>
      </div>
    </div>
  );
};

export default SolarCanvas3D;
