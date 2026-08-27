import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import topologiesData from "../../datasets/topologies_dataset.json";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Neighborhood 3D", pos: [46, 32, 52], target: [0, 4, 0] },
  { id: "top", label: "City Map (2D)", pos: [0, 85, 0.01], target: [0, 0, 0] },
  { id: "close", label: "Rooftop Zoom", pos: [14, 18, 14], target: [0, 9, 0] },
  { id: "street", label: "Street Level", pos: [38, 3.8, 38], target: [0, 5, 0] }
];

const SolarCanvas3D = forwardRef(({
  elevation = 55,
  azimuth = 180,
  shadingMode = "realistic",
  scenePreset = "commercial",
  onMeshStatsUpdate,
  panelTilt = 25,
  activeCamPreset = "orbit",
  onCamPresetChange
}, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const solarPanelsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    setCameraPreset: (presetId) => {
      const preset = CAMERA_PRESETS.find(p => p.id === presetId);
      if (preset && cameraRef.current) {
        cameraRef.current.position.set(...preset.pos);
        cameraRef.current.lookAt(new THREE.Vector3(...preset.target));
      }
    }
  }));

  // 1. Scene, Camera, WebGL Renderer Initialization
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.006);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(46, 32, 52);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // Dynamic Atmosphere & Natural Illumination
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1c1917, 0.85);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 4.8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 2.0;
    sunLight.shadow.camera.far = 240;
    sunLight.shadow.camera.left = -70;
    sunLight.shadow.camera.right = 70;
    sunLight.shadow.camera.top = 70;
    sunLight.shadow.camera.bottom = -70;
    sunLight.shadow.bias = -0.00025;
    sunLight.shadow.radius = 1.5;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Glowing Sun Celestial Sphere with Corona
    const sunGeo = new THREE.SphereGeometry(3.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd159 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    // Base Terrain Plane with Asphalt, Grass & CAD Grid
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f141c,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(240, 120, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    // Smooth Orbit & Pan Controller
    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.PI / 4.2;
    let phi = Math.PI / 4.8;
    let radius = 72;
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
        theta -= deltaX * 0.0045;
        phi = Math.max(0.06, Math.min(Math.PI / 2 - 0.03, phi + deltaY * 0.0045));
        updateCameraPos();
      } else if (isPanning) {
        const panSpeed = 0.055;
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
      radius = Math.max(10, Math.min(160, radius + e.deltaY * 0.04));
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

  // 2. Dynamic Solar Ray Tracing & Celestial Arc Coordinates
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 76;

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(1.8, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.05, y * 1.05, z * 1.05);

    if (elevation < 12) {
      sceneRef.current.background = new THREE.Color(0x180c06);
      sceneRef.current.fog.color = new THREE.Color(0x180c06);
      sunLightRef.current.color.setHex(0xff4400);
      sunLightRef.current.intensity = 2.4;
    } else if (elevation < 32) {
      sceneRef.current.background = new THREE.Color(0x0c1524);
      sceneRef.current.fog.color = new THREE.Color(0x0c1524);
      sunLightRef.current.color.setHex(0xff9922);
      sunLightRef.current.intensity = 3.8;
    } else {
      sceneRef.current.background = new THREE.Color(0x080d1a);
      sceneRef.current.fog.color = new THREE.Color(0x080d1a);
      sunLightRef.current.color.setHex(0xfffaed);
      sunLightRef.current.intensity = 5.2;
    }
  }, [elevation, azimuth]);

  // 3. Ultra-Dense Real-World City & Village Procedural Topology Builder
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    solarPanelsRef.current = [];

    // Materials Palette
    const getBuildingMat = (color = 0x334155, roughness = 0.65, metalness = 0.25) => {
      if (shadingMode === "heatmap") return new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.2 });
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.95 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
      return new THREE.MeshStandardMaterial({ color, roughness, metalness });
    };

    const glassCurtainMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.85
    });

    const asphaltRoadMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.95,
      metalness: 0.05
    });

    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
      metalness: 0.1
    });

    const roadMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });

    const getSolarPanelMat = () => {
      if (shadingMode === "heatmap") {
        return new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.7 });
      }
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      return new THREE.MeshStandardMaterial({
        color: 0x050c18,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.35,
        roughness: 0.1,
        metalness: 0.92
      });
    };

    // Helper: Add Detailed Tree with Trunk and Multi-tier Foliage
    const addDetailedTree = (x, z, scale = 1.0) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25 * scale, 0.38 * scale, 2.2 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 })
      );
      trunk.position.set(x, 1.1 * scale, z);
      trunk.castShadow = true;
      group.add(trunk);

      const f1 = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.4 * scale, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      f1.position.set(x, 2.6 * scale, z);
      f1.castShadow = true;
      group.add(f1);

      const f2 = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.0 * scale, 1),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.85 })
      );
      f2.position.set(x, 3.4 * scale, z);
      f2.castShadow = true;
      group.add(f2);
    };

    // Helper: Add Detailed Vehicle with Wheels and Windows
    const addDetailedVehicle = (x, z, rotY = 0, color = 0x3b82f6) => {
      const carGroup = new THREE.Group();
      carGroup.position.set(x, 0, z);
      carGroup.rotation.y = rotY;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 0.85, 1.8),
        new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.8 })
      );
      body.position.y = 0.55;
      body.castShadow = true;
      carGroup.add(body);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.65, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 })
      );
      cabin.position.set(-0.2, 1.25, 0);
      cabin.castShadow = true;
      carGroup.add(cabin);

      // 4 Wheels
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      [[-1.2, 0.9], [1.2, 0.9], [-1.2, -0.9], [1.2, -0.9]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.35, wz);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });

      group.add(carGroup);
    };

    // Helper: Add Streetlight Pole with Glowing Lamp Head
    const addStreetlight = (x, z, rotY = 0) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8),
        getBuildingMat(0x64748b, 0.4, 0.7)
      );
      pole.position.set(x, 2.75, z);
      pole.castShadow = true;
      group.add(pole);

      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.12, 0.12),
        getBuildingMat(0x64748b, 0.4, 0.7)
      );
      arm.position.set(x + 0.5 * Math.cos(rotY), 5.4, z + 0.5 * Math.sin(rotY));
      arm.rotation.y = rotY;
      group.add(arm);

      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xfffbeb })
      );
      lamp.position.set(x + 1.0 * Math.cos(rotY), 5.3, z + 1.0 * Math.sin(rotY));
      group.add(lamp);
    };

    // Helper: Add Road Strip with Dashed Line
    const addRoad = (centerX, centerZ, width, length, isHorizontal = true) => {
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(isHorizontal ? length : width, isHorizontal ? width : length),
        asphaltRoadMat
      );
      road.position.set(centerX, 0.03, centerZ);
      road.rotation.x = -Math.PI / 2;
      road.receiveShadow = true;
      group.add(road);

      // Sidewalk Curbs
      const curb1 = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 1.2, 0.2, isHorizontal ? 1.2 : length),
        sidewalkMat
      );
      curb1.position.set(
        isHorizontal ? centerX : centerX - width / 2 - 0.6,
        0.1,
        isHorizontal ? centerZ - width / 2 - 0.6 : centerZ
      );
      curb1.receiveShadow = true;
      group.add(curb1);

      const curb2 = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 1.2, 0.2, isHorizontal ? 1.2 : length),
        sidewalkMat
      );
      curb2.position.set(
        isHorizontal ? centerX : centerX + width / 2 + 0.6,
        0.1,
        isHorizontal ? centerZ + width / 2 + 0.6 : centerZ
      );
      curb2.receiveShadow = true;
      group.add(curb2);

      // Dashed Centerline Markings
      const segCount = Math.floor(length / 4);
      for (let i = 0; i < segCount; i++) {
        const mark = new THREE.Mesh(
          new THREE.PlaneGeometry(isHorizontal ? 2.0 : 0.25, isHorizontal ? 0.25 : 2.0),
          roadMarkingMat
        );
        const offset = -length / 2 + i * 4 + 2;
        mark.position.set(
          isHorizontal ? centerX + offset : centerX,
          0.04,
          isHorizontal ? centerZ : centerZ + offset
        );
        mark.rotation.x = -Math.PI / 2;
        group.add(mark);
      }
    };

    // Helper: Add High-Precision Photovoltaic Array
    const addSolarArray = (startX, startZ, rows, cols, panelW, panelD, roofY, baseTiltRad = 0) => {
      const activeTilt = baseTiltRad !== 0 ? baseTiltRad : (panelTilt * Math.PI) / 180;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Panel Frame
          const panelGeo = new THREE.BoxGeometry(panelW, 0.12, panelD);
          const panelMesh = new THREE.Mesh(panelGeo, getSolarPanelMat());
          panelMesh.position.set(
            startX + c * (panelW + 0.32),
            roofY + 0.2 + Math.sin(activeTilt) * (r * panelD * 0.4),
            startZ + r * (panelD + 0.32)
          );
          panelMesh.rotation.x = activeTilt;
          panelMesh.castShadow = true;
          panelMesh.receiveShadow = true;
          group.add(panelMesh);
          solarPanelsRef.current.push(panelMesh);

          // Silver Mounting Strut Legs
          const strut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.35, 6),
            getBuildingMat(0x94a3b8, 0.3, 0.8)
          );
          strut.position.set(panelMesh.position.x, roofY + 0.1, panelMesh.position.z);
          group.add(strut);
        }
      }
    };

    const topo = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

    // =========================================================================
    // 1. TOPOLOGY: COMMERCIAL TECH & LOGISTICS CAMPUS
    // =========================================================================
    if (scenePreset === "commercial") {
      // Main Perimeter & Internal Ring Roads
      addRoad(0, 24, 9, 120, true);
      addRoad(-32, 0, 8, 80, false);
      addRoad(36, 0, 8, 80, false);

      // Main HQ Building (Multi-tiered Corporate Tower)
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(22, 16, 20), getBuildingMat(0x0f172a));
      b1.position.set(-8, 8, -4);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      // Glass Curtain Facade
      const glass1 = new THREE.Mesh(new THREE.BoxGeometry(22.3, 12, 20.3), glassCurtainMat);
      glass1.position.set(-8, 9, -4);
      group.add(glass1);

      // Rooftop HVAC Central Chiller Units
      [[-14, 2], [-2, 2], [-14, -8], [-2, -8]].forEach(([hx, hz]) => {
        const hvac = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 2.5), getBuildingMat(0x64748b));
        hvac.position.set(hx, 17, hz);
        hvac.castShadow = true;
        group.add(hvac);
      });

      // Rooftop Solar Array
      addSolarArray(-16, -11, 7, 7, 2.0, 1.4, 16.3);

      // Logistics Distribution Wing
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 22), getBuildingMat(0x1e293b));
      b2.position.set(16, 4.5, -4);
      b2.castShadow = true;
      b2.receiveShadow = true;
      group.add(b2);

      const glass2 = new THREE.Mesh(new THREE.BoxGeometry(18.3, 5, 22.3), glassCurtainMat);
      glass2.position.set(16, 5, -4);
      group.add(glass2);

      addSolarArray(10, -12, 6, 4, 2.0, 1.5, 9.3);

      // Architectural Skybridge
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(6, 2.5, 3.2), glassCurtainMat);
      bridge.position.set(4, 7.5, -4);
      group.add(bridge);

      // R&D Labs & Data Center Block
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(16, 12, 14), getBuildingMat(0x1e293b));
      b3.position.set(-8, 6, -26);
      b3.castShadow = true;
      b3.receiveShadow = true;
      group.add(b3);

      addSolarArray(-13, -31, 4, 5, 2.0, 1.4, 12.3);

      // Security Guardhouse
      const guard = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), getBuildingMat(0x334155));
      guard.position.set(-24, 1.5, 18);
      guard.castShadow = true;
      group.add(guard);

      // 4 Solar Carport Canopies with Parking Bays
      [-16, -6, 4, 14].forEach((cpX) => {
        const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.5, 8), getBuildingMat(0x94a3b8));
        pole1.position.set(cpX, 1.75, 14);
        pole1.castShadow = true;
        group.add(pole1);

        const canopy = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.15, 6.0), getSolarPanelMat());
        canopy.position.set(cpX, 3.6, 14);
        canopy.rotation.x = -0.22;
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        group.add(canopy);
      });

      // Parked & Driving Vehicles
      addDetailedVehicle(-16, 14, 1.57, 0xef4444);
      addDetailedVehicle(-6, 14, 1.57, 0x3b82f6);
      addDetailedVehicle(4, 14, 1.57, 0xffffff);
      addDetailedVehicle(14, 14, 1.57, 0x10b981);
      addDetailedVehicle(8, 24, 0, 0xf59e0b);
      addDetailedVehicle(-12, 24, Math.PI, 0x9333ea);

      // Streetlights along road
      [-24, -8, 8, 24].forEach((lx) => {
        addStreetlight(lx, 20, Math.PI / 2);
      });

      // Trees & Plaza Fountain
      const fountain = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.0, 0.8, 16), getBuildingMat(0x475569));
      fountain.position.set(4, 0.4, 6);
      group.add(fountain);

      const water = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.7, 16), waterMat);
      water.position.set(4, 0.5, 6);
      group.add(water);

      [-26, -26, -26, 28, 28, 28, 0, 16].forEach((tx, idx) => {
        const tz = -20 + idx * 8;
        addDetailedTree(tx, tz, 1.0 + (idx % 3) * 0.2);
      });
    }

    // =========================================================================
    // 2. TOPOLOGY: URBAN HIGH-RISE METROPOLITAN DISTRICT
    // =========================================================================
    else if (scenePreset === "highrise") {
      // 4-Lane Metropolitan Boulevards (Grid System)
      addRoad(0, 0, 10, 140, true);
      addRoad(0, 0, 10, 140, false);
      addRoad(0, 42, 8, 140, true);
      addRoad(0, -42, 8, 140, true);

      // 8 High-Density Skyscrapers
      const skyscrapers = [
        { x: -18, z: -18, w: 14, d: 14, h: 42, color: 0x0f172a, glassH: 36, heli: true },
        { x: 18, z: -18, w: 12, d: 12, h: 36, color: 0x1e293b, glassH: 30 },
        { x: -18, z: 18, w: 13, d: 13, h: 32, color: 0x334155, glassH: 26 },
        { x: 18, z: 18, w: 14, d: 14, h: 46, color: 0x0f172a, glassH: 40, crown: true },
        { x: -38, z: -18, w: 11, d: 11, h: 24, color: 0x1e293b, glassH: 18 },
        { x: 38, z: -18, w: 11, d: 11, h: 28, color: 0x334155, glassH: 22 },
        { x: -38, z: 18, w: 10, d: 10, h: 22, color: 0x1e293b, glassH: 16 },
        { x: 38, z: 18, w: 12, d: 12, h: 26, color: 0x0f172a, glassH: 20 }
      ];

      skyscrapers.forEach((t) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), getBuildingMat(t.color));
        b.position.set(t.x, t.h / 2, t.z);
        b.castShadow = true;
        b.receiveShadow = true;
        group.add(b);

        // Glass curtain facade
        const g = new THREE.Mesh(new THREE.BoxGeometry(t.w + 0.25, t.glassH, t.d + 0.25), glassCurtainMat);
        g.position.set(t.x, t.h / 2, t.z);
        group.add(g);

        // Rooftop Solar Array
        addSolarArray(t.x - t.w / 2 + 1.6, t.z - t.d / 2 + 1.6, 3, 3, 1.8, 1.4, t.h + 0.2);

        // Rooftop Helipad
        if (t.heli) {
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, 0.2, 16), getBuildingMat(0xffd159));
          pad.position.set(t.x, t.h + 0.15, t.z);
          group.add(pad);
        }

        // Spire Antenna
        if (t.crown) {
          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 10, 8), getBuildingMat(0xffffff, 0.2, 0.9));
          spire.position.set(t.x, t.h + 5, t.z);
          spire.castShadow = true;
          group.add(spire);

          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
          beacon.position.set(t.x, t.h + 10.2, t.z);
          group.add(beacon);
        }
      });

      // Skybridge Connecting Towers
      const skybridge = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 2.8), glassCurtainMat);
      skybridge.position.set(0, 26, -18);
      group.add(skybridge);

      // Boulevard Traffic
      addDetailedVehicle(-25, 0, 1.57, 0xef4444);
      addDetailedVehicle(10, 0, 1.57, 0x3b82f6);
      addDetailedVehicle(0, -20, 0, 0xf59e0b);
      addDetailedVehicle(0, 24, Math.PI, 0x10b981);
      addDetailedVehicle(25, 42, 1.57, 0xffffff);

      // Plaza Trees & Streetlights
      [-30, -10, 10, 30].forEach((px) => {
        addStreetlight(px, 7, 0);
        addStreetlight(px, -7, Math.PI);
        addDetailedTree(px, 10, 0.9);
        addDetailedTree(px, -10, 0.9);
      });
    }

    // =========================================================================
    // 3. TOPOLOGY: SUBURBAN RESIDENTIAL VILLAGE
    // =========================================================================
    else if (scenePreset === "residential") {
      // Village Loop Asphalt Roads
      addRoad(0, 0, 7.5, 120, true);
      addRoad(-32, 0, 6.5, 60, false);
      addRoad(32, 0, 6.5, 60, false);

      // 10 Detailed Residential Homes with Gable & Hip Roofs
      const villageHomes = [
        { x: -22, z: -16, roofRot: 0, wallColor: 0x334155, roofColor: 0x991b1b },
        { x: -8, z: -16, roofRot: 0, wallColor: 0x1e293b, roofColor: 0x0f172a },
        { x: 8, z: -16, roofRot: 0, wallColor: 0x334155, roofColor: 0x1e3a8a },
        { x: 22, z: -16, roofRot: 0, wallColor: 0x1e293b, roofColor: 0x991b1b },
        { x: -22, z: 16, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x0f172a },
        { x: -8, z: 16, roofRot: Math.PI, wallColor: 0x334155, roofColor: 0x1e3a8a },
        { x: 8, z: 16, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x991b1b },
        { x: 22, z: 16, roofRot: Math.PI, wallColor: 0x334155, roofColor: 0x0f172a }
      ];

      villageHomes.forEach((home) => {
        const homeGroup = new THREE.Group();
        homeGroup.position.set(home.x, 0, home.z);
        homeGroup.rotation.y = home.roofRot;

        // Ground Floor Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(9.5, 4.2, 9.5), getBuildingMat(home.wallColor));
        base.position.y = 2.1;
        base.castShadow = true;
        base.receiveShadow = true;
        homeGroup.add(base);

        // Windows & Doors
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.2), getBuildingMat(0x3e2723));
        door.position.set(0, 1.1, 4.8);
        homeGroup.add(door);

        const win1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.2), glassCurtainMat);
        win1.position.set(-2.6, 2.2, 4.8);
        homeGroup.add(win1);

        const win2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.2), glassCurtainMat);
        win2.position.set(2.6, 2.2, 4.8);
        homeGroup.add(win2);

        // Pitched Gable Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(7.8, 3.8, 4), getBuildingMat(home.roofColor));
        roof.position.y = 5.9;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        homeGroup.add(roof);

        // Chimney
        const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 0.8), getBuildingMat(0x78350f));
        chimney.position.set(2.2, 6.2, 1.5);
        chimney.castShadow = true;
        homeGroup.add(chimney);

        // South-Facing Rooftop Solar Array
        addSolarArray(home.x - 2.8, home.z + (home.roofRot === 0 ? 1.5 : -1.5), 2, 3, 1.6, 1.2, 5.2, -0.42);

        // Backyard Swimming Pool
        const pool = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.3, 3.0), waterMat);
        pool.position.set(home.x + 0.5, 0.15, home.z - 7.5);
        group.add(pool);

        group.add(homeGroup);
      });

      // Driveway Cars
      addDetailedVehicle(-22, -9, 0, 0xef4444);
      addDetailedVehicle(8, -9, 0, 0x3b82f6);
      addDetailedVehicle(-8, 9, Math.PI, 0xffffff);
      addDetailedVehicle(22, 9, Math.PI, 0x10b981);
      addDetailedVehicle(0, 0, 1.57, 0xf59e0b);

      // Garden Hedges & Village Trees
      for (let tx = -30; tx <= 30; tx += 8) {
        addDetailedTree(tx, -25, 1.1);
        addDetailedTree(tx, 25, 1.2);
        addStreetlight(tx, -5, Math.PI / 2);
      }
    }

    // =========================================================================
    // 4. TOPOLOGY: UTILITY SOLAR TRACKER MATRIX & SUBSTATION
    // =========================================================================
    else {
      // Gravel Access Roads
      addRoad(0, 0, 8, 120, true);
      addRoad(0, 0, 8, 90, false);

      // 6x6 Ground Mounted Single-Axis Tracker Arrays
      for (let x = -36; x <= 36; x += 12) {
        if (Math.abs(x) < 4) continue;
        for (let z = -32; z <= 32; z += 10) {
          if (Math.abs(z) < 4) continue;

          // Steel Foundation Torque Tube
          const tube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 6.2, 8),
            getBuildingMat(0x64748b, 0.3, 0.8)
          );
          tube.rotation.z = Math.PI / 2;
          tube.position.set(x, 1.5, z);
          tube.castShadow = true;
          group.add(tube);

          // Support Mounting Posts
          [-2.4, 0, 2.4].forEach((px) => {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.12, 0.15, 1.5, 8),
              getBuildingMat(0x94a3b8, 0.3, 0.8)
            );
            leg.position.set(x + px, 0.75, z);
            leg.castShadow = true;
            group.add(leg);
          });

          // Large Utility PV Panel String
          const panel = new THREE.Mesh(
            new THREE.BoxGeometry(6.4, 0.14, 4.2),
            getSolarPanelMat()
          );
          panel.position.set(x, 1.75, z);
          panel.rotation.x = -((panelTilt * Math.PI) / 180);
          panel.castShadow = true;
          panel.receiveShadow = true;
          group.add(panel);
          solarPanelsRef.current.push(panel);
        }
      }

      // Central Step-Up Transformer Substation (33kV / 132kV)
      const subGroup = new THREE.Group();
      subGroup.position.set(0, 0, 36);

      const subPad = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 12), getBuildingMat(0x475569));
      subPad.position.y = 0.2;
      subGroup.add(subPad);

      const transformer1 = new THREE.Mesh(new THREE.BoxGeometry(4, 3.8, 4), getBuildingMat(0x1e293b));
      transformer1.position.set(-4, 2.1, 0);
      transformer1.castShadow = true;
      subGroup.add(transformer1);

      const transformer2 = new THREE.Mesh(new THREE.BoxGeometry(4, 3.8, 4), getBuildingMat(0x1e293b));
      transformer2.position.set(4, 2.1, 0);
      transformer2.castShadow = true;
      subGroup.add(transformer2);

      // High-Voltage Gantry Tower
      const gantry = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 1), getBuildingMat(0x94a3b8, 0.3, 0.8));
      gantry.position.set(0, 3.8, -3.5);
      gantry.castShadow = true;
      subGroup.add(gantry);

      // Weather Monitoring Station & Anemometer Mast
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 12, 8), getBuildingMat(0xffffff));
      mast.position.set(-18, 6, 36);
      mast.castShadow = true;
      group.add(mast);

      const anemometer = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      anemometer.position.set(-18, 12.2, 36);
      group.add(anemometer);

      // Utility Maintenance Trucks
      addDetailedVehicle(-5, 0, 1.57, 0xf59e0b);
      addDetailedVehicle(5, 0, 1.57, 0xffffff);

      group.add(subGroup);
    }

    if (onMeshStatsUpdate) {
      onMeshStatsUpdate({
        totalRooftopArea: topo.totalRoofArea,
        panelsCount: topo.pvPanelCount,
        systemCapacityKwp: topo.systemCapacityKwp,
        annualGenerationKwh: topo.annualGenerationKwh,
        annualSavingsUsd: topo.annualSavingsUsd,
        co2OffsetTons: topo.co2OffsetTons,
        location: topo.location,
        climateZone: topo.climateZone,
        annualGhi: topo.annualGhi,
        name: topo.name
      });
    }
  }, [scenePreset, shadingMode, panelTilt]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      {/* Viewport Control Hints */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 10,
        background: "rgba(9, 13, 22, 0.8)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        color: "#94a3b8",
        pointerEvents: "none",
        fontFamily: "monospace"
      }}>
        <strong style={{ color: "#f59e0b" }}>Left-Click:</strong> Orbit • <strong style={{ color: "#f59e0b" }}>Right-Click:</strong> Pan • <strong style={{ color: "#f59e0b" }}>Scroll:</strong> Zoom
      </div>
    </div>
  );
});

export default SolarCanvas3D;
