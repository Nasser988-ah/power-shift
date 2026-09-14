import { onTrack } from "./analytics.js?v=20260829h";

const PIXEL_ID = "1639209490886117";
const META_SCRIPT = "https://connect.facebook.net/en_US/fbevents.js";
const OLD_CONSENT_KEY = "ps-marketing-consent-v1";

let pixelInitialized = false;
let trackingBound = false;

function language() {
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function createFbq() {
  if (window.fbq) return window.fbq;
  const fbq = function (...args) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  };
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  return fbq;
}

function safePayload(payload = {}) {
  const allowed = ["type", "goal", "timeline", "kind", "from", "label", "lang"];
  return allowed.reduce(
    (result, key) => {
      const value = payload[key];
      if (typeof value === "string" && value) result[key] = value.slice(0, 100);
      return result;
    },
    {
      page_path: window.location.pathname,
      language: language(),
    }
  );
}

function bindSiteEvents() {
  if (trackingBound) return;
  trackingBound = true;
  onTrack(({ name, payload }) => {
    if (!pixelInitialized || !window.fbq) return;
    const parameters = safePayload(payload);
    if (name === "wizard_complete") {
      window.fbq("track", "Lead", parameters);
      return;
    }
    if (name === "whatsapp_cta") {
      window.fbq("track", "Contact", parameters);
      return;
    }
    window.fbq("trackCustom", name, parameters);
  });
}

function loadMetaPixel() {
  if (pixelInitialized) return;
  const fbq = createFbq();
  fbq("init", PIXEL_ID);
  fbq("track", "PageView", {
    page_path: window.location.pathname,
    language: language(),
  });
  pixelInitialized = true;
  bindSiteEvents();

  if (!document.querySelector(`script[src="${META_SCRIPT}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = META_SCRIPT;
    script.dataset.metaPixel = PIXEL_ID;
    document.head.appendChild(script);
  }
}

export function initMetaPixel() {
  try {
    localStorage.removeItem(OLD_CONSENT_KEY);
  } catch {
    /* Pixel still loads if storage is blocked. */
  }
  loadMetaPixel();
}
