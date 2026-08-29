import { CONFIG } from "./config.js";
import { COPY } from "./content.js";
import { track } from "./analytics.js";

const KEY = CONFIG.langKey;
const CHOSEN = "ps-lang-chosen";
const SITE_URL = CONFIG.siteOrigin;
let currentLang = "";

export function isHomePath(pathname = window.location.pathname) {
  return (
    pathname === "/" ||
    pathname === "/index.html" ||
    pathname === "/ar" ||
    pathname === "/ar/" ||
    pathname === "/ar/index.html"
  );
}

function langFromPath() {
  return /^\/ar(?:\/|$)/.test(window.location.pathname) ? "ar" : "en";
}

function storedLang() {
  const value = localStorage.getItem(KEY);
  return value === "ar" || value === "en" ? value : null;
}

function prefersArabic() {
  try {
    const list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    const langAr = Array.from(list).some((item) => String(item || "").toLowerCase().startsWith("ar"));
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const zoneAr =
      /^(Africa\/(Cairo|Casablanca|Algiers|Tunis)|Asia\/(Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Amman|Beirut|Baghdad))$/.test(
        tz
      );
    return langAr || zoneAr;
  } catch {
    return false;
  }
}

function userChoseLang() {
  return localStorage.getItem(CHOSEN) === "1";
}

export function resolveLang() {
  if (isHomePath()) return langFromPath();
  if (userChoseLang() && storedLang()) return storedLang();
  return prefersArabic() ? "ar" : "en";
}

export function getLang() {
  return currentLang || resolveLang();
}

export function t(lang = getLang()) {
  return COPY[lang] || COPY.en;
}

export function lookup(path, lang = getLang()) {
  const value = String(path || "")
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), t(lang));
  return value;
}

function setText(el, value) {
  if (!el || value == null) return;
  el.textContent = value;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldAnimateLangSwitch(nextLang, animate) {
  return animate && !prefersReducedMotion() && getLang() !== nextLang;
}

function homeHref(lang) {
  return lang === "ar" ? "/ar" : "/";
}

function syncHomeLinks(lang) {
  const home = homeHref(lang);
  document.querySelectorAll("a.brand, a[data-copy='home'], a[data-copy='errorHome']").forEach((el) => {
    el.setAttribute("href", home);
  });
  document.querySelectorAll("a[href]").forEach((el) => {
    if (el.hasAttribute("data-lang")) return;
    const href = el.getAttribute("href") || "";
    const hash = href.match(/^\/(?:ar)?#(.*)$/);
    if (!hash) return;
    if (isHomePath()) {
      el.setAttribute("href", `#${hash[1]}`);
      return;
    }
    el.setAttribute("href", lang === "ar" ? `/ar#${hash[1]}` : `/#${hash[1]}`);
  });
}

function commitLang(lang, persist) {
  currentLang = lang;
  const copy = t(lang);
  const root = document.documentElement;
  root.lang = copy.htmlLang;
  root.dir = copy.dir;
  if (persist) {
    localStorage.setItem(KEY, lang);
    localStorage.setItem(CHOSEN, "1");
  }

  if (isHomePath()) {
    document.title = copy.metaTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", copy.metaDesc);
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", copy.metaTitle);
    const ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", copy.metaDesc);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", copy.metaTitle);
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", copy.metaDesc);
    const pageUrl = lang === "ar" ? `${SITE_URL}/ar` : `${SITE_URL}/`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", pageUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", pageUrl);
  }

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", lang === "ar" ? "ar_EG" : "en_US");
  const ogLocaleAlternate = document.querySelector('meta[property="og:locale:alternate"]');
  if (ogLocaleAlternate) ogLocaleAlternate.setAttribute("content", lang === "ar" ? "en_US" : "ar_EG");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = lookup(el.getAttribute("data-i18n"), lang);
    if (typeof value === "string") setText(el, value);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = lookup(el.getAttribute("data-i18n-html"), lang);
    if (typeof value === "string") el.innerHTML = value;
  });

  document.querySelectorAll("[data-i18n-list]").forEach((el) => {
    const value = lookup(el.getAttribute("data-i18n-list"), lang);
    if (Array.isArray(value)) {
      el.innerHTML = value.map((item) => `<li>${item}</li>`).join("");
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const value = lookup(el.getAttribute("data-i18n-aria"), lang);
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });

  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const value = lookup(el.getAttribute("data-i18n-ph"), lang);
    if (typeof value === "string") el.setAttribute("placeholder", value);
  });

  syncHomeLinks(lang);

  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    if (btn.dataset.lang === lang) btn.setAttribute("aria-current", "true");
    else btn.removeAttribute("aria-current");
  });

  document.dispatchEvent(new CustomEvent("ps:lang", { detail: { lang, copy } }));
  return copy;
}

export function applyLang(lang, { persist = true, animate = true } = {}) {
  if (!shouldAnimateLangSwitch(lang, animate)) {
    return commitLang(lang, persist);
  }

  const root = document.documentElement;
  root.classList.add("lang-switching");

  window.setTimeout(() => {
    commitLang(lang, persist);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("lang-switching");
      });
    });
  }, 180);

  return t(lang);
}

export function initI18n() {
  applyLang(resolveLang(), { persist: false, animate: false });
  document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const next = btn.dataset.lang;
      event.preventDefault();
      if (!next || next === getLang()) return;
      if (isHomePath()) {
        const nextPath = next === "ar" ? "/ar" : "/";
        window.history.pushState({ lang: next }, "", nextPath);
      }
      applyLang(next);
      track("lang_switch", { lang: next });
    });
  });
  window.addEventListener("popstate", () => {
    applyLang(isHomePath() ? langFromPath() : resolveLang(), { persist: false });
  });
}
