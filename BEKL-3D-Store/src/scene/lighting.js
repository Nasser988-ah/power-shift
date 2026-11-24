import * as THREE from "three";

/** Calm warm lighting — no per-product spotlights, no moving shadows. */
export function addLighting(scene, quality) {
  // Soft warm volume — keeps upper walls from bleaching white
  const hemi = new THREE.HemisphereLight(0xe8dcc8, 0x6e5e4e, 0.72);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xf2e2c8, quality.tier === "low" ? 0.8 : 0.9);
  key.position.set(1.4, 4.8, 2.0);
  key.castShadow = false;
  scene.add(key);

  if (quality.tier !== "low") {
    const fill = new THREE.DirectionalLight(0xd8c4a8, 0.22);
    fill.position.set(-2.2, 2.8, -1.0);
    scene.add(fill);
  }

  return { key };
}
