import { PRODUCTS, ROOM, formatMoney, preloadSceneThumbs, getDisplayForProduct } from "./data/products.js";
import { detectQuality } from "./quality.js";
import { createScene } from "./scene/createScene.js";
import { addLighting } from "./scene/lighting.js";
import { buildBoutique } from "./scene/buildBoutique.js";
import { createExterior } from "./scene/exterior.js";
import { placeDisplayCollection } from "./scene/displayCollection.js";
import { createWalkControls } from "./controls/walkControls.js";
import { createCameraTransition } from "./controls/cameraTransition.js";
import { createCart } from "./ui/cart.js";
import { createProductSheet } from "./ui/productSheet.js";
import { createCatalog } from "./ui/catalog.js";

const $ = (id) => document.getElementById(id);
const quality = detectQuality();
document.body.dataset.quality = quality.tier;

const coarse =
  window.matchMedia("(pointer: coarse)").matches ||
  window.matchMedia("(max-width: 900px)").matches ||
  "ontouchstart" in window;

const canvas = $("view");
const { renderer, scene, camera } = createScene(canvas, quality);
addLighting(scene, quality);
const { doors, dims } = buildBoutique(scene);
const exterior = createExterior(scene, dims);

let obstaclesRef = [];
const controls = createWalkControls(camera, canvas, ROOM.walk, () => obstaclesRef);
controls.bindJoystick($("joystickBase"), $("joystickKnob"), $("lookBase"), $("lookKnob"));
const transition = createCameraTransition(camera, controls.look);

if (coarse) {
  $("walkControls").hidden = false;
  document.body.classList.add("has-sticks");
  $("hint").hidden = true; // phone uses joysticks — no hint bar
} else {
  $("hint").textContent = "Drag to look · WASD to walk · Click a piece · All Products";
}

const cart = createCart({
  badge: $("cartBadge"),
  cartButton: $("cartButton"),
  items: $("cartItems"),
  subtotal: $("cartSubtotal"),
  checkoutButton: $("checkoutButton"),
});

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 1800);
}

const sheet = createProductSheet(
  {
    sheet: $("productSheet"),
    close: $("productClose"),
    image: $("productImage"),
    imageStatus: $("productImageStatus"),
    portrait: $("productPortrait"),
    eyebrow: $("productEyebrow"),
    title: $("productTitle"),
    desc: $("productDesc"),
    price: $("productPrice"),
    meta: $("productMeta"),
    add: $("addButton"),
  },
  cart,
  toast
);

function navigateToProduct(product, { openSheet = true } = {}) {
  const display = getDisplayForProduct(product.id);
  if (!display?.view) {
    if (openSheet) sheet.open(product);
    return;
  }
  controls.setLookLocked(true);
  document.body.classList.add("is-navigating");
  transition.goTo(display.view, {
    onDone: () => {
      document.body.classList.remove("is-navigating");
      controls.setLookLocked(false);
      if (openSheet) sheet.open(product);
    },
  });
}

const catalog = createCatalog(
  {
    openBtn: $("catalogButton"),
    closeBtn: $("catalogClose"),
    panel: $("catalogPanel"),
    grid: $("catalogGrid"),
    scrim: $("scrim"),
  },
  {
    onSelect: (product) => navigateToProduct(product, { openSheet: true }),
    onClose: () => {
      if (!document.body.classList.contains("cart-open") && !document.body.classList.contains("sheet-open")) {
        $("scrim").hidden = true;
      }
    },
  }
);

$("gateNames").innerHTML = ["Shirts", "Jackets", "Denim", "Lounge", "Knitwear", "Outerwear"]
  .map((n) => `<li>${n}</li>`)
  .join("");

function setProgress(p, label) {
  $("loaderFill").style.width = `${Math.round(p * 100)}%`;
  if (label) $("loaderLabel").textContent = label;
}

let collection = null;
let hasEntered = false;

function uiBlocked() {
  return (
    document.body.classList.contains("sheet-open") ||
    document.body.classList.contains("cart-open") ||
    document.body.classList.contains("catalog-open") ||
    document.body.classList.contains("is-navigating") ||
    !$("checkout").hidden ||
    transition.isBusy()
  );
}

$("cartButton").addEventListener("click", () => {
  catalog.hide();
  document.body.classList.add("cart-open");
  $("scrim").hidden = false;
  $("cartDrawer").setAttribute("aria-hidden", "false");
});
function closeCart() {
  document.body.classList.remove("cart-open");
  $("cartDrawer").setAttribute("aria-hidden", "true");
  if (!document.body.classList.contains("catalog-open") && !document.body.classList.contains("sheet-open")) {
    $("scrim").hidden = true;
  }
}
$("cartClose").addEventListener("click", closeCart);
$("scrim").addEventListener("click", () => {
  closeCart();
  sheet.close();
  catalog.hide();
  $("scrim").hidden = true;
});

