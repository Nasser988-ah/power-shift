import * as THREE from "three";
import { DISPLAYS, ROOM, getProduct, loadImageCached } from "../data/products.js";

const texLoader = new THREE.TextureLoader();

const sharedStone = new THREE.MeshStandardMaterial({
  color: 0xf0e8db,
  roughness: 0.48,
  metalness: 0.06,
});
const sharedBrass = new THREE.MeshStandardMaterial({
  color: 0xc4a06a,
  roughness: 0.35,
  metalness: 0.8,
});
const blobMat = new THREE.MeshBasicMaterial({
  color: 0x2a211c,
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
});
const railGeo = new THREE.BoxGeometry(0.28, 0.014, 0.014);
const blobGeo = new THREE.CircleGeometry(0.36, 20);
const ringGeo = new THREE.RingGeometry(0.3, 0.34, 24);
const labelGeo = new THREE.PlaneGeometry(0.52, 0.1);

const pedGeo = {
  base: new THREE.CylinderGeometry(0.28, 0.32, 0.05, 16),
  column: new THREE.CylinderGeometry(0.15, 0.17, 0.38, 16),
  top: new THREE.CylinderGeometry(0.32, 0.28, 0.035, 16),
  ring: new THREE.TorusGeometry(0.29, 0.009, 6, 20),
};

const PEDESTAL_TOP_Y = 0.5;
const UNIT_PLANE = new THREE.PlaneGeometry(1, 1);

