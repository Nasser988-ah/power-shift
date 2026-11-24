import * as THREE from "three";
import { CATEGORY_SIGNS } from "../data/products.js";

const plaster = 0xe8dfd0; // warm wall — avoids a washed-out white upper room
const wood = 0x6b4f3a;
const darkWood = 0x3d2c22;
const stone = 0xe0d4c4;

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.85,
    metalness: opts.metalness ?? 0.02,
    ...opts,
  });
}

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  mesh.castShadow = false;
  return mesh;
}

function makeSignTexture(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 512, 96);
  ctx.fillStyle = "rgba(46,34,28,0.82)";
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = "rgba(196,160,106,0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 496, 80);
  ctx.fillStyle = "#f7f3ec";
  ctx.font = "500 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 50);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Expanded cream/brown showroom shell for 20 perimeter displays. */
export function buildBoutique(scene) {
  const group = new THREE.Group();
  group.name = "boutique";

  const wallMat = mat(plaster, { roughness: 0.92 });
  const woodMat = mat(wood, { roughness: 0.5 });
  const darkMat = mat(darkWood, { roughness: 0.45 });
  const floorMat = mat(stone, { roughness: 0.58, metalness: 0.06 });
  const glassMat = new THREE.MeshBasicMaterial({
    color: 0xdde6ea,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const W = 10.6;
  const D = 9.0;
  const H = 2.9;

  group.add(box(W, 0.08, D, floorMat, 0, -0.04, 0.15));

  // Soft aisle glow (static, cheap)
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 7.2),
    new THREE.MeshBasicMaterial({
      color: 0xffe9c8,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, 0.012, 0.1);
  group.add(glow);

  // Warm taupe ceiling — toneMapped off so ACES doesn't bleach it white
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(W, 0.1, D),
    new THREE.MeshBasicMaterial({ color: 0xcbb9a2, toneMapped: false })
  );
  ceiling.position.set(0, H, 0.15);
  group.add(ceiling);
  group.add(box(W, H, 0.12, wallMat, 0, H / 2, -D / 2 + 0.15)); // back
  group.add(box(0.12, H, D, wallMat, -W / 2, H / 2, 0.15));
  group.add(box(0.12, H, D, wallMat, W / 2, H / 2, 0.15));

  const trim = mat(0xb89a78, { roughness: 0.6 });
  group.add(box(W - 0.2, 0.1, 0.04, trim, 0, 0.12, -D / 2 + 0.22));
  group.add(box(0.04, 0.1, D - 0.2, trim, -W / 2 + 0.08, 0.12, 0.15));
  group.add(box(0.04, 0.1, D - 0.2, trim, W / 2 - 0.08, 0.12, 0.15));

  const gold = mat(0xc4a06a, { roughness: 0.3, metalness: 0.85 });
  group.add(box(W - 1.2, 0.015, 0.02, gold, 0, 2.4, -D / 2 + 0.22));

  // Front wall with door opening + side windows to the exterior
  const doorW = 2.1;
  const frontZ = D / 2 + 0.05;
  const sideW = (W - doorW) / 2;
  const winW = 1.35;
  const winH = 1.35;
  const winY = 1.45;
  const solidSide = (sideW - winW) / 2;

  function frontSide(sign) {
    const cx = sign * (doorW + sideW) / 2;
    // left/right of window within this side panel
    group.add(box(solidSide, H, 0.12, wallMat, cx - sign * (winW / 2 + solidSide / 2), H / 2, frontZ));
    group.add(box(solidSide, H, 0.12, wallMat, cx + sign * (winW / 2 + solidSide / 2), H / 2, frontZ));
    // above / below window
    const aboveH = H - (winY + winH / 2);
    const belowH = winY - winH / 2;
    group.add(box(winW, aboveH, 0.12, wallMat, cx, winY + winH / 2 + aboveH / 2, frontZ));
    group.add(box(winW, belowH, 0.12, wallMat, cx, belowH / 2, frontZ));
    // glass pane (looks out to exterior)
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(winW * 0.96, winH * 0.96), glassMat);
    pane.position.set(cx, winY, frontZ - 0.01);
    group.add(pane);
    // slim brass window frame
    const frame = mat(0xc4a06a, { roughness: 0.35, metalness: 0.75 });
    group.add(box(winW + 0.06, 0.04, 0.08, frame, cx, winY + winH / 2, frontZ));
    group.add(box(winW + 0.06, 0.04, 0.08, frame, cx, winY - winH / 2, frontZ));
    group.add(box(0.04, winH, 0.08, frame, cx - winW / 2, winY, frontZ));
    group.add(box(0.04, winH, 0.08, frame, cx + winW / 2, winY, frontZ));
  }
  frontSide(-1);
  frontSide(1);

  group.add(box(doorW, 0.5, 0.12, wallMat, 0, H - 0.25, frontZ));
  group.add(box(doorW + 0.12, 0.06, 0.1, darkMat, 0, 2.35, frontZ));
  group.add(box(0.06, 2.25, 0.1, darkMat, -doorW / 2, 1.12, frontZ));
  group.add(box(0.06, 2.25, 0.1, darkMat, doorW / 2, 1.12, frontZ));

  const leafW = doorW / 2 - 0.015;
  const leafH = 2.2;
  const hingeZ = frontZ - 0.02;

  function makeDoor(side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * (doorW / 2 - 0.01), 0, hingeZ);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.035), woodMat);
    leaf.position.set(side * (-leafW / 2), leafH / 2, 0);
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(leafW * 0.78, leafH * 0.7), glassMat);
    pane.position.set(side * (-leafW / 2), leafH / 2 + 0.05, side > 0 ? -0.02 : 0.02);
    pivot.add(leaf, pane);
    group.add(pivot);
    return pivot;
  }

  const doorLeft = makeDoor(-1);
  const doorRight = makeDoor(1);

  // BEKL wall sign — high-res canvas; system fonts so text never paints before webfonts load
  function paintBeklSign(ctx, w, h) {
    ctx.fillStyle = "#2e221c";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#f7f3ec";
    ctx.font = "500 140px Georgia, 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BEKL", w / 2, 155);

    ctx.strokeStyle = "rgba(196, 160, 106, 0.95)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, 240);
    ctx.lineTo(w * 0.7, 240);
    ctx.stroke();

    ctx.fillStyle = "#d8b57f";
    ctx.font = "600 58px Arial, Helvetica, sans-serif";
    ctx.fillText("MEN'S COLLECTION", w / 2, 330);
  }

  const logoCanvas = document.createElement("canvas");
  const lw = 1280;
  const lh = 512;
  logoCanvas.width = lw;
  logoCanvas.height = lh;
  const lctx = logoCanvas.getContext("2d");
  paintBeklSign(lctx, lw, lh);

  const logoTex = new THREE.CanvasTexture(logoCanvas);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  logoTex.anisotropy = 8;
  logoTex.generateMipmaps = true;
  logoTex.minFilter = THREE.LinearMipmapLinearFilter;
  logoTex.magFilter = THREE.LinearFilter;
  logoTex.needsUpdate = true;
  const signW = 2.15;
  const signH = signW * (lh / lw);
  const signMat = new THREE.MeshBasicMaterial({
    map: logoTex,
    toneMapped: false,
    fog: false,
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(signW, signH), signMat);
  sign.position.set(0, 2.35, -D / 2 + 0.22);
  group.add(sign);

  // Category plaques
  CATEGORY_SIGNS.forEach((s) => {
    const tex = makeSignTexture(s.label);
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 0.22),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    plaque.position.set(s.x, s.y, s.z);
    plaque.rotation.y = s.yaw;
    group.add(plaque);
  });

  // Soft cove accent — kept quiet so the ceiling stays warm, not washed out
  const coveMat = new THREE.MeshBasicMaterial({
    color: 0xe8d2a8,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  [-4.9, 4.9].forEach((x) => {
    const cove = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 6.5), coveMat);
    cove.position.set(x, 2.48, 0.1);
    cove.rotation.z = Math.PI / 2;
    group.add(cove);
  });

  scene.add(group);
  return {
    group,
    doors: { left: doorLeft, right: doorRight },
    dims: { W, D, H },
  };
}
