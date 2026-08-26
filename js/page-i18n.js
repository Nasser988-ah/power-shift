import { getLang, t } from "./i18n.js";
import { PAGE_EXTRAS, PAGE_TEXT } from "./page-copy.js";

function pageText(lang = getLang()) {
  return PAGE_TEXT[lang] || PAGE_TEXT.en;
}

function extras(id, lang = getLang()) {
  return (PAGE_EXTRAS[lang] && PAGE_EXTRAS[lang][id]) || {};
}

function setText(el, value) {
  if (!el || value == null) return;
  el.textContent = value;
}

function setHtml(el, value) {
  if (!el || value == null) return;
  el.innerHTML = value;
}

function setList(el, items) {
  if (!el || !Array.isArray(items)) return;
  el.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function setMeta(title, desc) {
  if (!title) return;
  document.title = title;
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl && desc) descEl.setAttribute("content", desc);
  const ogt = document.querySelector('meta[property="og:title"]');
  if (ogt) ogt.setAttribute("content", title);
  const ogd = document.querySelector('meta[property="og:description"]');
  if (ogd && desc) ogd.setAttribute("content", desc);
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) twitterTitle.setAttribute("content", title);
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc && desc) twitterDesc.setAttribute("content", desc);
}

function paintCopy() {
  const copy = pageText();
  document.querySelectorAll("[data-copy]").forEach((el) => {
    const value = copy[el.getAttribute("data-copy")];
    if (typeof value === "string") setText(el, value);
  });
  document.querySelectorAll("[data-copy-html]").forEach((el) => {
    const value = copy[el.getAttribute("data-copy-html")];
    if (typeof value === "string") setHtml(el, value);
  });
  document.querySelectorAll("[data-copy-aria]").forEach((el) => {
    const value = copy[el.getAttribute("data-copy-aria")];
    if (typeof value === "string") el.setAttribute("aria-label", value);
  });
}

function paintWorkIndex() {
  const lang = getLang();
  const items = t(lang).work.items;
  document.querySelectorAll("[data-work-id]").forEach((card) => {
    const id = card.getAttribute("data-work-id");
    const item = items[id];
    const extra = extras(id, lang);
    if (!item) return;
    setText(card.querySelector("[data-work-cat]"), item.category);
    setText(card.querySelector("[data-work-name]"), item.name);
    setText(card.querySelector("[data-work-lead]"), extra.overview || item.challenge);
  });
}

function paintServices() {
  const lang = getLang();
  const items = t(lang).services.items;
  const copy = pageText(lang);
  const extraMap = {
    website: "servicesWebsiteExtra",
    ecommerce: "servicesCommerceExtra",
    saas: "servicesSaasExtra",
    bms: "servicesOpsExtra",
  };
  const relatedMap = {
    website: "servicesWebsiteRelated",
    ecommerce: "servicesCommerceRelated",
    saas: "servicesSaasRelated",
    bms: "servicesOpsRelated",
  };
  items.forEach((item) => {
    const block = document.getElementById(item.id);
    if (!block) return;
    setText(block.querySelector("[data-svc-title]"), item.title);
    setText(block.querySelector("[data-svc-body]"), item.body);
    setText(block.querySelector("[data-svc-extra]"), copy[extraMap[item.id]]);
    setHtml(block.querySelector("[data-svc-related]"), copy[relatedMap[item.id]]);
  });
}

function paintCase() {
  const id = document.body.getAttribute("data-project");
  if (!id) return;
  const lang = getLang();
  const item = t(lang).work.items[id];
  const extra = extras(id, lang);
  if (!item) return;

  setText(document.querySelector('[data-case="kicker"]'), item.category);
  setText(document.querySelector('[data-case="h1"]'), extra.h1);
  setText(document.querySelector('[data-case="lead"]'), extra.overview);
  setText(document.querySelector('[data-case="live"]'), extra.liveLabel);
  setText(document.querySelector('[data-case="crumb"]'), item.name);
  setText(document.querySelector('[data-case="challenge"]'), item.challenge);
  setText(document.querySelector('[data-case="solution"]'), item.solution);
  setText(document.querySelector('[data-case="stack"]'), extra.stack);
  setText(document.querySelector('[data-case="results"]'), extra.results);
  setHtml(document.querySelector('[data-case-html="related"]'), extra.relatedHtml);
  setText(document.querySelector('[data-case="relatedA"]'), extra.relatedA);
  setText(document.querySelector('[data-case="relatedB"]'), extra.relatedB);
  setList(document.querySelector('[data-case-list="goals"]'), extra.goals);
  setList(document.querySelector('[data-case-list="features"]'), extra.features);

  const preview = document.querySelector('[data-case="preview"]');
  if (preview) {
    if (extra.previewNote) {
      preview.hidden = false;
      preview.textContent = extra.previewNote;
    } else {
      preview.hidden = true;
      preview.textContent = "";
    }
  }

  if (extra.metaTitle) setMeta(extra.metaTitle, extra.metaDesc);
}

function paintPageMeta() {
  const page = document.body.getAttribute("data-page");
  const copy = pageText();
  if (page === "work") setMeta(copy.workMetaTitle, copy.workMetaDesc);
  if (page === "services") setMeta(copy.servicesMetaTitle, copy.servicesMetaDesc);
  if (page === "contact") setMeta(copy.contactMetaTitle, copy.contactMetaDesc);
  if (page === "error") setMeta(copy.errorMetaTitle, copy.errorMetaDesc);
}

function paint() {
  paintCopy();
  const page = document.body.getAttribute("data-page");
  if (!page) return;
  paintPageMeta();
  if (page === "work") paintWorkIndex();
  if (page === "services") paintServices();
  if (page === "case") paintCase();
}

export function initPageI18n() {
  document.addEventListener("ps:lang", paint);
  paint();
}
