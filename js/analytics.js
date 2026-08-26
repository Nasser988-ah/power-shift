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
    const el = e.target.closest("[data-ps-event]");
    if (!el) return;
    track(el.getAttribute("data-ps-event"), {
      label: el.getAttribute("data-ps-label") || el.textContent.trim().slice(0, 80),
    });
  });
}