$("checkoutButton").addEventListener("click", () => {
  const lines = cart.lines();
  $("checkoutLines").innerHTML = lines
    .map(
      (l) =>
        `<p>${l.product.name} · ${l.size} · ${l.color} × ${l.qty} — <strong>${formatMoney(
          l.product.price * l.qty
        )}</strong></p>`
    )
    .join("");
  $("checkoutTotal").textContent = formatMoney(cart.subtotal());
  $("checkout").hidden = false;
  $("checkoutForm").hidden = false;
  $("checkoutThanks").hidden = true;
  closeCart();
});
$("checkoutCancel").addEventListener("click", () => {
  $("checkout").hidden = true;
});
$("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("checkoutForm").hidden = true;
  $("checkoutThanks").hidden = false;
});
$("checkoutDone").addEventListener("click", () => {
  $("checkout").hidden = true;
});

canvas.addEventListener("pointerup", () => {
  if (!hasEntered || !collection) return;
  if (uiBlocked()) return;
  const product = collection.consumeClick();
  if (product) sheet.open(product);
});

function finishEntry() {
  doors.left.rotation.y = Math.PI / 2;
  doors.right.rotation.y = -Math.PI / 2;
  doors.left.visible = false;
  doors.right.visible = false;
  camera.position.set(0, ROOM.eyeY, 2.85);
  controls.look.yaw = 0;
  controls.look.pitch = -0.06;
  controls.setEnabled(true);
}

/** Face the entrance / Power Shift exterior credit. */
function lookOutToExterior() {
  doors.left.rotation.y = Math.PI / 2;
  doors.right.rotation.y = -Math.PI / 2;
  doors.left.visible = false;
  doors.right.visible = false;
  camera.position.set(0, ROOM.eyeY, 2.55);
  controls.look.yaw = Math.PI;
  controls.look.pitch = 0.02;
  controls.setEnabled(true);
  document.body.classList.add("is-live");
  $("gate").classList.remove("is-open");
}

async function openDoors() {
  if (hasEntered) return;
  hasEntered = true;
  document.body.classList.add("is-live");
  $("gate").classList.remove("is-open");
  controls.openDoorsLook();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    finishEntry();
    return;
  }

  const start = performance.now();
  const dur = 900;
  const fromZ = camera.position.z;
  const toZ = 2.85;
  let done = false;
  const complete = () => {
    if (done) return;
    done = true;
    finishEntry();
  };
  // Safety: never leave the visitor stuck outside
  const failSafe = setTimeout(complete, dur + 400);

  const animateDoors = (now) => {
    if (done) return;
    const t = Math.min(1, (now - start) / dur);
    const e = 1 - Math.pow(1 - t, 3);
    doors.left.rotation.y = e * (Math.PI / 2);
    doors.right.rotation.y = -e * (Math.PI / 2);
    camera.position.set(0, ROOM.eyeY, fromZ + (toZ - fromZ) * e);
    controls.look.yaw = 0;
    controls.look.pitch = -0.06;
    if (t < 1) requestAnimationFrame(animateDoors);
    else {
      clearTimeout(failSafe);
      complete();
    }
  };
  requestAnimationFrame(animateDoors);
}

$("enterButton").addEventListener("click", openDoors);

async function boot() {
  try {
    setProgress(0.05, `Optimizing for ${quality.tier} devices`);
    await preloadSceneThumbs();
    setProgress(0.16, "Building the showroom");
    await new Promise((r) => requestAnimationFrame(r));
    // Exterior loads in parallel — never blocks entry
    exterior.ready.then(() => {
      if (exterior.getLogoStatus() === "missing") {
        console.warn("Power Shift official logo asset needed at /images/power-shift-logo.webp");
      }
    });
    setProgress(0.28, "Staging 20 displays");
    collection = await placeDisplayCollection(scene, camera, canvas, quality, setProgress, {
      onInspectStart: () => controls.setLookLocked(true),
      onInspectEnd: () => controls.setLookLocked(false),
    });
    obstaclesRef = collection.getObstacles();
    setProgress(1, "Ready");
    $("enterButton").disabled = false;
    $("loader").style.opacity = "0";
  } catch (err) {
    console.error(err);
    $("loaderError").hidden = false;
    $("loaderError").textContent = err.message || "Failed to load boutique";
  }
}

let last = performance.now();
let running = true;
document.addEventListener("visibilitychange", () => {
  running = document.visibilityState === "visible";
  if (running) last = performance.now();
});

function frame(now) {
  requestAnimationFrame(frame);
  if (!running) return;
  try {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    transition.update(now);
    const blocked = uiBlocked() || !hasEntered || collection?.isInspecting?.();
    controls.update(dt, blocked);
    collection?.update?.(now, dt);
    renderer.render(scene, camera);
  } catch (err) {
    console.error("BEKL render error", err);
    running = false;
  }
}
requestAnimationFrame(frame);
boot();

window.addEventListener("error", (e) => console.error("BEKL window error", e.error || e.message));
window.addEventListener("unhandledrejection", (e) => console.error("BEKL rejection", e.reason));

// Lightweight debug hooks (non-production tooling)
window.__BEKL = {
  faceExterior: lookOutToExterior,
  faceBackWall: () => {
    document.body.classList.add("is-live");
    $("gate").classList.remove("is-open");
    finishEntry();
    camera.position.set(0, ROOM.eyeY, 0.6);
    controls.look.yaw = 0;
    controls.look.pitch = 0.18;
  },
  logoStatus: () => exterior.getLogoStatus(),
  openCatalog: () => catalog.show(),
  closeCatalog: () => catalog.hide(),
};
