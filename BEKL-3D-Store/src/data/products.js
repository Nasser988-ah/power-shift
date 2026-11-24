/**
 * BEKL catalogue + display layout (edit here).
 * sceneImage = room thumb · detailImage = product panel
 */

function c(name, hex) {
  return { name, hex };
}

function item(p) {
  return {
    currency: "EGP",
    placeholder: false,
    ...p,
    sceneImage: `${import.meta.env.BASE_URL}images/mens/cutouts/scene/${p.imageKey}.webp`,
    detailImage: `${import.meta.env.BASE_URL}images/mens/cutouts/detail/${p.imageKey}.webp`,
  };
}

/** Full men's collection — 20 pieces. First four prices/descriptions preserved. */
export const PRODUCTS = [
  item({
    id: "nile-navy-shirt",
    name: "Nile Navy Shirt",
    category: "Shirts",
    eyebrow: "Shirts",
    sku: "BEKL-M01",
    price: 2850,
    description: "Slim navy dress shirt with contrast inner collar and clean stitch detail.",
    fabric: "Cotton blend",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Navy", "#1e2a44"), c("Sky", "#7eb6d4")],
    imageKey: "shirt",
  }),
  item({
    id: "harbor-leather-jacket",
    name: "Harbor Leather Jacket",
    category: "Jackets",
    eyebrow: "Jackets",
    sku: "BEKL-M02",
    price: 9800,
    description: "Asymmetric zip leather jacket with lapel snaps — made for city nights.",
    fabric: "Full-grain leather",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Oxblood", "#6b2430"), c("Black", "#1a1512")],
    imageKey: "jacket",
  }),
  item({
    id: "felucca-jeans",
    name: "Felucca Slim Jeans",
    category: "Denim",
    eyebrow: "Denim",
    sku: "BEKL-M03",
    price: 3400,
    description: "Slim indigo jeans with a soft wash and copper stitch.",
    fabric: "Denim",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [c("Indigo", "#3b4a6b"), c("Stone", "#9aa0a6")],
    imageKey: "jeans",
  }),
  item({
    id: "cloud-hoodie",
    name: "Cloud Fleece Hoodie",
    category: "Lounge",
    eyebrow: "Lounge",
    sku: "BEKL-M04",
    price: 2450,
    description: "Soft fleece hoodie for travel days and cool evenings by the Nile.",
    fabric: "Cotton fleece",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Charcoal", "#4a4a4a"), c("Black", "#1a1a1a")],
    imageKey: "hoodie",
  }),
  item({
    id: "sahel-oxford",
    name: "Sahel Crew Tee",
    category: "Shirts",
    eyebrow: "Shirts",
    sku: "BEKL-M05",
    price: 2650,
    description: "Soft slate crew-neck tee with a clean finish for everyday layering.",
    fabric: "Cotton jersey",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Slate", "#6a7a82"), c("Ivory", "#f5f2eb")],
    imageKey: "oxford",
  }),
  item({
    id: "cairo-polo",
    name: "Cairo Soft Polo",
    category: "Shirts",
    eyebrow: "Shirts",
    sku: "BEKL-M06",
    price: 1950,
    description: "Fine-knit polo with a quiet collar — easy under a blazer or alone.",
    fabric: "Piqué cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Sand", "#c4b39a"), c("Navy", "#1e2a44")],
    imageKey: "polo",
  }),
  item({
    id: "delta-blazer",
    name: "Delta Soft Blazer",
    category: "Jackets",
    eyebrow: "Jackets",
    sku: "BEKL-M07",
    price: 7200,
    description: "Unstructured blazer with soft shoulders for evening appointments.",
    fabric: "Wool blend",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Charcoal", "#3a3a3a"), c("Navy", "#1e2a44")],
    imageKey: "blazer",
  }),
  item({
    id: "kite-bomber",
    name: "Kite Flight Jacket",
    category: "Jackets",
    eyebrow: "Jackets",
    sku: "BEKL-M08",
    price: 5600,
    description: "Classic leather flight jacket with ribbed cuffs and patch pockets.",
    fabric: "Leather",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Mahogany", "#5a3a28"), c("Black", "#1a1a1a")],
    imageKey: "bomber",
  }),
  item({
    id: "oasis-denim",
    name: "Oasis Relaxed Denim",
    category: "Denim",
    eyebrow: "Denim",
    sku: "BEKL-M09",
    price: 3200,
    description: "Relaxed-fit denim with a mid wash and soft hand-feel.",
    fabric: "Denim",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [c("Mid wash", "#5b6f8a"), c("Black", "#222")],
    imageKey: "denim2",
  }),
  item({
    id: "palm-chinos",
    name: "Palm City Chinos",
    category: "Trousers",
    eyebrow: "Trousers",
    sku: "BEKL-M10",
    price: 2750,
    description: "Tapered chinos with a pressed crease for polished days.",
    fabric: "Cotton twill",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [c("Khaki", "#b8a078"), c("Navy", "#1e2a44")],
    imageKey: "chinos",
  }),
  item({
    id: "river-sweat",
    name: "River Crew Sweat",
    category: "Lounge",
    eyebrow: "Lounge",
    sku: "BEKL-M11",
    price: 2200,
    description: "Loopback sweatshirt with a calm crew neck and easy sleeves.",
    fabric: "Cotton loopback",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Heather", "#9a9a9a"), c("Cream", "#efe8dc")],
    imageKey: "sweat",
  }),
  item({
    id: "dusk-lounge",
    name: "Dusk Lounge Crew",
    category: "Lounge",
    eyebrow: "Lounge",
    sku: "BEKL-M12",
    price: 2100,
    description: "Soft heather crew sweatshirt for travel and late evenings at home.",
    fabric: "Cotton fleece",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Heather", "#9a9a9a"), c("Ink", "#2a211c")],
    imageKey: "crew",
  }),
  item({
    id: "atlas-coat",
    name: "Atlas Wool Coat",
    category: "Outerwear",
    eyebrow: "Outerwear",
    sku: "BEKL-M13",
    price: 11500,
    description: "Long wool coat with a quiet lapel and winter weight.",
    fabric: "Wool blend",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Camel", "#c4a06a"), c("Charcoal", "#3a3a3a")],
    imageKey: "coat",
  }),
  item({
    id: "mirage-trench",
    name: "Mirage Camel Coat",
    category: "Outerwear",
    eyebrow: "Outerwear",
    sku: "BEKL-M14",
    price: 8900,
    description: "Single-breasted camel overcoat with a clean lapel and winter weight.",
    fabric: "Wool blend",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Camel", "#c4a06a"), c("Charcoal", "#3a3a3a")],
    imageKey: "trench",
  }),
  item({
    id: "nubian-crew",
    name: "Nubian Merino Crew",
    category: "Knitwear",
    eyebrow: "Knitwear",
    sku: "BEKL-M15",
    price: 3800,
    description: "Fine merino crew with a smooth face and clean rib.",
    fabric: "Merino wool",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Ivory", "#f3eee5"), c("Forest", "#3d4a3a")],
    imageKey: "knit",
  }),
  item({
    id: "lotus-cardigan",
    name: "Lotus Cardigan",
    category: "Knitwear",
    eyebrow: "Knitwear",
    sku: "BEKL-M16",
    price: 4100,
    description: "Open cardigan with a soft drape for layered looks.",
    fabric: "Cotton knit",
    sizes: ["S", "M", "L", "XL"],
    colors: [c("Cream", "#efe8dc"), c("Taupe", "#8a7b6f")],
    imageKey: "cardigan",
  }),
  item({
    id: "temple-trousers",
    name: "Temple Wool Trousers",
    category: "Trousers",
    eyebrow: "Trousers",
    sku: "BEKL-M17",
    price: 3600,
    description: "Tailored trousers with a soft crease and easy stride.",
    fabric: "Wool blend",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [c("Charcoal", "#3a3a3a"), c("Sand", "#c4b39a")],
    imageKey: "trousers",
  }),
  item({
    id: "garden-pleat",
    name: "Garden Pleat Trousers",
    category: "Trousers",
    eyebrow: "Trousers",
    sku: "BEKL-M18",
    price: 3450,
    description: "Single-pleat trousers with a refined hang for daywear.",
    fabric: "Cotton blend",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [c("Olive", "#6b6b4a"), c("Navy", "#1e2a44")],
    imageKey: "trousers2",
  }),
  item({
    id: "quay-sneakers",
    name: "Quay Court Sneakers",
    category: "Accessories",
    eyebrow: "Footwear",
    sku: "BEKL-M19",
    price: 4200,
    description: "Clean court sneakers with a quiet sole for city walking.",
    fabric: "Leather upper",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [c("White", "#f5f2eb"), c("Black", "#1a1a1a")],
    imageKey: "sneakers",
  }),
  item({
    id: "silt-boots",
    name: "Silt Leather Boots",
    category: "Accessories",
    eyebrow: "Footwear",
    sku: "BEKL-M20",
    price: 6800,
    description: "Chelsea-style leather boots with a soft pull tab.",
    fabric: "Full-grain leather",
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: [c("Brown", "#5a3d2b"), c("Black", "#1a1512")],
    imageKey: "boots",
  }),
];

