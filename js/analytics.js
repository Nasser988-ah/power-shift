/**
 * Analytics-ready event bus. No third-party scripts.
 * Hook later: window.psTrack = (...args) => { gtag or pixel }
 */
const listeners = new Set();

export function onTrack(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function track(name, payload = {}) {
  const event = { name, payload, t: Date.now() };
  try {
    window.dispatchEvent(new CustomEvent("ps:track", { detail: event }));
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => {
    try {
      fn(event);
    } catch {
      /* ignore */
    }
  });
}

window.psTrack = track;

export function bindTrackedClicks(root = document) {
  root.addEventListener("click", (e) => {
    const explicit = e.target.closest("[data-ps-event]");
    if (explicit) {
      track(explicit.getAttribute("data-ps-event"), {
        label: explicit.getAttribute("data-ps-label") || explicit.textContent.trim().slice(0, 80),
      });
    }

    const whatsapp = e.target.closest("[data-wa]");
    if (whatsapp && explicit?.getAttribute("data-ps-event") !== "whatsapp_cta") {
      track("whatsapp_cta", {
        kind: "direct",
        label: whatsapp.getAttribute("data-ps-label") || whatsapp.textContent.trim().slice(0, 80),
      });
    }
  });
}
