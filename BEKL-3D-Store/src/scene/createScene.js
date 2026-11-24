import * as THREE from "three";

export function createScene(canvas, quality) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    powerPreference: "high-performance",
    alpha: false,
  });
  renderer.setPixelRatio(quality.dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = quality.pixelTone;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e2d6c6");
  scene.fog = new THREE.Fog("#e2d6c6", 10, quality.fogFar + 4);

  const fov = window.innerWidth < 700 ? 72 : 64;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.08, 32);
  // Just outside the entrance doors
  camera.position.set(0, 1.55, 5.35);
  camera.lookAt(0, 1.35, 0);

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.fov = w < 700 ? 72 : 64;
    camera.updateProjectionMatrix();
    const cap = quality.tier === "low" ? 1 : quality.tier === "medium" ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setSize(w, h, false);
  };
  window.addEventListener("resize", onResize);

  return { renderer, scene, camera, onResize };
}