/**
 * 20 perimeter displays — one product per pedestal.
 */
export const DISPLAYS = [
  // Left wall (5)
  { productId: "nile-navy-shirt", x: -4.15, z: -2.55, yawFace: Math.PI / 2, view: { x: -2.35, z: -2.55, yaw: Math.PI / 2, pitch: -0.08 } },
  { productId: "harbor-leather-jacket", x: -4.15, z: -1.15, yawFace: Math.PI / 2, view: { x: -2.35, z: -1.15, yaw: Math.PI / 2, pitch: -0.08 } },
  { productId: "sahel-oxford", x: -4.15, z: 0.25, yawFace: Math.PI / 2, view: { x: -2.35, z: 0.25, yaw: Math.PI / 2, pitch: -0.08 } },
  { productId: "kite-bomber", x: -4.15, z: 1.55, yawFace: Math.PI / 2, view: { x: -2.35, z: 1.55, yaw: Math.PI / 2, pitch: -0.08 } },
  { productId: "atlas-coat", x: -4.15, z: 2.85, yawFace: Math.PI / 2, view: { x: -2.35, z: 2.85, yaw: Math.PI / 2, pitch: -0.08 } },

  // Right wall (5)
  { productId: "felucca-jeans", x: 4.15, z: -2.55, yawFace: -Math.PI / 2, view: { x: 2.35, z: -2.55, yaw: -Math.PI / 2, pitch: -0.08 } },
  { productId: "cloud-hoodie", x: 4.15, z: -1.15, yawFace: -Math.PI / 2, view: { x: 2.35, z: -1.15, yaw: -Math.PI / 2, pitch: -0.08 } },
  { productId: "oasis-denim", x: 4.15, z: 0.25, yawFace: -Math.PI / 2, view: { x: 2.35, z: 0.25, yaw: -Math.PI / 2, pitch: -0.08 } },
  { productId: "river-sweat", x: 4.15, z: 1.55, yawFace: -Math.PI / 2, view: { x: 2.35, z: 1.55, yaw: -Math.PI / 2, pitch: -0.08 } },
  { productId: "nubian-crew", x: 4.15, z: 2.85, yawFace: -Math.PI / 2, view: { x: 2.35, z: 2.85, yaw: -Math.PI / 2, pitch: -0.08 } },

  // Back wall (6) around BEKL
  { productId: "cairo-polo", x: -3.15, z: -3.55, yawFace: Math.PI, view: { x: -3.15, z: -1.85, yaw: 0, pitch: -0.08 } },
  { productId: "delta-blazer", x: -2.05, z: -3.55, yawFace: Math.PI, view: { x: -2.05, z: -1.85, yaw: 0, pitch: -0.08 } },
  { productId: "mirage-trench", x: -0.95, z: -3.55, yawFace: Math.PI, view: { x: -0.95, z: -1.85, yaw: 0, pitch: -0.08 } },
  { productId: "lotus-cardigan", x: 0.95, z: -3.55, yawFace: Math.PI, view: { x: 0.95, z: -1.85, yaw: 0, pitch: -0.08 } },
  { productId: "temple-trousers", x: 2.05, z: -3.55, yawFace: Math.PI, view: { x: 2.05, z: -1.85, yaw: 0, pitch: -0.08 } },
  { productId: "garden-pleat", x: 3.15, z: -3.55, yawFace: Math.PI, view: { x: 3.15, z: -1.85, yaw: 0, pitch: -0.08 } },

  // Entrance flanks (4)
  { productId: "palm-chinos", x: -3.1, z: 3.45, yawFace: 0, view: { x: -3.1, z: 1.75, yaw: Math.PI, pitch: -0.08 } },
  { productId: "dusk-lounge", x: -1.85, z: 3.45, yawFace: 0, view: { x: -1.85, z: 1.75, yaw: Math.PI, pitch: -0.08 } },
  { productId: "quay-sneakers", x: 1.85, z: 3.45, yawFace: 0, view: { x: 1.85, z: 1.75, yaw: Math.PI, pitch: -0.08 } },
  { productId: "silt-boots", x: 3.1, z: 3.45, yawFace: 0, view: { x: 3.1, z: 1.75, yaw: Math.PI, pitch: -0.08 } },
];

