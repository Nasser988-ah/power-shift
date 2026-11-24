import { formatMoney, loadImageCached } from "../data/products.js";

export function createProductSheet(ui, cart, toast) {
  let current = null;
  let size = null;
  let color = null;
  let loadToken = 0;

  function colorName(c) {
    return typeof c === "string" ? c : c.name;
  }

  function setImageState(mode, message = "") {
    ui.portrait?.classList.toggle("is-loading", mode === "loading");
    ui.portrait?.classList.toggle("is-error", mode === "error");
    if (ui.imageStatus) {
      ui.imageStatus.hidden = mode === "ready";
      ui.imageStatus.textContent =
        mode === "loading" ? "Loading…" : mode === "error" ? message || "Image unavailable" : "";
    }
  }

  function renderMeta(product) {
    ui.meta.innerHTML = "";
    if (product.placeholder) {
      const note = document.createElement("span");
      note.textContent = "Demo placeholder — not for sale";
      ui.meta.appendChild(note);
      return;
    }

    const fabric = document.createElement("span");
    fabric.textContent = product.fabric;
    ui.meta.appendChild(fabric);

    const sizeLabel = document.createElement("span");
    sizeLabel.className = "meta-label";
    sizeLabel.textContent = "Size";
    ui.meta.appendChild(sizeLabel);

    product.sizes.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = s;
      if (s === size) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        size = s;
        renderMeta(product);
      });
      ui.meta.appendChild(btn);
    });

    const colorLabel = document.createElement("span");
    colorLabel.className = "meta-label";
    colorLabel.textContent = "Color";
    ui.meta.appendChild(colorLabel);

    product.colors.forEach((c) => {
      const name = colorName(c);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip color";
      btn.textContent = name;
      if (c.hex) btn.style.setProperty("--swatch", c.hex);
      if (name === color) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        color = name;
        renderMeta(product);
      });
      ui.meta.appendChild(btn);
    });
  }

  async function loadDetail(product, token) {
    const url = product.detailImage || product.sceneImage;
    setImageState("loading");
    // Show scene thumb immediately if already cached
    try {
      const scene = await loadImageCached(product.sceneImage);
      if (token !== loadToken) return;
      ui.image.src = scene.src;
    } catch {
      /* continue to detail */
    }
    try {
      const detail = await loadImageCached(url);
      if (token !== loadToken) return;
      ui.image.src = detail.src;
      ui.image.alt = product.name;
      setImageState("ready");
    } catch {
      if (token !== loadToken) return;
      if (!ui.image.src) setImageState("error", "Could not load image");
      else setImageState("ready");
    }
  }

  function open(product) {
    current = product;
    size = product.sizes?.[0] || null;
    color = product.colors?.[0] ? colorName(product.colors[0]) : null;
    loadToken += 1;
    const token = loadToken;

    ui.image.removeAttribute("src");
    ui.image.alt = product.name;
    ui.eyebrow.textContent = product.placeholder
      ? `${product.eyebrow} · Placeholder`
      : `${product.eyebrow} · ${product.sku || ""}`.trim();
    ui.title.textContent = product.name;
    ui.desc.textContent = product.description;
    ui.price.textContent = product.placeholder
      ? "Not for sale"
      : formatMoney(product.price, product.currency);
    renderMeta(product);

    if (product.placeholder) {
      ui.add.disabled = true;
      ui.add.textContent = "Unavailable";
      ui.add.hidden = false;
    } else {
      ui.add.disabled = false;
      ui.add.textContent = "Add to bag";
      ui.add.hidden = false;
    }

    document.body.classList.add("sheet-open");
    ui.sheet.setAttribute("aria-hidden", "false");
    loadDetail(product, token);
  }

  function close() {
    document.body.classList.remove("sheet-open");
    ui.sheet.setAttribute("aria-hidden", "true");
    current = null;
    loadToken += 1;
  }

  ui.close.addEventListener("click", close);
  ui.add.addEventListener("click", () => {
    if (!current || current.placeholder) {
      toast("This display is a demo placeholder and cannot be added to the bag.");
      return;
    }
    if (!size || !color) return;
    cart.add(current.id, size, color);
    toast(`Added ${current.name} · ${size} · ${color}`);
    ui.add.classList.add("is-success");
    setTimeout(() => ui.add.classList.remove("is-success"), 600);
    close();
  });

  return { open, close };
}
