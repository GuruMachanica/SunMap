import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SolarCanvas3D = ({
  elevation = 45,
  azimuth = 180,
  shadingMode = "realistic",
  scenePreset = "commercial",
  onMeshStatsUpdate
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const materialsRef = useRef([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 18, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    currentMount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4d6, 3.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Glowing Sun Visualizer Sphere
    const sunGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd159 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    // 3. Ground Terrain Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(80, 40, 0x333333, 0x1c1c1c);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Group for building meshes
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    // 4. Simple Orbit Controller
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.PI / 4;
    let phi = Math.PI / 5;
    let radius = 40;

    const updateCameraPos = () => {
      camera.position.x = radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = radius * Math.sin(phi);
      camera.position.z = radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(0, 3, 0);
    };
    updateCameraPos();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      theta -= deltaX * 0.006;
      phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, phi + deltaY * 0.006));
      updateCameraPos();

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      radius = Math.max(10, Math.min(75, radius + e.deltaY * 0.03));
      updateCameraPos();
    };

    currentMount.addEventListener("mousedown", onMouseDown);
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
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("wheel", onWheel);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Sun Position when Elevation or Azimuth Changes
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 36;

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(0.5, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.1, y * 1.1, z * 1.1);

    // Dynamic light color based on elevation
    if (elevation < 15) {
      sunLightRef.current.color.setHex(0xff7733); // Golden sunset/sunrise
      sunLightRef.current.intensity = 1.6;
    } else if (elevation < 35) {
      sunLightRef.current.color.setHex(0xffaa44);
      sunLightRef.current.intensity = 2.4;
    } else {
      sunLightRef.current.color.setHex(0xfff7e6); // Crisp noon sunlight
      sunLightRef.current.intensity = 3.4;
    }
  }, [elevation, azimuth]);

  // Build Scene Geometry Presets
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    // Clear old meshes
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    materialsRef.current = [];

    // Helper material generator
    const getMaterial = (baseColor, isRooftop = false) => {
      let mat;
      if (shadingMode === "heatmap") {
        const heatmapColor = isRooftop ? 0xf59e0b : 0x3b82f6;
        mat = new THREE.MeshStandardMaterial({
          color: heatmapColor,
          roughness: 0.4,
          metalness: 0.3
        });
      } else if (shadingMode === "occlusion") {
        mat = new THREE.MeshStandardMaterial({
          color: isRooftop ? 0xffffff : 0x222222,
          roughness: 0.8,
          metalness: 0.1
        });
      } else if (shadingMode === "wireframe") {
        mat = new THREE.MeshBasicMaterial({
          color: isRooftop ? 0xfbbf24 : 0x555555,
          wireframe: true
        });
      } else {
        // Realistic
        mat = new THREE.MeshStandardMaterial({
          color: isRooftop ? 0x1e293b : baseColor,
          roughness: isRooftop ? 0.2 : 0.7,
          metalness: isRooftop ? 0.7 : 0.1
        });
      }
      materialsRef.current.push(mat);
      return mat;
    };

    let totalRooftopArea = 0;
    let totalPanels = 0;

    if (scenePreset === "commercial") {
      // Commercial Building Complex
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 12), getMaterial(0x888888));
      b1.position.set(-4, 3, 0);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      // Solar Canopy Rooftop
      const roof1 = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.4, 11.6), getMaterial(0x0f172a, true));
      roof1.position.set(-4, 6.2, 0);
      roof1.castShadow = true;
      roof1.receiveShadow = true;
      group.add(roof1);

      // Tower Wing
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 6), getMaterial(0x666666));
      b2.position.set(8, 6, -3);
      b2.castShadow = true;
      b2.receiveShadow = true;
      group.add(b2);

      const roof2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.4, 5.6), getMaterial(0x0f172a, true));
      roof2.position.set(8, 12.2, -3);
      roof2.castShadow = true;
      roof2.receiveShadow = true;
      group.add(roof2);

      totalRooftopArea = 142.5; // m^2
      totalPanels = 84;
    } else if (scenePreset === "highrise") {
      // Urban High-Rise Core
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(8, 18, 8), getMaterial(0x777777));
      b1.position.set(0, 9, 0);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.4, 7.6), getMaterial(0x0f172a, true));
      roof.position.set(0, 18.2, 0);
      roof.castShadow = true;
      roof.receiveShadow = true;
      group.add(roof);

      totalRooftopArea = 57.7;
      totalPanels = 36;
    } else if (scenePreset === "residential") {
      // Slanted Roof Home
      const base = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), getMaterial(0x999999));
      base.position.set(0, 2, 0);
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      // Sloped Roof
      const roofGeo = new THREE.ConeGeometry(6, 3, 4);
      const roof = new THREE.Mesh(roofGeo, getMaterial(0x0f172a, true));
      roof.position.set(0, 5.5, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      roof.receiveShadow = true;
      group.add(roof);

      totalRooftopArea = 48.0;
      totalPanels = 28;
    } else {
      // Solar Farm Ground Matrix
      for (let x = -8; x <= 8; x += 4) {
        for (let z = -8; z <= 8; z += 4) {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 2.5), getMaterial(0x0f172a, true));
          panel.position.set(x, 1.2, z);
          panel.rotation.x = -0.35; // 20 deg tilt south
          panel.castShadow = true;
          panel.receiveShadow = true;
          group.add(panel);
        }
      }
      totalRooftopArea = 187.5;
      totalPanels = 125;
    }

    if (onMeshStatsUpdate) {
      onMeshStatsUpdate({ totalRooftopArea, totalPanels });
    }
  }, [scenePreset, shadingMode]);

  return (
    <div className="relative w-full h-full">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Tip Overlay */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel-subtle px-3 py-1.5 rounded-xl font-mono text-[11px] text-zinc-400 pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Left-Click Drag: Rotate Camera • Scroll: Zoom • Right-Click: Pan
      </div>
    </div>
  );
};

export default SolarCanvas3D;
