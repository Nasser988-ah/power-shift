import { onTrack } from "./analytics.js?v=20260829h";

const PIXEL_ID = "1639209490886117";
const CONSENT_KEY = "ps-marketing-consent-v1";
const GRANTED = "granted";
const DENIED = "denied";
const META_SCRIPT = "https://connect.facebook.net/en_US/fbevents.js";
const META_COOKIE_NAMES = ["_fbp", "_fbc"];

let pixelInitialized = false;
let trackingBound = false;
let sessionConsent = "";

const COPY = {
  en: {
    title: "Your privacy choices",
    body:
      "We use essential storage for language and site preferences. With your permission, Meta Pixel measures visits and enquiries so we can improve our advertising. Meta may set cookies and receive usage data.",
    accept: "Allow marketing",
    reject: "Essential only",
    settings: "Privacy settings",
    label: "Marketing privacy choices",
  },
  ar: {
    title: "خيارات الخصوصية",
    body:
      "نستخدم التخزين الضروري للغة وتفضيلات الموقع. وبموافقتك، يقيس Meta Pixel الزيارات وطلبات التواصل لتحسين إعلاناتنا. قد تضع Meta ملفات تعريف ارتباط وتتلقى بيانات الاستخدام.",
    accept: "السماح بالتسويق",
    reject: "الضروري فقط",
    settings: "إعدادات الخصوصية",
    label: "خيارات خصوصية التسويق",
  },
};

function language() {
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function readConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === GRANTED || value === DENIED) return value;
  } catch {
    /* Fall back to the choice made during this page view. */
  }
  return sessionConsent;
}

function storeConsent(value) {
  sessionConsent = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* Consent still applies for the current page if storage is unavailable. */
  }
}

function ensureStyles() {
  if (document.querySelector('link[data-marketing-consent-styles]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/css/consent.css?v=20260914a";
  link.dataset.marketingConsentStyles = "";
  document.head.appendChild(link);
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
    if (!pixelInitialized || readConsent() !== GRANTED || !window.fbq) return;
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
  if (readConsent() !== GRANTED) return;
  if (pixelInitialized) {
    window.fbq?.("consent", "grant");
    return;
  }
  const fbq = createFbq();
  fbq("consent", "grant");
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

function clearMetaCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, ".powershift.space"];
  META_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    });
  });
}

function revokeMetaPixel() {
  if (window.fbq) window.fbq("consent", "revoke");
  clearMetaCookies();
}

function renderText(root) {
  const copy = COPY[language()];
  root.setAttribute("aria-label", copy.label);
  root.querySelector("[data-consent-title]").textContent = copy.title;
  root.querySelector("[data-consent-body]").textContent = copy.body;
  root.querySelector("[data-consent-accept]").textContent = copy.accept;
  root.querySelector("[data-consent-reject]").textContent = copy.reject;
  document.querySelector("[data-consent-settings]").textContent = copy.settings;
  document.querySelector("[data-consent-settings]").setAttribute("aria-label", copy.settings);
}

function showBanner(root) {
  root.hidden = false;
  document.querySelector("[data-consent-settings]").hidden = true;
  requestAnimationFrame(() => root.classList.add("is-visible"));
  root.querySelector("[data-consent-accept]").focus({ preventScroll: true });
}

function hideBanner(root) {
  root.classList.remove("is-visible");
  root.hidden = true;
  document.querySelector("[data-consent-settings]").hidden = false;
}

function buildInterface() {
  const banner = document.createElement("section");
  banner.className = "consent-banner";
  banner.hidden = true;
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.innerHTML = `
    <div class="consent-copy">
      <h2 data-consent-title></h2>
      <p data-consent-body></p>
    </div>
    <div class="consent-actions">
      <button class="btn btn-primary" type="button" data-consent-accept></button>
      <button class="btn btn-ghost" type="button" data-consent-reject></button>
    </div>
  `;

  const settings = document.createElement("button");
  settings.className = "consent-settings";
  settings.type = "button";
  settings.hidden = true;
  settings.dataset.consentSettings = "";

  document.body.append(banner, settings);
  renderText(banner);

  banner.querySelector("[data-consent-accept]").addEventListener("click", () => {
    storeConsent(GRANTED);
    loadMetaPixel();
    hideBanner(banner);
  });
  banner.querySelector("[data-consent-reject]").addEventListener("click", () => {
    storeConsent(DENIED);
    revokeMetaPixel();
    hideBanner(banner);
  });
  settings.addEventListener("click", () => showBanner(banner));
  document.addEventListener("ps:lang", () => renderText(banner));

  return banner;
}

export function initMarketingConsent() {
  ensureStyles();
  const banner = buildInterface();
  const consent = readConsent();
  if (consent === GRANTED) {
    loadMetaPixel();
    document.querySelector("[data-consent-settings]").hidden = false;
  } else if (consent === DENIED) {
    document.querySelector("[data-consent-settings]").hidden = false;
  } else {
    showBanner(banner);
  }
}
