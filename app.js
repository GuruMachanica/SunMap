// SunMap 3D Visualization Application
class SunMapVisualizer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.buildings = [];
        this.solarData = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.enableOcclusion = false;
        this._sunAnimation = {
            playing: false,
            currentAz: 135,
            currentEl: 45,
            speed: 1, // degrees per frame
            elevSweep: {
                enabled: false,
                min: 15,
                max: 60,
                direction: 1
            }
        };
        this.occlusionSamples = 1; // single-sample by default
        this._lastStatusUpdate = 0;
    this.infoPinned = false;
    this.infoAutoHideMs = 2000;
    this._infoHideTimer = null;
    this.selectedBuilding = null; // currently selected building (mesh/group)
        
        this.init();
        this.setupEventListeners();
        this.loadInitialData();
    }
    
    // Helper function to convert degrees to radians
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            10000
        );
        this.camera.position.set(100, 100, 100);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add renderer to container
        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);
        
        // Add controls (use THREE.OrbitControls if available, otherwise use a minimal fallback)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        } else {
            // Minimal fallback that provides the methods used in the app (update, reset, enableDamping)
            console.warn('THREE.OrbitControls not found — using fallback simple controls');
            class SimpleOrbitControls {
                constructor(camera, domElement) {
                    this.camera = camera;
                    this.domElement = domElement;
                    this.enableDamping = false;
                    this.dampingFactor = 0.05;
                    // store default position for reset
                    this._defaultPos = camera.position.clone();
                    this._onPointerDown = this._onPointerDown.bind(this);
                    this._onPointerMove = this._onPointerMove.bind(this);
                    this._onPointerUp = this._onPointerUp.bind(this);
                    this._isPointerDown = false;
                    this._lastX = 0;
                    this._lastY = 0;
                    domElement.addEventListener('pointerdown', this._onPointerDown);
                    domElement.addEventListener('pointermove', this._onPointerMove);
                    domElement.addEventListener('pointerup', this._onPointerUp);
                }
                _onPointerDown(e) {
                    this._isPointerDown = true;
                    this._lastX = e.clientX;
                    this._lastY = e.clientY;
                }
                _onPointerMove(e) {
                    if (!this._isPointerDown) return;
                    const dx = (e.clientX - this._lastX) * 0.005;
                    const dy = (e.clientY - this._lastY) * 0.005;
                    this._lastX = e.clientX;
                    this._lastY = e.clientY;
                    // simple orbit rotation around Y axis
                    this.camera.position.applyAxisAngle(new THREE.Vector3(0,1,0), -dx);
                    this.camera.position.y += dy * 10;
                    this.camera.lookAt(new THREE.Vector3(0,0,0));
                }
                _onPointerUp() {
                    this._isPointerDown = false;
                }
                update() {
                    // no-op for now; future damping could be implemented
                }
                reset() {
                    this.camera.position.copy(this._defaultPos);
                    this.camera.lookAt(new THREE.Vector3(0,0,0));
                }
            }
            this.controls = new SimpleOrbitControls(this.camera, this.renderer.domElement);
        }
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Add lighting
        this.setupLighting();

    // Initialize sun position (use sliders default: elevation 45, azimuth 135)
    this.changeSun(45, 135);
        
        // Add ground plane
        this.createGround();
    // Update shadow frustum to cover initial scene (if any buildings exist)
    this.updateSunShadowFrustum();
        
        // Start render loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Set sun position based on elevation (degrees) and azimuth (degrees).
     * elevation: 0..90 (0 = horizon, 90 = overhead)
     * azimuth: 0..360 (0 = north-ish, degrees clockwise)
     */
    changeSun(elevationDeg, azimuthDeg) {
        // Convert to radians
        const el = this.toRadians(Number(elevationDeg));
        const az = this.toRadians(Number(azimuthDeg));

        // Spherical coordinates: radius large enough to cast shadows across scene
        const r = 400;

        // In three.js, commonly Y is up. Convert elevation/azimuth to 3D coords.
        // azimuth 0 points to +Z; we adjust so 0 is toward -Z (north) and 180 is south
        const x = r * Math.cos(el) * Math.sin(az);
        const y = r * Math.sin(el);
        const z = r * Math.cos(el) * Math.cos(az);

        if (this.sunLight) {
            this.sunLight.position.set(x, y, z);
            // Keep target at origin unless changed elsewhere
            if (this.sunLight.target) this.sunLight.target.position.set(0, 0, 0);
        }

        if (this.sunSphere) {
            this.sunSphere.position.set(x, y, z);
        }

        // Recompute irradiation based on the new sun position
        this.updateIrradiationForSun();

        // Update visual styling/legend
        this.updateVisualization();
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun) - store on the instance so it can be updated by UI
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(200, 200, 100);
        this.sunLight.castShadow = true;
    // increase shadow map resolution for better quality across large scenes
    this.sunLight.shadow.mapSize.width = 4096;
    this.sunLight.shadow.mapSize.height = 4096;
    // widen near/far to ensure shadows render at distant positions
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 2000;
    // Expand the orthographic shadow camera to cover the full ground plane (ground is 1000x1000)
    // Using a margin so shadows don't clip at the edges
    const shadowExtent = 600; // +/- extent in world units (covers 1200x1200 area)
    this.sunLight.shadow.camera.left = -shadowExtent;
    this.sunLight.shadow.camera.right = shadowExtent;
    this.sunLight.shadow.camera.top = shadowExtent;
    this.sunLight.shadow.camera.bottom = -shadowExtent;

    // Add a dedicated target object so we can move the light easily
    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(0, 0, 0); // center of the scene / ground plane
    this.scene.add(sunTarget);
    this.sunLight.target = sunTarget;
    this.scene.add(this.sunLight);

        // Small visual indicator for the sun (not lit, just marker)
        const sunGeom = new THREE.SphereGeometry(4, 12, 12);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff36b });
        this.sunSphere = new THREE.Mesh(sunGeom, sunMat);
        this.sunSphere.position.copy(this.sunLight.position);
        this.scene.add(this.sunSphere);
    }
    
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x999999, // A neutral grey color
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    async loadInitialData() {
        try {
            // Try to fetch a default data file
            const response = await fetch('solar_data.json');
            if (!response.ok) {
                throw new Error('solar_data.json not found, using sample data.');
            }
            const data = await response.json();
            console.log('Loaded solar_data.json successfully.');
            this.loadBuildings(data.buildings);
        } catch (error) {
            console.warn(error.message);
            this.createSampleData();
        }
        this.updateLegend('irradiation'); // Initialize legend
    }

    createSampleData() {
        // Create a denser set of sample buildings with solar data
        const sampleBuildings = [];
        const numBuildings = 30; // Increased number of buildings
        const areaSize = 250; // Area to spread buildings over

        for (let i = 0; i < numBuildings; i++) {
            const width = Math.random() * 15 + 10; // 10 to 25
            const depth = Math.random() * 15 + 10; // 10 to 25
            const height = Math.random() * 20 + 10; // 10 to 30

            const building = {
                id: `building_${String(i + 1).padStart(3, '0')}`,
                position: {
                    x: (Math.random() - 0.5) * areaSize,
                    y: 0,
                    z: (Math.random() - 0.5) * areaSize
                },
                dimensions: { width, height, depth },
                roofSurfaces: []
            };

            // Add 1 to 3 roof surfaces per building
            const numRoofs = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numRoofs; j++) {
                const area = (width * depth) / numRoofs;
                const azimuth = Math.random() * 360;
                const tilt = Math.random() * 60;
                // Simulate irradiation based on azimuth (south-facing is better) and tilt
                const irradiation = 400 + 800 * Math.cos(this.toRadians(azimuth - 180)) * Math.cos(this.toRadians(tilt - 30));

                building.roofSurfaces.push({
                    id: `roof_${String(i + 1).padStart(3, '0')}_${j+1}`,
                    area: Math.round(area),
                    azimuth: Math.round(azimuth),
                    tilt: Math.round(tilt),
                    irradiation: Math.max(400, Math.round(irradiation)), // Ensure a minimum
                    totalIrradiation: Math.round(area * Math.max(400, irradiation))
                });
            }
            sampleBuildings.push(building);
        }
        
        this.loadBuildings(sampleBuildings);
    }
    
    loadBuildings(buildingsData) {
        try {
            // Hide info panel when loading new data
            const infoPanel = document.getElementById('info-panel');
            if (infoPanel) infoPanel.style.display = 'none';

            // Clear existing buildings
            this.buildings.forEach(building => {
                if (building && building.mesh) {
                    this.scene.remove(building.mesh);
                }
            });
            this.buildings = [];
            
            // Create new buildings
            buildingsData.forEach(buildingData => {
                try {
                    const building = this.createBuilding(buildingData);
                    if (building && building.mesh) {
                        this.buildings.push(building);
                        this.scene.add(building.mesh);
                    }
                } catch (error) {
                    console.error('Error creating building:', buildingData.id, error);
                }
            });
            
            this.updateVisualization();
            console.log(`Successfully loaded ${this.buildings.length} buildings`);
            // After buildings are loaded, update the sun shadow frustum to cover the scene
            this.updateSunShadowFrustum();
        } catch (error) {
            console.error('Error loading buildings:', error);
            alert('Error loading buildings: ' + error.message);
        }
    }
    
    createBuilding(buildingData) {
        try {
            const { position, dimensions, roofSurfaces, type } = buildingData;
            
        // Create building group for more complex geometry
        const buildingGroup = new THREE.Group();
        
        // Create main building structure
        const geometry = new THREE.BoxGeometry(
            dimensions.width, 
            dimensions.height, 
            dimensions.depth
        );
        
        // Calculate average irradiation for color
        const totalArea = roofSurfaces.reduce((sum, surface) => sum + surface.area, 0);
        const avgIrradiation = roofSurfaces.reduce((sum, surface) => 
            sum + (surface.irradiation * surface.area), 0) / totalArea;
        
        // Create material with solar-based color
        const material = new THREE.MeshLambertMaterial({
            color: this.getSolarColor(avgIrradiation),
            transparent: true,
            opacity: 0.45 // make building boxes more transparent for better visibility
        });
        
        // Create main building mesh
        const mainMesh = new THREE.Mesh(geometry, material);
        mainMesh.position.set(0, dimensions.height / 2, 0);
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        
        // Add building type-specific features
        this.addBuildingFeatures(buildingGroup, buildingData, avgIrradiation);
        
        // Add roof visualization
        this.addRoofVisualization(buildingGroup, roofSurfaces, dimensions);
        
        // Add building to group
        buildingGroup.add(mainMesh);
        
        // Position the entire building
        buildingGroup.position.set(position.x, position.y, position.z);
        
        // Add building data
        buildingGroup.userData = {
            type: 'building',
            buildingData: buildingData,
            roofSurfaces: roofSurfaces,
            totalArea: totalArea,
            avgIrradiation: avgIrradiation,
            buildingType: type
        };
        
            return {
                mesh: buildingGroup,
                data: buildingData
            };
        } catch (error) {
            console.error('Error creating building:', buildingData.id, error);
            return null;
        }
    }
    
    addBuildingFeatures(buildingGroup, buildingData, avgIrradiation) {
        const { dimensions, type } = buildingData;
        
        // Add windows (small rectangles on building faces)
        const windowMaterial = new THREE.MeshLambertMaterial({
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.2 // subtle windows so background remains visible
        });
        
        // Calculate number of windows based on building size
        const numWindows = Math.floor(dimensions.width * dimensions.height / 50);
        
        for (let i = 0; i < numWindows; i++) {
            const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            
            // Randomly place windows on building faces
            const face = Math.floor(Math.random() * 4);
            const x = (Math.random() - 0.5) * dimensions.width;
            const y = Math.random() * dimensions.height;
            const z = (Math.random() - 0.5) * dimensions.depth;
            
            switch (face) {
                case 0: // Front
                    window.position.set(x, y, dimensions.depth / 2 + 0.01);
                    break;
                case 1: // Back
                    window.position.set(x, y, -dimensions.depth / 2 - 0.01);
                    window.rotation.y = Math.PI;
                    break;
                case 2: // Left
                    window.position.set(-dimensions.width / 2 - 0.01, y, z);
                    window.rotation.y = Math.PI / 2;
                    break;
                case 3: // Right
                    window.position.set(dimensions.width / 2 + 0.01, y, z);
                    window.rotation.y = -Math.PI / 2;
                    break;
            }
            
            buildingGroup.add(window);
        }
        
        // Add building type-specific features
        if (type === 'apartment_building') {
            // Add balconies
            this.addBalconies(buildingGroup, dimensions);
        } else if (type === 'commercial_building') {
            // Add signage
            this.addSignage(buildingGroup, dimensions, avgIrradiation);
        } else if (type === 'industrial_building') {
            // Add industrial features
            this.addIndustrialFeatures(buildingGroup, dimensions);
        }
    }
    
    addBalconies(buildingGroup, dimensions) {
        const balconyMaterial = new THREE.MeshLambertMaterial({
            color: 0x8B4513,
            transparent: true,
            opacity: 0.8
        });
        
        const numBalconies = Math.floor(dimensions.height / 3);
        
        for (let i = 0; i < numBalconies; i++) {
            const balconyGeometry = new THREE.BoxGeometry(2, 0.2, 1);
            const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial);
            
            balcony.position.set(
                dimensions.width / 2 + 1,
                (i + 1) * 3,
                (Math.random() - 0.5) * dimensions.depth
            );
            
            buildingGroup.add(balcony);
        }
    }
    
    addSignage(buildingGroup, dimensions, avgIrradiation) {
        const signMaterial = new THREE.MeshLambertMaterial({
            color: avgIrradiation > 1000 ? 0xFFD700 : 0xFF6B6B,
            transparent: true,
            opacity: 0.9
        });
        
        const signGeometry = new THREE.PlaneGeometry(4, 1);
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        
        sign.position.set(0, dimensions.height - 1, dimensions.depth / 2 + 0.01);
        buildingGroup.add(sign);
    }
    
    addIndustrialFeatures(buildingGroup, dimensions) {
        // Add chimneys or vents
        const chimneyMaterial = new THREE.MeshLambertMaterial({
            color: 0x696969,
            transparent: true,
            opacity: 0.5
        });
        
        const chimneyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3);
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        
        chimney.position.set(
            (Math.random() - 0.5) * dimensions.width,
            dimensions.height + 1.5,
            (Math.random() - 0.5) * dimensions.depth
        );
        
        buildingGroup.add(chimney);
    }
    
    addRoofVisualization(buildingGroup, roofSurfaces, dimensions) {
        // Create roof surface indicators
        roofSurfaces.forEach((surface, index) => {
            const roofMaterial = new THREE.MeshLambertMaterial({
                color: this.getSolarColor(surface.irradiation),
                transparent: true,
                opacity: 0.25, // translucent roofs so background and controls remain readable
                side: THREE.DoubleSide
            });
            
            // Create a plane to represent the roof surface
            const roofGeometry = new THREE.PlaneGeometry(
                dimensions.width * 0.8, 
                dimensions.depth * 0.8
            );
            const roofPlane = new THREE.Mesh(roofGeometry, roofMaterial);
            
            // Position above the building
            roofPlane.position.set(0, dimensions.height + 0.1, 0);
            
            // Rotate based on tilt and azimuth
            roofPlane.rotation.x = -this.toRadians(surface.tilt);
            roofPlane.rotation.y = this.toRadians(surface.azimuth);
            
            // Attach surface data to the mesh so it can be updated when sun moves
            roofPlane.userData = {
                roofSurface: surface,
                baseIrradiation: surface.irradiation
            };

            buildingGroup.add(roofPlane);
        });
    }

    /**
     * Recompute roof surface illumination given current sun direction and update materials and building userData.
     * Uses a simple Lambertian cosine model: illumination ~ baseIrradiation * max(0, dot(normal, sunDir)).
     */
    updateIrradiationForSun() {
        if (!this.sunLight) return;

        // Sun direction: pointing from surface toward sun? we want vector from surface to sun, so use sun position normalized
        const sunPos = new THREE.Vector3().copy(this.sunLight.position).normalize();
        const sunDir = sunPos.clone().normalize();

        // For each building, update roof surfaces
        this.buildings.forEach(building => {
            const meshGroup = building.mesh;
            const bdata = meshGroup.userData || {};

            // Find roof meshes that we added (they have userData.roofSurface)
            let totalArea = 0;
            let weightedIrr = 0;

            meshGroup.traverse((child) => {
                if (!child.userData || !child.userData.roofSurface) return;
                const surface = child.userData.roofSurface;
                const base = child.userData.baseIrradiation || surface.irradiation || 0;

                // Calculate surface normal from tilt and azimuth
                const tiltRad = this.toRadians(surface.tilt);
                const azRad = this.toRadians(surface.azimuth);

                // Normal vector (y is up). tilt is angle from vertical.
                const nx = Math.sin(tiltRad) * Math.sin(azRad);
                const ny = Math.cos(tiltRad);
                const nz = Math.sin(tiltRad) * Math.cos(azRad);
                const normal = new THREE.Vector3(nx, ny, nz).normalize();

                // Illumination factor
                let factor = Math.max(0, normal.dot(sunDir));

                // Occlusion check: cast one or more rays from roof toward sun; if any sample is occluded, reduce factor
                if (this.enableOcclusion && factor > 0) {
                    const roofWorldPos = new THREE.Vector3();
                    child.getWorldPosition(roofWorldPos);
                    const sunWorld = new THREE.Vector3().copy(this.sunLight.position);
                    const distToSun = sunWorld.distanceTo(roofWorldPos);

                    // sample offsets on the roof plane (center + grid). We'll do a simple NxN grid approximated by sample count
                    const samples = Math.max(1, Math.min(9, this.occlusionSamples));
                    let occludedCount = 0;
                    for (let si = 0; si < samples; si++) {
                        // compute sample offsets in roof local space: for a 1D scheme, spread samples along x and z
                        const offset = new THREE.Vector3(
                            (Math.random() - 0.5) * 0.8 * (child.geometry ? child.geometry.parameters.width || 1 : 1),
                            0.02,
                            (Math.random() - 0.5) * 0.8 * (child.geometry ? child.geometry.parameters.height || 1 : 1)
                        );

                        // transform offset into world coordinates
                        const samplePos = roofWorldPos.clone().add(offset.applyQuaternion(child.getWorldQuaternion(new THREE.Quaternion())));

                        const dirToSun = sunWorld.clone().sub(samplePos).normalize();
                        this.raycaster.set(samplePos.addScaledVector(dirToSun, 0.05), dirToSun);
                        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

                        if (intersects && intersects.length > 0) {
                            const hit = intersects[0];
                            if (hit.distance < distToSun - 1e-3) {
                                occludedCount++;
                            }
                        }
                    }

                    // (dynamic shadow frustum update moved to a class method)

                    // reduce factor proportionally to unoccluded samples
                    const unoccludedRatio = 1 - (occludedCount / samples);
                    factor = factor * unoccludedRatio;
                }

                // New instantaneous irradiation estimate
                const instIrr = base * factor;

                // Update material color based on instantaneous irradiation
                if (child.material) {
                    const colorHex = this.getSolarColor(instIrr);
                    child.material.color.setHex(colorHex);
                }

                // Update surface attributes for hovering/info
                surface.currentIrradiation = instIrr;
                // area contributes to weighted average
                const area = surface.area || 0;
                totalArea += area;
                weightedIrr += instIrr * area;
            });

            // Update building aggregate values
            const avg = totalArea > 0 ? weightedIrr / totalArea : 0;
            meshGroup.userData.avgIrradiation = avg;
            meshGroup.userData.totalArea = totalArea;
        });

        // update realtime status (throttle to ~10Hz)
        const now = performance.now ? performance.now() : Date.now();
        if (now - this._lastStatusUpdate > 100) {
            this._lastStatusUpdate = now;
            updateStatusPanel(this.buildings.length, this._sunAnimation.currentEl, this._sunAnimation.currentAz);
        }
    }

    // Compute scene bounds from buildings and expand the sun's shadow camera to cover them
    updateSunShadowFrustum() {
        if (!this.sunLight || !this.sunLight.shadow) return;

        if (!this.buildings || this.buildings.length === 0) {
            // default extent if no buildings
            const defaultExtent = 600;
            this.sunLight.shadow.camera.left = -defaultExtent;
            this.sunLight.shadow.camera.right = defaultExtent;
            this.sunLight.shadow.camera.top = defaultExtent;
            this.sunLight.shadow.camera.bottom = -defaultExtent;
            this.sunLight.shadow.camera.updateProjectionMatrix();
            return;
        }

        let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
        this.buildings.forEach(b => {
            const pos = b.mesh ? b.mesh.position : { x: 0, z: 0 };
            const dims = (b.data && b.data.dimensions) ? b.data.dimensions : { width: 0, depth: 0 };
            const halfW = (dims.width || 0) / 2;
            const halfD = (dims.depth || 0) / 2;
            minX = Math.min(minX, pos.x - halfW);
            maxX = Math.max(maxX, pos.x + halfW);
            minZ = Math.min(minZ, pos.z - halfD);
            maxZ = Math.max(maxZ, pos.z + halfD);
        });

        if (!isFinite(minX) || !isFinite(minZ)) return;

        const margin = 50;
        const halfWidth = Math.max((maxX - minX) / 2 + margin, 300);
        const halfDepth = Math.max((maxZ - minZ) / 2 + margin, 300);

        const extent = Math.max(halfWidth, halfDepth);
        const centerX = (minX + maxX) / 2 || 0;
        const centerZ = (minZ + maxZ) / 2 || 0;

        if (this.sunLight.target) {
            this.sunLight.target.position.set(centerX, 0, centerZ);
        }

        this.sunLight.shadow.camera.left = -extent;
        this.sunLight.shadow.camera.right = extent;
        this.sunLight.shadow.camera.top = extent;
        this.sunLight.shadow.camera.bottom = -extent;
        this.sunLight.shadow.camera.far = Math.max(this.sunLight.shadow.camera.far || 2000, 2000);
        this.sunLight.shadow.camera.updateProjectionMatrix();
        console.log('Updated sun shadow frustum to extent:', extent, 'center:', centerX, centerZ);
    }
    
    getSolarColor(irradiation) {
        // Color mapping based on solar irradiation
        const colors = {
            low: 0x440154,      // Dark purple (0-400)
            medium: 0x31688e,    // Blue (400-800)
            high: 0x35b779,     // Green (800-1200)
            veryHigh: 0xfde725   // Yellow (1200+)
        };
        
        if (irradiation < 400) return colors.low;
        if (irradiation < 800) return colors.medium;
        if (irradiation < 1200) return colors.high;
        return colors.veryHigh;
    }
    
    updateVisualization() {
        const mode = document.getElementById('visualizationMode').value;
        const colorScheme = document.getElementById('colorScheme').value;
        
        // Update legend based on mode
        this.updateLegend(mode);
        
        this.buildings.forEach(building => {
            const mesh = building.mesh;
            const userData = mesh.userData;
            
            let value, color;
            
            switch (mode) {
                case 'irradiation':
                    value = userData.avgIrradiation;
                    break;
                case 'efficiency':
                    value = Math.min(userData.avgIrradiation / 1500 * 100, 100);
                    break;
                case 'area':
                    value = userData.totalArea;
                    break;
                case 'tilt':
                    value = userData.roofSurfaces.reduce((sum, s) => sum + s.tilt, 0) / userData.roofSurfaces.length;
                    break;
            }
            
            color = this.getColorByScheme(value, colorScheme, mode);
            if (mesh.material && mesh.material.color) {
                mesh.material.color.setHex(color);
            }
        });
    }
    
    updateLegend(mode) {
        const legendTitle = document.getElementById('legend-title');
        const legendContent = document.getElementById('legend-content');
        const colorScheme = document.getElementById('colorScheme').value;
        
        let title, legendItems;
        
        // Generate colors using the selected color scheme
        const getLegendColor = (value) => {
            return this.getColorByScheme(value, colorScheme, mode);
        };
        
        switch (mode) {
            case 'irradiation':
                title = 'Solar Irradiation';
                legendItems = [
                    { color: getLegendColor(200), label: 'Low (0-400 kWh/m²)' },
                    { color: getLegendColor(600), label: 'Medium (400-800 kWh/m²)' },
                    { color: getLegendColor(1000), label: 'High (800-1200 kWh/m²)' },
                    { color: getLegendColor(1400), label: 'Very High (1200+ kWh/m²)' }
                ];
                break;
            case 'efficiency':
                title = 'Solar Efficiency';
                legendItems = [
                    { color: getLegendColor(12.5), label: 'Low (0-25%)' },
                    { color: getLegendColor(37.5), label: 'Medium (25-50%)' },
                    { color: getLegendColor(62.5), label: 'High (50-75%)' },
                    { color: getLegendColor(87.5), label: 'Very High (75-100%)' }
                ];
                break;
            case 'area':
                title = 'Roof Area';
                legendItems = [
                    { color: getLegendColor(50), label: 'Small (0-100 m²)' },
                    { color: getLegendColor(300), label: 'Medium (100-500 m²)' },
                    { color: getLegendColor(750), label: 'Large (500-1000 m²)' },
                    { color: getLegendColor(1500), label: 'Very Large (1000+ m²)' }
                ];
                break;
            case 'tilt':
                title = 'Roof Tilt';
                legendItems = [
                    { color: getLegendColor(7.5), label: 'Flat (0-15°)' },
                    { color: getLegendColor(22.5), label: 'Low (15-30°)' },
                    { color: getLegendColor(37.5), label: 'Medium (30-45°)' },
                    { color: getLegendColor(67.5), label: 'Steep (45+°)' }
                ];
                break;
        }
        
        legendTitle.textContent = title;
        legendContent.innerHTML = legendItems.map(item => 
            `<div class="legend-item">
                <div class="legend-color" style="background: #${item.color.toString(16).padStart(6, '0')};"></div>
                <span class="legend-label">${item.label}</span>
            </div>`
        ).join('');
    }
    
    getColorByScheme(value, scheme, mode) {
        // Normalize value based on mode
        let normalizedValue;
        
        switch (mode) {
            case 'irradiation':
                normalizedValue = Math.min(value / 1500, 1);
                break;
            case 'efficiency':
                normalizedValue = value / 100;
                break;
            case 'area':
                normalizedValue = Math.min(value / 2000, 1); // Max 2000 m² for realistic buildings
                break;
            case 'tilt':
                normalizedValue = value / 90;
                break;
        }
        
        // Apply color scheme
        switch (scheme) {
            case 'heatmap':
                return this.heatMapColor(normalizedValue);
            case 'viridis':
                return this.viridisColor(normalizedValue);
            case 'plasma':
                return this.plasmaColor(normalizedValue);
            case 'rainbow':
                return this.rainbowColor(normalizedValue);
            default:
                return this.heatMapColor(normalizedValue);
        }
    }
    
    heatMapColor(value) {
        // Heat map color interpolation
        const colors = [
            { r: 0, g: 0, b: 255 },    // Blue
            { r: 0, g: 255, b: 255 },   // Cyan
            { r: 0, g: 255, b: 0 },     // Green
            { r: 255, g: 255, b: 0 },   // Yellow
            { r: 255, g: 0, b: 0 }      // Red
        ];
        
        const scaledValue = value * (colors.length - 1);
        const index = Math.floor(scaledValue);
        const fraction = scaledValue - index;
        
        if (index >= colors.length - 1) {
            return this.rgbToHex(colors[colors.length - 1]);
        }
        
        const color1 = colors[index];
        const color2 = colors[index + 1];
        
        const r = Math.round(color1.r + (color2.r - color1.r) * fraction);
        const g = Math.round(color1.g + (color2.g - color1.g) * fraction);
        const b = Math.round(color1.b + (color2.b - color1.b) * fraction);
        
        return this.rgbToHex({ r, g, b });
    }
    
    viridisColor(value) {
        // Simplified viridis color mapping
        const r = Math.round(68 + (253 - 68) * value);
        const g = Math.round(1 + (231 - 1) * value);
        const b = Math.round(84 + (37 - 84) * value);
        return this.rgbToHex({ r, g, b });
    }
    
    plasmaColor(value) {
        // Simplified plasma color mapping
        const r = Math.round(13 + (240 - 13) * value);
        const g = Math.round(8 + (249 - 8) * value);
        const b = Math.round(135 + (33 - 135) * value);
        return this.rgbToHex({ r, g, b });
    }
    
    rainbowColor(value) {
        // Rainbow color mapping
        const hue = value * 360;
        return this.hslToHex(hue, 100, 50);
    }
    
    rgbToHex(rgb) {
        return ((rgb.r << 16) | (rgb.g << 8) | rgb.b);
    }
    
    hslToHex(h, s, l) {
        const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l / 100 - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        return this.rgbToHex({ r, g, b });
    }
    
    setupEventListeners() {
        // Mouse events for building selection
        this.renderer.domElement.addEventListener('click', (event) => {
            this.onMouseClick(event);
        });
        
        // Control panel events
        document.getElementById('visualizationMode').addEventListener('change', () => {
            this.updateVisualization();
        });
        
        document.getElementById('colorScheme').addEventListener('change', () => {
            this.updateVisualization();
        });
    }
    
    onMouseClick(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        for (let i = 0; i < intersects.length; i++) {
            let object = intersects[i].object;
            // Traverse up to find the parent group which is the building
            while (object.parent && !object.userData.type) {
                object = object.parent;
            }

            if (object.userData.type === 'building') {
                // Pin the info panel on click so the user can inspect details
                this.infoPinned = true;
                // store selected building so we can update it in realtime
                this.selectedBuilding = object;
                this.displayBuildingInfo(object.userData);
                return; // Stop at the first building found
            }
        }
        // If no building is clicked, hide the info panel and clear selection
        const p = document.getElementById('info-panel'); if (p) p.style.display = 'none';
        this.selectedBuilding = null;
        this.infoPinned = false;
    }

    displayBuildingInfo(data) {
        const infoPanel = document.getElementById('info-panel');
        if (!infoPanel) return;

        const bid = document.getElementById('info-building-id');
        const avg = document.getElementById('info-avg-irr');
        const area = document.getElementById('info-total-area');
        const annual = document.getElementById('info-annual-potential');
        const instant = document.getElementById('info-instant-potential');
        const rc = document.getElementById('info-roof-count');

        const totalIrradiation = data.roofSurfaces.reduce((sum, s) => sum + (s.totalIrradiation || 0), 0);
        const instantIrr = data.roofSurfaces.reduce((sum, s) => sum + (s.currentIrradiation || 0) * (s.area || 0), 0);
        const totalArea = data.totalArea || data.roofSurfaces.reduce((s, r) => s + (r.area || 0), 0);

        if (bid) bid.textContent = data.buildingData.id || '--';
        if (avg) avg.textContent = (data.avgIrradiation || 0).toFixed(0) + ' kWh/m²';
        if (area) area.textContent = totalArea.toFixed(0) + ' m²';
        if (annual) annual.textContent = ((totalIrradiation || 0) / 1000).toFixed(1) + ' MWh/yr';
        if (instant) instant.textContent = (instantIrr / 1000).toFixed(3) + ' kWh';
        if (rc) rc.textContent = (data.roofSurfaces.length || 0);

        infoPanel.style.display = 'block';
        // clear previous hide timer
        if (this._infoHideTimer) {
            clearTimeout(this._infoHideTimer);
            this._infoHideTimer = null;
        }
        if (!this.infoPinned) {
            this._infoHideTimer = setTimeout(() => {
                closeInfoPanel();
            }, this.infoAutoHideMs);
        }
        // update pin button state (if present)
        const pinBtn = document.getElementById('infoPinBtn');
        if (pinBtn) {
            pinBtn.textContent = this.infoPinned ? 'Pinned' : 'Pin';
            pinBtn.style.background = this.infoPinned ? '#4CAF50' : '#f0ad4e';
        }

        // Additional derived metrics
        // instantaneous power estimate (assume irradiation in kWh/m2 over an hour -> instant kW ~ kWh)
        const instantKW = instantIrr; // kWh over the roof area at this instant approximation
        // hourly and daily approximations
        const hourlyKWh = instantKW; // approx kWh current hour
        const dailyKWh = hourlyKWh * 6; // crude daytime approx (6 effective hours)
        const dailyMWh = dailyKWh / 1000;

        const instElem = document.getElementById('info-instant-potential');
        if (instElem) instElem.textContent = instantKW.toFixed(2) + ' kWh';

        // small sparkline showing per-roof current irradiation (normalized)
        const sparkContainerId = 'info-sparkline';
        let spark = document.getElementById(sparkContainerId);
        if (!spark) {
            spark = document.createElement('div');
            spark.id = sparkContainerId;
            spark.style.marginTop = '8px';
            infoPanel.appendChild(spark);
        }
        // build simple sparkline data
        const sparkData = data.roofSurfaces.map(s => (s.currentIrradiation || s.irradiation || 0));
        const max = Math.max(1, ...sparkData);
        const w = 160, h = 32;
        const points = sparkData.map((v, i) => {
            const x = (i / Math.max(1, sparkData.length - 1)) * w;
            const y = h - (v / max) * h;
            return `${x},${y}`;
        }).join(' ');
        spark.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
            <polyline points="${points}" fill="none" stroke="#667eea" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        </svg>`;
    }

    // Update the visible info panel values for the currently selected building (used for realtime updates)
    refreshSelectedBuildingInfo() {
    if (!this.selectedBuilding) return;
    const user = this.selectedBuilding.userData;
    if (!user) return;

    const data = user; // userData already contains building aggregates

    const bid = document.getElementById('info-building-id');
    const avg = document.getElementById('info-avg-irr');
    const area = document.getElementById('info-total-area');
    const annual = document.getElementById('info-annual-potential');
    const instantKw = document.getElementById('info-instant-kw');
    const hourly = document.getElementById('info-hourly-kwh');
    const daily = document.getElementById('info-daily-kwh');
    const rc = document.getElementById('info-roof-count');

    const totalIrradiation = (data.roofSurfaces || []).reduce((sum, s) => sum + (s.totalIrradiation || 0), 0);
    const instantIrr = (data.roofSurfaces || []).reduce((sum, s) => sum + ((s.currentIrradiation || 0) * (s.area || 0)), 0);
    const totalArea = data.totalArea || (data.roofSurfaces || []).reduce((s, r) => s + (r.area || 0), 0);

    if (bid) bid.textContent = (data.buildingData && data.buildingData.id) || '--';
    if (avg) avg.textContent = (data.avgIrradiation || 0).toFixed(0) + ' kWh/m²';
    if (area) area.textContent = totalArea.toFixed(0) + ' m²';
    if (annual) annual.textContent = ((totalIrradiation || 0) / 1000).toFixed(1) + ' MWh/yr';

    // For display, treat currentIrradiation as kWh/m² for the current hour estimate; convert to kW by dividing by 1 hour (kWh/h ~= kW)
    const powerKW = instantIrr / 1.0; // kW over area (since instantIrr is kWh for the hour)
    const hourlyKWh = instantIrr; // approx kWh for current hour
    const daylightHoursElem = document.getElementById('daylightHours');
    const daylightHours = daylightHoursElem ? Number(daylightHoursElem.value) : 6;
    const dailyKWh = hourlyKWh * daylightHours;

    if (instantKw) instantKw.textContent = isFinite(powerKW) ? powerKW.toFixed(2) + ' kW' : '-- kW';
    if (hourly) hourly.textContent = isFinite(hourlyKWh) ? hourlyKWh.toFixed(2) + ' kWh' : '-- kWh';
    if (daily) daily.textContent = isFinite(dailyKWh) ? dailyKWh.toFixed(2) + ' kWh' : '-- kWh';
    if (rc) rc.textContent = (data.roofSurfaces ? data.roofSurfaces.length : 0);
    }
    
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    resetView() {
        this.camera.position.set(100, 100, 100);
        this.controls.reset();
    }
}

// Global functions for UI
let visualizer;

function closeInfoPanel() {
    const p = document.getElementById('info-panel');
    if (p) p.style.display = 'none';
    if (visualizer) {
        visualizer.infoPinned = false;
        if (visualizer._infoHideTimer) { clearTimeout(visualizer._infoHideTimer); visualizer._infoHideTimer = null; }
        // clear selection when panel is closed
        visualizer.selectedBuilding = null;
        // update pin button state
        const pinBtn = document.getElementById('infoPinBtn');
        if (pinBtn) { pinBtn.textContent = 'Pin'; pinBtn.style.background = '#f0ad4e'; }
    }
}

// Toggle the info panel pin state (called by the Pin button in the UI)
function toggleInfoPin() {
    if (!visualizer) return;
    visualizer.infoPinned = !visualizer.infoPinned;
    // update button appearance
    const pinBtn = document.getElementById('infoPinBtn');
    if (pinBtn) {
        if (visualizer.infoPinned) {
            pinBtn.textContent = 'Pinned';
            pinBtn.style.background = '#4CAF50';
        } else {
            pinBtn.textContent = 'Pin';
            pinBtn.style.background = '#f0ad4e';
        }
    }
}

// Realtime hover: update info panel as mouse moves over buildings
document.addEventListener('mousemove', function (event) {
    if (!visualizer || !visualizer.camera) return;
    const rect = visualizer.renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    visualizer.raycaster.setFromCamera({ x: x, y: y }, visualizer.camera);
    const intersects = visualizer.raycaster.intersectObjects(visualizer.scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        let object = intersects[i].object;
        while (object.parent && !object.userData.type) {
            object = object.parent;
        }
        if (object.userData && object.userData.type === 'building') {
            // update panel with latest computed values
            visualizer.displayBuildingInfo(object.userData);
            return;
        }
    }
    // If not hovering any building, hide panel
    // (optional: keep shown until clicked)
    // closeInfoPanel();
});

function loadData() {
    const fileInput = document.getElementById('dataFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a data file first!');
        return;
    }
    
    if (!visualizer) {
        alert('Visualizer not initialized. Please refresh the page.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Check if data has the expected structure
            if (!data.buildings || !Array.isArray(data.buildings)) {
                throw new Error('Invalid data format. Expected "buildings" array.');
            }
            
            visualizer.loadBuildings(data.buildings);
            document.getElementById('loading').style.display = 'none';
        } catch (error) {
            alert('Error loading data: ' + error.message);
            document.getElementById('loading').style.display = 'none';
        }
    };
    
    document.getElementById('loading').style.display = 'block';
    reader.readAsText(file);
}

function resetView() {
    if (visualizer) {
        visualizer.resetView();
    } else {
        alert('Visualizer not initialized. Please refresh the page.');
    }
}

// Zoom out the camera by moving it further from the scene center.
function zoomOut() {
    if (!visualizer || !visualizer.camera) return;

    const cam = visualizer.camera;
    // Compute vector from target (0,0,0) to camera and scale it
    const dir = new THREE.Vector3().copy(cam.position).sub(new THREE.Vector3(0,0,0));
    const distance = dir.length();
    const scale = 1.5; // multiply current distance by this factor
    const newPos = dir.normalize().multiplyScalar(distance * scale);

    // Smoothly move camera over short animation
    const start = cam.position.clone();
    const end = newPos.clone();
    const duration = 300; // ms
    const t0 = performance.now();

    function step() {
        const t = Math.min(1, (performance.now() - t0) / duration);
        cam.position.lerpVectors(start, end, t);
        cam.lookAt(0,0,0);
        if (visualizer.controls && typeof visualizer.controls.update === 'function') visualizer.controls.update();
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // update stored default pos if controls store it (so resetView remains meaningful)
    if (visualizer.controls && visualizer.controls._defaultPos) {
        visualizer.controls._defaultPos = cam.position.clone();
    }
}

// Zoom in by moving camera closer to scene center
function zoomIn() {
    if (!visualizer || !visualizer.camera) return;
    const cam = visualizer.camera;
    const dir = new THREE.Vector3().copy(cam.position).sub(new THREE.Vector3(0,0,0));
    const distance = dir.length();
    const scale = 0.66; // reduce distance to ~2/3
    const newPos = dir.normalize().multiplyScalar(Math.max(1, distance * scale));

    const start = cam.position.clone();
    const end = newPos.clone();
    const duration = 250;
    const t0 = performance.now();
    function step() {
        const t = Math.min(1, (performance.now() - t0) / duration);
        cam.position.lerpVectors(start, end, t);
        cam.lookAt(0,0,0);
        if (visualizer.controls && typeof visualizer.controls.update === 'function') visualizer.controls.update();
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    if (visualizer.controls && visualizer.controls._defaultPos) {
        visualizer.controls._defaultPos = cam.position.clone();
    }
}

// Keyboard shortcuts: P -> toggle pin, + or = -> zoom in, - -> zoom out
document.addEventListener('keydown', function (e) {
    // ignore when typing into inputs
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

    if (e.key === 'p' || e.key === 'P') {
        toggleInfoPin();
    } else if (e.key === '+' || e.key === '=' ) {
        zoomIn();
    } else if (e.key === '-') {
        zoomOut();
    }
});

// Bridge for the UI sliders in index.html
function changeSun(elevation, azimuth) {
    if (visualizer && typeof visualizer.changeSun === 'function') {
        visualizer.changeSun(elevation, azimuth);
    } else {
        console.warn('Visualizer not ready yet — changeSun ignored');
    }
}

// Enable/disable occlusion (shadows)
function setOcclusion(enabled) {
    if (!visualizer) return;
    visualizer.enableOcclusion = !!enabled;
    // Recompute immediately
    visualizer.updateIrradiationForSun();
    visualizer.updateVisualization();
}

// Toggle sun animation (sweep azimuth across the sky)
function toggleSunAnimation() {
    if (!visualizer) return;
    const anim = visualizer._sunAnimation;
    anim.playing = !anim.playing;
    const btn = document.getElementById('animateSunBtn');
    if (btn) btn.textContent = anim.playing ? 'Pause Sun' : 'Play Sun';

    if (anim.playing) {
        requestAnimationFrame(stepSunAnimation);
    }
}

function stepSunAnimation() {
    if (!visualizer) return;
    const anim = visualizer._sunAnimation;
    if (!anim.playing) return;

    // advance azimuth; keep elevation constant (or could vary)
    anim.currentAz = (anim.currentAz + anim.speed) % 360;
    visualizer.changeSun(anim.currentEl, anim.currentAz);

    requestAnimationFrame(stepSunAnimation);
}

// Set sun animation speed
function setSunSpeed(val) {
    if (!visualizer) return;
    visualizer._sunAnimation.speed = Number(val);
}

function setElevationSweepEnabled(enabled) {
    if (!visualizer) return;
    visualizer._sunAnimation.elevSweep.enabled = !!enabled;
}

function setElevationRange() {
    if (!visualizer) return;
    const min = Number(document.getElementById('elevMin').value);
    const max = Number(document.getElementById('elevMax').value);
    visualizer._sunAnimation.elevSweep.min = Math.min(min, max);
    visualizer._sunAnimation.elevSweep.max = Math.max(min, max);
}

function setOcclusionSamples(n) {
    if (!visualizer) return;
    visualizer.occlusionSamples = Math.max(1, Math.min(9, parseInt(n, 10) || 1));
}

// Set effective daylight hours used for daily estimates
function setDaylightHours(val) {
    const v = Number(val) || 0;
    const elem = document.getElementById('daylightHours');
    if (elem) elem.value = v;
    // refresh info panel if a building is selected
    if (visualizer && visualizer.selectedBuilding) {
        visualizer.refreshSelectedBuildingInfo();
    }
}

// Set the info panel auto-hide timeout (ms)
function setInfoAutoHide(ms) {
    const m = Number(ms) || 0;
    if (visualizer) visualizer.infoAutoHideMs = m;
}

// Simple status update
function updateStatusPanel(buildings, elevation, azimuth) {
    const b = document.getElementById('status-buildings');
    const e = document.getElementById('status-elevation');
    const a = document.getElementById('status-azimuth');
    if (b) b.textContent = 'Buildings: ' + buildings;
    if (e) e.textContent = 'Elevation: ' + Number(elevation).toFixed(1) + '°';
    if (a) a.textContent = 'Azimuth: ' + Number(azimuth).toFixed(1) + '°';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        visualizer = new SunMapVisualizer();
        console.log('SunMap visualizer initialized successfully');
    } catch (error) {
        console.error('Error initializing visualizer:', error);
        alert('Error initializing 3D visualizer: ' + error.message);
    }
});
