import * as THREE from 'three';

export class SceneLightingManager {
  constructor(scene) {
    this.scene = scene;

    // 1. Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(this.ambientLight);

    // 2. Main Sun / Moon Directional Light
    this.mainLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    this.mainLight.position.set(-28, 32, 22);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.mapSize.width = 2048;
    this.mainLight.shadow.mapSize.height = 2048;
    this.mainLight.shadow.camera.near = 0.5;
    this.mainLight.shadow.camera.far = 150;
    const s = 35;
    this.mainLight.shadow.camera.left = -s;
    this.mainLight.shadow.camera.right = s;
    this.mainLight.shadow.camera.top = s;
    this.mainLight.shadow.camera.bottom = -s;
    this.mainLight.shadow.bias = -0.0005;
    this.scene.add(this.mainLight);

    // 3. Hemisphere Sky / Ground bounce
    this.hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x334155, 0.8);
    this.scene.add(this.hemiLight);

    // 4. Exterior Architectural Spotlights for Night Mode
    this.spotlights = [];
    const spotCoords = [
      [-11, 0.5, 12], // Garage entry
      [3, 0.5, 9],    // Front veranda
      [11, 0.5, 9]    // Entrance
    ];

    spotCoords.forEach(([x, y, z]) => {
      const spot = new THREE.SpotLight(0xfef08a, 0, 15, Math.PI / 4, 0.5, 1);
      spot.position.set(x, y, z);
      spot.target.position.set(x, y + 4, z - 1);
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.spotlights.push(spot);
    });

    // 5. Sun Orb
    const orbGeom = new THREE.SphereGeometry(2.5, 32, 32);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
    this.sunOrb = new THREE.Mesh(orbGeom, orbMat);
    this.scene.add(this.sunOrb);

    this.currentMode = 'morning';
  }

  setMode(mode) {
    this.currentMode = mode;
    const isMorning = mode === 'morning';

    if (isMorning) {
      // Daylight Sunlight
      this.mainLight.position.set(-28, 32, 22);
      this.mainLight.color.setHex(0xfffaed);
      this.mainLight.intensity = 2.5;

      this.ambientLight.color.setHex(0xffffff);
      this.ambientLight.intensity = 0.65;

      this.hemiLight.color.setHex(0x93c5fd);
      this.hemiLight.groundColor.setHex(0x475569);
      this.hemiLight.intensity = 0.8;

      this.sunOrb.position.set(-65, 48, 55);
      this.sunOrb.material.color.setHex(0xffd166);

      if (this.scene.fog) {
        this.scene.fog.color.setHex(0x090d16);
      }

      this.spotlights.forEach(spot => { spot.intensity = 0; });
    } else {
      // Moonlight & Architectural Spotlights
      this.mainLight.position.set(25, 30, -20);
      this.mainLight.color.setHex(0x93c5fd);
      this.mainLight.intensity = 0.45;

      this.ambientLight.color.setHex(0x1e293b);
      this.ambientLight.intensity = 0.25;

      this.hemiLight.color.setHex(0x0f172a);
      this.hemiLight.groundColor.setHex(0x020617);
      this.hemiLight.intensity = 0.35;

      this.sunOrb.position.set(55, 60, -45);
      this.sunOrb.material.color.setHex(0xdbeafe);

      if (this.scene.fog) {
        this.scene.fog.color.setHex(0x030712);
      }

      this.spotlights.forEach(spot => { spot.intensity = 3.5; });
    }
  }
}
