import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function HouseModel({ mode = 'morning' }) {
  // Load the GLTF/GLB asset
  const { scene } = useGLTF('/models/house.glb');

  // Clone scene to avoid shared mutation
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const emissiveMaterialsRef = useRef([]);
  const groupRef = useRef(null);

  // Auto-center and fit the model to a target bounding size of ~5.0
  useEffect(() => {
    if (!clonedScene) return;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 5.2 / maxDim : 1.0;

    // Center model at (0, 0, 0) with bottom aligned to y=0
    clonedScene.position.set(
      -center.x * targetScale,
      -box.min.y * targetScale,
      -center.z * targetScale
    );
    clonedScene.scale.setScalar(targetScale);

    emissiveMaterialsRef.current = [];

    // Traverse and optimize PBR materials
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (!mat) return;

        const matName = (mat.name || '').toLowerCase();
        const meshName = (child.name || '').toLowerCase();

        // 1. Solar Panels: High specular reflection & dark antireflective glass
        if (matName.includes('solar') || meshName.includes('solar')) {
          mat.metalness = 0.95;
          mat.roughness = 0.1;
          mat.needsUpdate = true;
        }

        // 2. Window Glass & Interior Sconces (Emissive Night Lighting)
        if (
          matName.includes('window') ||
          matName.includes('glass') ||
          matName.includes('soffit') ||
          matName.includes('emiss') ||
          meshName.includes('window') ||
          meshName.includes('glass')
        ) {
          if (!matName.includes('solar') && !meshName.includes('solar')) {
            mat.emissive = new THREE.Color('#ffaa33');
            mat.emissiveIntensity = mode === 'night' ? 2.5 : 0.0;
            mat.roughness = 0.05;
            mat.needsUpdate = true;
            emissiveMaterialsRef.current.push(mat);
          }
        }

        // 3. Stucco Walls & Dark Charcoal Roof
        if (matName.includes('wall') || meshName.includes('stucco')) {
          mat.roughness = 0.75;
          mat.metalness = 0.02;
          mat.needsUpdate = true;
        }
        if (matName.includes('roof')) {
          mat.roughness = 0.35;
          mat.metalness = 0.65;
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  // GSAP Smooth Night / Morning Emissive Lighting
  useEffect(() => {
    const isNight = mode === 'night';
    const duration = 1.2;
    const ease = 'power2.inOut';

    emissiveMaterialsRef.current.forEach((mat) => {
      gsap.to(mat, {
        emissiveIntensity: isNight ? 2.5 : 0.0,
        duration,
        ease
      });
    });
  }, [mode]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the GLB model asset
useGLTF.preload('/models/house.glb');
