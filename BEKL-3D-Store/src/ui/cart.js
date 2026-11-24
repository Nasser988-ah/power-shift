import { getProduct, formatMoney } from "../data/products.js";

function lineKey(productId, size, color) {
  return `${productId}::${size || ""}::${color || ""}`;
}

export function createCart(ui) {
  const state = new Map();

  function count() {
    let n = 0;
    state.forEach((v) => {
      n += v.qty;
    });
    return n;
  }

  function subtotal() {
    let sum = 0;
    state.forEach((v) => {
      const p = getProduct(v.productId);
      if (p && !p.placeholder) sum += p.price * v.qty;
    });
    return sum;
  }

  function render() {
    ui.badge.textContent = String(count());
    ui.cartButton.setAttribute("aria-label", `Open shopping cart, ${count()} items`);
    ui.checkoutButton.disabled = count() === 0;
    ui.subtotal.textContent = formatMoney(subtotal());
    ui.items.innerHTML = "";
    if (state.size === 0) {
      ui.items.innerHTML = `<p class="fine">Your selection is empty. Inspect a garment, then add it to your bag.</p>`;
      return;
    }
    state.forEach((entry, key) => {
      const p = getProduct(entry.productId);
      if (!p || p.placeholder) return;
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <img src="${p.sceneImage}" alt="" loading="lazy" />
        <div>
          <strong>${p.name}</strong>
          <p class="fine">${entry.size || "—"} · ${entry.color || "—"}</p>
          <div class="qty">
            <button type="button" data-act="dec" data-key="${key}" aria-label="Decrease quantity">−</button>
            <span>${entry.qty}</span>
            <button type="button" data-act="inc" data-key="${key}" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="remove" data-act="rm" data-key="${key}">Remove</button>
        </div>
        <div>${formatMoney(p.price * entry.qty)}</div>`;
      ui.items.appendChild(row);
    });
  }

  ui.items.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const key = btn.dataset.key;
    const entry = state.get(key);
    if (!entry) return;
    if (btn.dataset.act === "inc") entry.qty += 1;
    if (btn.dataset.act === "dec") entry.qty = Math.max(1, entry.qty - 1);
    if (btn.dataset.act === "rm") state.delete(key);
    render();
  });

  function add(productId, size, color) {
    const p = getProduct(productId);
    if (!p || p.placeholder) return;
    const key = lineKey(productId, size, color);
    const cur = state.get(key) || { productId, qty: 0, size, color };
    cur.qty += 1;
    cur.size = size || cur.size;
    cur.color = color || cur.color;
    state.set(key, cur);
    render();
  }

  function lines() {
    return [...state.values()]
      .map((entry) => {
        const p = getProduct(entry.productId);
        return { product: p, ...entry };
      })
      .filter((l) => l.product && !l.product.placeholder);
  }

  render();
  return { add, render, count, subtotal, lines, state };
}
