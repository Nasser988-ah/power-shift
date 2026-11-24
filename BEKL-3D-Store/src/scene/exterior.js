import * as THREE from "three";

const LOGO_URL = `${import.meta.env.BASE_URL}images/power-shift-logo.webp`;

const texLoader = new THREE.TextureLoader();

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    texLoader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 1;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

function noFog(mat) {
  mat.fog = false;
  return mat;
}

function makeSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 768);
  g.addColorStop(0.0, "#0f1824");
  g.addColorStop(0.32, "#2a3548");
  g.addColorStop(0.55, "#6b5a4a");
  g.addColorStop(0.72, "#c4a06a");
  g.addColorStop(0.88, "#e6d3b4");
  g.addColorStop(1.0, "#8f7350");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 768);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/** Clean powered-by line — no pill, large type. */
function makeAttributionTexture() {
  const W = 1600;
  const H = 240;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(247, 243, 236, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W * 0.22, 48);
  ctx.lineTo(W * 0.78, 48);
  ctx.stroke();

  ctx.shadowColor = "rgba(10, 12, 18, 0.55)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "#f7f3ec";
  ctx.font = '600 78px "DM Sans", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("powered by power shift", W / 2, 148);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Exterior: dusk sky + official Power Shift logo + powered-by line.
 */
export function createExterior(scene, dims = { W: 10.6, D: 9.0, H: 2.9 }) {
  const group = new THREE.Group();
  group.name = "exterior";

  const frontZ = dims.D / 2 + 0.05;
  const vistaZ = frontZ + 2.2;

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 15),
    noFog(
      new THREE.MeshBasicMaterial({
        map: makeSkyTexture(),
        toneMapped: false,
        depthWrite: false,
      })
    )
  );
  sky.position.set(0, 3.5, vistaZ);
  sky.rotation.y = Math.PI;
  sky.name = "exterior-sky";
  group.add(sky);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 9),
    noFog(
      new THREE.MeshBasicMaterial({
        color: 0x7a6244,
        toneMapped: false,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.01, vistaZ - 1.5);
  group.add(ground);

  const brand = new THREE.Group();
  brand.name = "power-shift-brand";
  brand.position.set(0, 1.55, vistaZ - 0.12);
  brand.rotation.y = Math.PI;

  // Soft cream mat behind the official black-backed logo so it reads as a mark, not a black hole
  const matte = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 1.35),
    noFog(
      new THREE.MeshBasicMaterial({
        color: 0xf3eee4,
        toneMapped: false,
        depthWrite: false,
      })
    )
  );
  matte.position.set(0, 0.2, 0.02);
  brand.add(matte);

  const logoMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 1.2),
    noFog(
      new THREE.MeshBasicMaterial({
        color: 0x12243c,
        transparent: true,
        opacity: 0.35,
        toneMapped: false,
        depthWrite: false,
      })
    )
  );
  logoMesh.name = "logo-plate";
  logoMesh.position.set(0, 0.2, 0.01);
  brand.add(logoMesh);

  const attrMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 0.3),
    noFog(
      new THREE.MeshBasicMaterial({
        map: makeAttributionTexture(),
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      })
    )
  );
  attrMesh.name = "powered-by";
  attrMesh.position.y = -0.78;
  brand.add(attrMesh);

  group.add(brand);
  scene.add(group);

  let logoStatus = "pending";

  async function loadAssets() {
    try {
      const logoTex = await loadTexture(LOGO_URL);
      const aspect = (logoTex.image?.width || 360) / (logoTex.image?.height || 178);
      const logoW = 1.58;
      const logoH = logoW / aspect;
      logoMesh.geometry.dispose();
      logoMesh.geometry = new THREE.PlaneGeometry(logoW, logoH);
      matte.geometry.dispose();
      matte.geometry = new THREE.PlaneGeometry(logoW + 0.14, logoH + 0.14);
      if (logoMesh.material.map) logoMesh.material.map.dispose();
      logoMesh.material.dispose();
      logoMesh.material = noFog(
        new THREE.MeshBasicMaterial({
          map: logoTex,
          transparent: true,
          toneMapped: false,
          depthWrite: false,
        })
      );
      logoStatus = "ok";
    } catch (err) {
      console.warn("BEKL Power Shift logo missing — placeholder shown:", err?.message || err);
      logoStatus = "missing";
    }
  }

  const ready = loadAssets();

  return {
    group,
    backdrop: sky,
    brand,
    ready,
    getLogoStatus: () => logoStatus,
  };
}
