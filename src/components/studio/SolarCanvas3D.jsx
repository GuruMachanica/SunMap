import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import topologiesData from "../../datasets/topologies_dataset.json";
import { MapPin, Globe, Sun, Layers } from "lucide-react";

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

  const currentTopology = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

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

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1c1917, 0.95);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

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

    const sunGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd159 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

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

  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 68;

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

  // Load 3D Meshes from topologiesData
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    solarPanelsRef.current = [];

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

    const addCar = (x, z, rotY = 0, color = 0xd97706) => {
      const car = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.8), new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.7 }));
      car.position.set(x, 0.55, z);
      car.rotation.y = rotY;
      car.castShadow = true;
      group.add(car);
    };

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
        }
      }
    };

    const topo = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

    if (topo.buildings) {
      topo.buildings.forEach((b) => {
        if (b.isGlass) {
          const bridge = new THREE.Mesh(new THREE.BoxGeometry(b.dimensions.width, b.dimensions.height, b.dimensions.depth), glassMat);
          bridge.position.set(b.position.x, b.position.y, b.position.z);
          group.add(bridge);
          return;
        }

        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(b.dimensions.width, b.dimensions.height, b.dimensions.depth),
          getBuildingMat(b.wallColor || 0x1e293b)
        );
        mesh.position.set(b.position.x, b.position.y, b.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);

        if (b.hasGlassCurtain) {
          const g = new THREE.Mesh(
            new THREE.BoxGeometry(b.dimensions.width + 0.2, b.glassHeight || b.dimensions.height - 4, b.dimensions.depth + 0.2),
            glassMat
          );
          g.position.set(b.position.x, b.position.y, b.position.z);
          group.add(g);
        }

        if (b.roofFacets) {
          b.roofFacets.forEach((rf) => {
            if (rf.solarArray) {
              const sa = rf.solarArray;
              addSolarArray(sa.startX, sa.startZ, sa.rows, sa.cols, sa.panelW, sa.panelD, sa.baseY);
            }
          });
        }

        if (b.hvacUnits) {
          b.hvacUnits.forEach((hvac) => {
            const hMesh = new THREE.Mesh(new THREE.BoxGeometry(hvac.w, hvac.h, hvac.d), getBuildingMat(0x64748b));
            hMesh.position.set(hvac.x, b.dimensions.height + hvac.h / 2, hvac.z);
            hMesh.castShadow = true;
            group.add(hMesh);
          });
        }
      });
    }

    if (topo.carports) {
      topo.carports.forEach((cp) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 8), getBuildingMat(0x94a3b8));
        pole.position.set(cp.x, 1.5, cp.z);
        pole.castShadow = true;
        group.add(pole);

        const canopy = new THREE.Mesh(new THREE.BoxGeometry(cp.width, 0.15, cp.depth), getSolarPanelMat());
        canopy.position.set(cp.x, 3.1, cp.z);
        canopy.rotation.x = cp.tilt;
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        group.add(canopy);
      });
    }

    if (topo.houses) {
      topo.houses.forEach((h) => {
        const base = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 9), getBuildingMat(0x334155));
        base.position.set(h.x, 2.25, h.z);
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3.8, 4), getBuildingMat(0x0f172a));
        roof.position.set(h.x, 6.2, h.z);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        group.add(roof);

        addSolarArray(h.x - 2.8, h.z, 2, 3, 1.6, 1.2, 5.4, -0.45);
      });
    }

    if (topo.substation) {
      const sub = new THREE.Mesh(
        new THREE.BoxGeometry(topo.substation.w, topo.substation.h, topo.substation.d),
        getBuildingMat(0x475569)
      );
      sub.position.set(topo.substation.x, topo.substation.y, topo.substation.z);
      sub.castShadow = true;
      group.add(sub);
    }

    if (topo.arrayGrid) {
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
        }
      }
    }

    if (topo.vehicles) {
      topo.vehicles.forEach((v) => addCar(v.x, v.z, v.rotY, v.color));
    }

    if (topo.vegetation) {
      topo.vegetation.forEach((veg) => addTree(veg.x, veg.z, veg.scale));
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

  const handleSetPreset = (preset) => {
    setActiveCamPreset(preset.id);
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    cam.position.set(...preset.pos);
    cam.lookAt(new THREE.Vector3(...preset.target));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      {/* Top Camera Controls */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "rgba(9, 13, 22, 0.75)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "4px",
        borderRadius: "9999px"
      }}>
        {CAMERA_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSetPreset(p)}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              border: "none",
              background: activeCamPreset === p.id ? "#f59e0b" : "transparent",
              color: activeCamPreset === p.id ? "#000000" : "#94a3b8",
              fontWeight: 700,
              fontSize: "0.78rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Dataset Telemetry Banner Overlay */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 10,
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "10px 16px",
        borderRadius: "14px",
        color: "#ffffff",
        maxWidth: "340px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        fontFamily: "monospace"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700, marginBottom: "4px" }}>
          <Globe size={13} />
          <span>CITYGML LOD2 DATASET ACTIVE</span>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f8fafc", marginBottom: "2px" }}>
          {currentTopology.name}
        </div>
        <div style={{ fontSize: "0.72rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
          <MapPin size={11} color="#38bdf8" />
          <span>{currentTopology.location}</span>
        </div>
      </div>

      {/* Viewport Instructions */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 10,
        background: "rgba(9, 13, 22, 0.75)",
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
};

export default SolarCanvas3D;