export const CATEGORY_SIGNS = [
  { label: "Shirts · Jackets", x: -4.95, y: 2.15, z: -0.4, yaw: Math.PI / 2 },
  { label: "Denim · Lounge", x: 4.95, y: 2.15, z: -0.4, yaw: -Math.PI / 2 },
  { label: "Seasonal", x: -2.1, y: 2.2, z: -3.95, yaw: 0 },
  { label: "Essentials", x: 2.1, y: 2.2, z: -3.95, yaw: 0 },
];

export const ROOM = {
  walk: { minX: -4.45, maxX: 4.45, minZ: -3.15, maxZ: 3.55 },
  pedestalRadius: 0.42,
  eyeY: 1.55,
};

const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProduct(id) {
  return BY_ID.get(id) || null;
}

export function allCatalogue() {
  return [...PRODUCTS];
}

export function realProducts() {
  return PRODUCTS.filter((p) => !p.placeholder);
}

export function getDisplayForProduct(productId) {
  return DISPLAYS.find((d) => d.productId === productId) || null;
}

export function formatMoney(amount, currency = "EGP") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return `${currency} ${Number(amount).toLocaleString("en-EG")}`;
}

const imageCache = new Map();

export function loadImageCached(url) {
  if (!url) return Promise.reject(new Error("missing url"));
  if (imageCache.has(url)) return imageCache.get(url);
  const p = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
  imageCache.set(url, p);
  return p;
}

/** Preload a few scene thumbs so the aisle looks dressed quickly. */
export function preloadSceneThumbs() {
  const first = PRODUCTS.slice(0, 8);
  return Promise.allSettled(first.map((p) => loadImageCached(p.sceneImage)));
}
