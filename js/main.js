import { bindTrackedClicks, track } from "./analytics.js?v=20260829h";
import { initI18n, getLang, t } from "./i18n.js?v=20260829h";
import { initPageI18n } from "./page-i18n.js?v=20260831b";
import { initNav } from "./nav.js?v=20260829h";
import { initWizard, renderWork } from "./wizard.js?v=20260829h";
import { initMotion } from "./motion.js?v=20260829h";
import { simpleWhatsAppUrl, similarWorkUrl } from "./whatsapp.js?v=20260829h";
import { CONFIG } from "./config.js?v=20260831a";
import { PROJECTS } from "./content.js?v=20260831b";

function wireWhatsApp() {
  const apply = () => {
    const lang = getLang();
    const url = simpleWhatsAppUrl(lang);
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.setAttribute("href", url);
      a.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-wa-number]").forEach((a) => {
      a.setAttribute("href", CONFIG.whatsappUrl);
      a.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll("[data-tel], a[href^='tel:']").forEach((a) => {
      a.setAttribute("dir", "ltr");
      a.setAttribute("href", `tel:${CONFIG.phoneE164}`);
      if (!a.textContent.trim() || a.hasAttribute("data-tel")) a.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll("[data-email-link]").forEach((a) => {
      if (!CONFIG.email) {
        a.hidden = true;
        return;
      }
      a.hidden = false;
      a.setAttribute("dir", "ltr");
      a.setAttribute("href", `mailto:${CONFIG.email}`);
      a.setAttribute("aria-label", `Email ${CONFIG.brand} at ${CONFIG.email}`);
      a.textContent = CONFIG.email;
    });
    document.querySelectorAll("[data-similar]").forEach((a) => {
      a.setAttribute("href", similarWorkUrl(lang, a.getAttribute("data-similar")));
      a.setAttribute("rel", "noopener");
    });
  };
  apply();
  document.addEventListener("ps:lang", apply);
  document.body.addEventListener("click", (e) => {
    const similar = e.target.closest("[data-similar]");
    if (!similar) return;
    track("whatsapp_cta", { kind: "similar" });
  });
}

function renderStaticLists() {
  const paint = () => {
    const copy = t();
    const clients = document.querySelector("[data-clients]");
    if (clients) {
      const names = PROJECTS.map((p) => `<span>${copy.work.items[p.id].name}</span>`).join("");
      clients.innerHTML = names + names;
    }
    const services = document.querySelector("[data-services]");
    if (services) {
      services.innerHTML = copy.services.items
        .map(
          (item) => `<article class="service-row reveal" id="${item.id}">
            <span class="svc-n">${item.n}</span>
            <h3 class="svc-title">${item.title}</h3>
            <p class="svc-body">${item.body}</p>
            <div class="svc-actions">
              <button class="btn btn-ghost-invert btn-svc" type="button" data-open-wizard data-wizard-type="${item.id}" data-ps-event="service_select" data-ps-label="${item.title}">${copy.cta.start}</button>
            </div>
          </article>`
        )
        .join("");
    }
    const also = document.querySelector("[data-services-also]");
    if (also) also.textContent = copy.services.also;
    const process = document.querySelector("[data-process]");
    if (process) {
      process.innerHTML = copy.process.steps
        .map(
          (item) => `<article class="process-step reveal"><span class="n">${item.n}</span><h3>${item.title}</h3><p>${item.body}</p></article>`
        )
        .join("");
    }
    const why = document.querySelector("[data-why]");
    if (why) {
      why.innerHTML = copy.why.items
        .map(
          (item) => `<article class="why-item reveal"><h3>${item.title}</h3><p>${item.body}</p></article>`
        )
        .join("");
    }
    const about = document.querySelector("[data-about]");
    if (about) {
      about.innerHTML = `
        <div class="about-block reveal"><h3>${copy.about.who}</h3><p>${copy.about.whoBody}</p></div>
        <div class="about-block reveal"><h3>${copy.about.what}</h3><p>${copy.about.whatBody}</p></div>
        <div class="about-block reveal"><h3>${copy.about.whom}</h3><p>${copy.about.whomBody}</p></div>
        <div class="about-block reveal"><h3>${copy.about.trust}</h3><p>${copy.about.trustBody}</p></div>
      `;
    }
    const faq = document.querySelector("[data-faq]");
    if (faq) {
      faq.innerHTML = copy.faq.items
        .map(
          (item) => `<details class="faq-item reveal">
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>`
        )
        .join("");
    }
    document.querySelectorAll(".reveal").forEach((el) => el.classList.remove("is-in"));
  };
  paint();
  document.addEventListener("ps:lang", paint);
}

function year() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function decoratePhoneCtas() {
  document.querySelectorAll(".btn-sticky-start, .btn-sticky-wa").forEach((btn) => {
    if (btn.querySelector(".btn-ico")) return;
    const key = btn.getAttribute("data-i18n");
    const label = document.createElement("span");
    if (key) {
      label.setAttribute("data-i18n", key);
      btn.removeAttribute("data-i18n");
    }
    label.textContent = btn.textContent.trim();
    const ico = document.createElement("span");
    ico.className = btn.classList.contains("btn-sticky-wa") ? "btn-ico btn-ico-wa" : "btn-ico btn-ico-chat";
    ico.setAttribute("aria-hidden", "true");
    btn.replaceChildren(ico, label);
  });
}

initPageI18n();
decoratePhoneCtas();
initI18n();
bindTrackedClicks();
initNav();
renderStaticLists();
renderWork();
initWizard();
wireWhatsApp();
initMotion();
year();
