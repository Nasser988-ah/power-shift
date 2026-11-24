import { realProducts, formatMoney, loadImageCached } from "../data/products.js";

/**
 * Simple website-style All Products page — image, name, price clear on phone + PC.
 */
export function createCatalog(ui, { onSelect, onClose }) {
  let open = false;

  function render() {
    const list = realProducts();
    ui.grid.innerHTML = "";
    list.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalog-card";
      btn.dataset.id = p.id;
      btn.setAttribute("aria-label", `${p.name}, ${formatMoney(p.price, p.currency)}`);
      const imgSrc = p.detailImage || p.sceneImage;
      btn.innerHTML = `
        <span class="catalog-thumb-wrap">
          <img alt="${p.name}" width="360" height="480" decoding="async" />
          <span class="catalog-thumb-status" aria-hidden="true"></span>
        </span>
        <span class="catalog-meta">
          <span class="catalog-cat">${p.category || ""}</span>
          <span class="catalog-name">${p.name}</span>
          <span class="catalog-price">${formatMoney(p.price, p.currency)}</span>
        </span>`;
      ui.grid.appendChild(btn);

      const img = btn.querySelector("img");
      const status = btn.querySelector(".catalog-thumb-status");
      const wrap = btn.querySelector(".catalog-thumb-wrap");
      wrap.classList.add("is-loading");
      loadImageCached(imgSrc)
        .then((loaded) => {
          img.src = loaded.src;
          img.onload = () => {
            wrap.classList.remove("is-loading");
            wrap.classList.add("is-ready");
          };
          if (img.complete) {
            wrap.classList.remove("is-loading");
            wrap.classList.add("is-ready");
          }
          status.hidden = true;
        })
        .catch(() => {
          wrap.classList.remove("is-loading");
          wrap.classList.add("is-error");
          status.textContent = "Image unavailable";
          status.classList.add("is-error");
        });
    });
  }

  function show() {
    open = true;
    render();
    document.body.classList.add("catalog-open");
    ui.panel.setAttribute("aria-hidden", "false");
    if (ui.scrim) ui.scrim.hidden = false;
  }

  function hide() {
    open = false;
    document.body.classList.remove("catalog-open");
    ui.panel.setAttribute("aria-hidden", "true");
  }

  function isOpen() {
    return open;
  }

  ui.openBtn.onclick = () => {
    if (open) hide();
    else show();
  };
  ui.closeBtn.onclick = () => {
    hide();
    onClose?.();
  };
  ui.grid.addEventListener("click", (e) => {
    const card = e.target.closest(".catalog-card");
    if (!card) return;
    const product = realProducts().find((p) => p.id === card.dataset.id);
    if (!product) return;
    hide();
    if (ui.scrim) ui.scrim.hidden = true;
    onSelect?.(product);
  });

  return { show, hide, isOpen };
}