function loadTextureFromUrl(url) {
  return new Promise((resolve, reject) => {
    texLoader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 1;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

function makePedestal() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(pedGeo.base, sharedStone);
  base.position.y = 0.025;
  const column = new THREE.Mesh(pedGeo.column, sharedStone);
  column.position.y = 0.245;
  const top = new THREE.Mesh(pedGeo.top, sharedStone);
  top.position.y = 0.455;
  const ring = new THREE.Mesh(pedGeo.ring, sharedBrass);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.475;
  g.add(base, column, top, ring);
  return g;
}

function makeLabelTexture(text, muted = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = muted ? "rgba(90,72,58,0.75)" : "rgba(46,34,28,0.88)";
  ctx.fillRect(0, 0, 256, 48);
  ctx.fillStyle = "#f7f3ec";
  ctx.font = "500 18px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const short = text.length > 18 ? `${text.slice(0, 16)}…` : text;
  ctx.fillText(short, 128, 24);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function fitPanelSize(aspect, maxW = 0.72, maxH = 1.05) {
  let w = maxW;
  let h = w / Math.max(aspect, 0.01);
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { w, h };
}

/**
 * 20 perimeter displays — shared pedestal materials/geometry, progressive textures.
 */
export async function placeDisplayCollection(scene, camera, canvas, quality, onProgress, hooks = {}) {
  const displays = [];
  const pickMeshes = [];
  const obstacles = [];
  const root = new THREE.Group();
  root.name = "displays";
  scene.add(root);

  // Shared hover ring material cloned per display for independent opacity
  const placeholderPlaneMat = new THREE.MeshBasicMaterial({
    color: 0xc4b5a2,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < DISPLAYS.length; i++) {
    const slot = DISPLAYS[i];
    const product = getProduct(slot.productId);
    if (!product) continue;
    onProgress?.(0.3 + (i / DISPLAYS.length) * 0.65, `Staging ${product.name}`);

    const stand = new THREE.Group();
    stand.position.set(slot.x, 0, slot.z);
    stand.rotation.y = slot.yawFace;
    stand.add(makePedestal());

    // Contact blob shadow (cheap, static)
    const blob = new THREE.Mesh(blobGeo, blobMat);
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.008;
    stand.add(blob);

    const mount = new THREE.Group();
    mount.position.y = PEDESTAL_TOP_Y;
    stand.add(mount);

    const rail = new THREE.Mesh(railGeo, sharedBrass);
    rail.position.y = 0.025;
    mount.add(rail);

    const labelTex = makeLabelTexture(
      product.placeholder ? "Coming soon" : product.name,
      product.placeholder
    );
    const label = new THREE.Mesh(
      labelGeo,
      new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, depthWrite: false })
    );
    label.position.set(0, 0.08, 0.14);
    mount.add(label);

    const hover = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xc9a86c,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    hover.rotation.x = -Math.PI / 2;
    hover.position.y = 0.01;
    stand.add(hover);

    // Photo plane — sized after texture loads; start as soft placeholder card
    const photo = new THREE.Mesh(
      UNIT_PLANE,
      product.placeholder
        ? placeholderPlaneMat.clone()
        : new THREE.MeshBasicMaterial({
            color: 0xe8dfd2,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            side: THREE.DoubleSide,
            toneMapped: false,
          })
    );
    // Rest on pedestal top: center of panel sits above plate with small gap
    photo.scale.set(0.55, 0.85, 1);
    photo.position.set(0, 0.45, 0.02);
    photo.userData.productId = product.id;
    mount.add(photo);
    pickMeshes.push(photo);

    root.add(stand);
    obstacles.push({ x: slot.x, z: slot.z, r: ROOM.pedestalRadius });

    displays.push({
      product,
      slot,
      stand,
      photo,
      hover,
      hovered: false,
      texLoaded: false,
    });
  }

  // Progressive scene-image load (does not block walkability)
  let loadIndex = 0;
  async function loadNextTexture() {
    if (loadIndex >= displays.length) return;
    const d = displays[loadIndex++];
    const url = d.product.sceneImage;
    try {
      await loadImageCached(url);
      const tex = await loadTextureFromUrl(url);
      const img = tex.image;
      const aspect = (img?.width || 3) / (img?.height || 4);
      const { w, h } = fitPanelSize(aspect);
      d.photo.scale.set(w, h, 1);
      // Bottom of cutout sits just above pedestal top plate
      d.photo.position.y = h / 2 + 0.04;
      if (d.photo.material.map) d.photo.material.map.dispose();
      d.photo.material.map = tex;
      d.photo.material.color.set(0xffffff);
      d.photo.material.transparent = true;
      d.photo.material.alphaTest = 0.12;
      d.photo.material.opacity = 1;
      d.photo.material.needsUpdate = true;
      d.texLoaded = true;
    } catch {
      d.photo.material.color.set(0xb89a78);
      d.photo.material.opacity = 0.4;
    }
    // Yield to main thread between loads
    await new Promise((r) => setTimeout(r, 0));
    loadNextTexture();
  }
  // Kick a few parallel loaders without flooding
  loadNextTexture();
  loadNextTexture();
  loadNextTexture();

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pendingId = null;
  let downId = null;
  let moved = false;
  let downX = 0;
  let downY = 0;
  let hoverRaf = 0;

  function setPointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function pickId(e) {
    setPointerFromEvent(e);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickMeshes, false);
    if (!hits.length) return null;
    return hits[0].object.userData.productId || null;
  }

  function onMoveHover(e) {
    if (hoverRaf) return;
    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = 0;
      const id = pickId(e);
      for (let i = 0; i < displays.length; i++) {
        displays[i].hovered = displays[i].product.id === id;
      }
      canvas.style.cursor = id ? "pointer" : "";
    });
  }

  function onDown(e) {
    if (e.button != null && e.button !== 0) return;
    const id = pickId(e);
    if (!id) return;
    e.stopPropagation();
    hooks.onInspectStart?.();
    downId = id;
    moved = false;
    downX = e.clientX;
    downY = e.clientY;
  }

  function onMove(e) {
    if (!downId) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 12) moved = true;
  }

  function onUp(e) {
    if (!downId) return;
    const startId = downId;
    const didMove = moved;
    downId = null;
    hooks.onInspectEnd?.();
    const endId = pickId(e) || startId;
    pendingId = !didMove ? endId : null;
  }

  canvas.addEventListener("pointermove", onMoveHover, { passive: true });
  canvas.addEventListener("pointerdown", onDown, { capture: true });
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp);

  function update(_now, dt) {
    const k = Math.min(1, dt * 12);
    for (let i = 0; i < displays.length; i++) {
      const d = displays[i];
      const mat = d.hover.material;
      const goal = d.hovered ? 0.55 : 0;
      mat.opacity += (goal - mat.opacity) * k;
    }
  }

  function consumeClick() {
    const id = pendingId;
    pendingId = null;
    if (!id) return null;
    return getProduct(id);
  }

  function isInspecting() {
    return !!downId;
  }

  function getObstacles() {
    return obstacles;
  }

  function getViewFor(productId) {
    const slot = DISPLAYS.find((d) => d.productId === productId);
    return slot?.view || null;
  }

  return { update, consumeClick, isInspecting, getObstacles, getViewFor, displays };
}
