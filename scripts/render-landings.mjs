import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { REVIEWS, REVIEW_STATS } from "../js/reviews.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.powershift.space";
const OG = `${ORIGIN}/assets/og/og-cover.png`;
const V = { boot: "20260928a", app: "20260922d", pages: "20260928a", main: "20260922c" };

const PATHS = {
  egyptAr: "/ar/تصميم-مواقع-مصر",
  egyptEn: "/web-design-egypt",
  shopAr: "/ar/تصميم-متجر-الكتروني",
  gccAr: "/ar/تصميم-مواقع-الخليج",
};

const CHROME = {
  ar: {
    home: "/ar",
    work: "/ar/work",
    services: "/ar/services",
    blog: "/ar/blog",
    approach: "/ar#approach",
    about: "/ar/about",
    reviews: "/ar/reviews",
    contact: "/ar/contact",
    t: {
      skip: "انتقل إلى المحتوى",
      primary: "القائمة الرئيسية",
      mobile: "قائمة الهاتف",
      menu: "القائمة",
      openMenu: "افتح القائمة",
      language: "اللغة",
      work: "أعمالنا",
      services: "خدماتنا",
      blog: "المدونة",
      approach: "طريقة العمل",
      about: "من نحن",
      reviews: "آراء العملاء",
      contact: "تواصل معنا",
      whatsapp: "واتساب",
      start: "ابدأ استشارة المشروع",
      note: "استوديو برمجيات · القاهرة · مصر · الخليج · الأسواق الدولية",
      contactLabel: "تواصل",
      location: "القاهرة، مصر",
      explore: "استكشف",
      follow: "تابعنا",
      rights: "جميع الحقوق محفوظة.",
      privacy: "تصل تفاصيل مشروعك إلى واتساب. لا نبيع بياناتك.",
      breadcrumb: "مسار التنقل",
      kickerStart: "ابدأ",
      close: "إغلاق",
      name: "الاسم",
      email: "البريد الإلكتروني",
      phone: "الهاتف (اختياري)",
      company: "الشركة",
      noteField: "ملاحظات",
      back: "رجوع",
      sendEmail: "إرسال بالبريد",
      next: "متابعة",
      stars: "5 من 5 نجوم",
    },
    explore: [
      ["/ar/تصميم-مواقع-مصر", "تصميم مواقع في مصر"],
      ["/ar/تصميم-متجر-الكتروني", "تصميم متجر إلكتروني"],
      ["/ar/تصميم-مواقع-الخليج", "تصميم مواقع في الخليج"],
      ["/ar/services", "كل الخدمات"],
      ["/ar/reviews", "آراء العملاء"],
      ["/ar/blog", "المدونة"],
    ],
  },
  en: {
    home: "/",
    work: "/work",
    services: "/services",
    blog: "/blog",
    approach: "/#approach",
    about: "/about",
    reviews: "/reviews",
    contact: "/contact",
    t: {
      skip: "Skip to content",
      primary: "Primary",
      mobile: "Mobile",
      menu: "Menu",
      openMenu: "Open menu",
      language: "Language",
      work: "Work",
      services: "Services",
      blog: "Blog",
      approach: "Approach",
      about: "About",
      reviews: "Reviews",
      contact: "Contact",
      whatsapp: "WhatsApp",
      start: "Book a Scope Call",
      note: "Software studio · Cairo · Egypt · GCC · International",
      contactLabel: "Contact",
      location: "Cairo, Egypt",
      explore: "Explore",
      follow: "Follow",
      rights: "All rights reserved.",
      privacy: "Briefs go to our WhatsApp. We do not sell your data.",
      breadcrumb: "Breadcrumb",
      kickerStart: "Start",
      close: "Close",
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      company: "Company",
      noteField: "Note",
      back: "Back",
      sendEmail: "Send by email",
      next: "Continue",
      stars: "5 out of 5 stars",
    },
    explore: [
      ["/web-design-egypt", "Web design in Egypt"],
      ["/services", "All services"],
      ["/work", "Our work"],
      ["/reviews", "Client reviews"],
      ["/blog", "Blog"],
    ],
  },
};

const WORK = {
  via: { img: "via-holidays", href: "/work/via-holidays.html", name: "VIA Holidays" },
  heba: { img: "heba", href: "/work/heba.html", name: { ar: "د. هبة عز العرب", en: "Dr. Heba Ezz El-Arab" } },
  radwan: { img: "radwan", href: "/work/radwan.html", name: { ar: "رضوان عز العرب", en: "Radwan Ezz El-Arab" } },
  lodiamo: { img: "lodiamo", href: "/work/lodiamo.html", name: "Lodiamo" },
  nourvive: { img: "nourvive", href: "/work/nourvive.html", name: "Nourvive" },
  medlab: { img: "medlab", href: "/work/medlab.html", name: "MedLab Market" },
  adam: { img: "adam", href: "/work/adam.html", name: "Adam Trending" },
  corolla: { img: "corolla", href: "/work/corolla.html", name: "Corolla" },
  uruz: { img: "uruz", href: "/work/uruz.html", name: "URUZ" },
  haseb: { img: "haseb", href: "/work/haseb.html", name: "7aseb" },
};

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c").replace(/^/gm, "      ");
}

function abs(path) {
  return `${ORIGIN}${path}`;
}

function workCards(lang, items) {
  return items
    .map(([key, alt, text]) => {
      const w = WORK[key];
      const name = typeof w.name === "string" ? w.name : w.name[lang];
      return `            <a class="related-card" href="${w.href}">
              <img src="/assets/work/${w.img}-800.webp" alt="${esc(alt)}" width="800" height="500" loading="lazy" decoding="async" />
              <strong>${esc(name)}</strong>
              <span>${esc(text)}</span>
            </a>`;
    })
    .join("\n");
}

function readingCards(items) {
  return items
    .map(
      ([href, title, text]) => `            <a class="related-card" href="${href}">
              <strong>${esc(title)}</strong>
              <span>${esc(text)}</span>
            </a>`
    )
    .join("\n");
}

function reviewsSection(lang, ids, { kicker, title, note, readAll, leave }) {
  const t = CHROME[lang].t;
  const cards = ids
    .map((id) => REVIEWS.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => {
      const dir = r.lang === "ar" ? "rtl" : "ltr";
      const initial = [...r.name.trim()][0];
      const body = r.text.map((line) => `<p>${esc(line)}</p>`).join("\n                ");
      return `          <article class="review-card" lang="${r.lang}" dir="${dir}" data-review-id="${r.id}" role="listitem">
            <div class="review-card-top">
              <span class="review-avatar" aria-hidden="true">${esc(initial)}</span>
              <div class="review-stars" aria-label="${t.stars}"><span aria-hidden="true">★★★★★</span></div>
            </div>
            <blockquote>
                ${body}
            </blockquote>
            <footer><cite>${esc(r.name)}</cite></footer>
          </article>`;
    })
    .join("\n");
  const score = REVIEW_STATS.ratingValue.toFixed(1);
  return `      <section class="section section-reviews" aria-labelledby="landing-reviews-title">
        <div class="wrap reviews-intro">
          <div class="reviews-copy">
            <p class="kicker">${esc(kicker)}</p>
            <h2 id="landing-reviews-title">${esc(title)}</h2>
            <div class="review-actions">
              <a class="btn btn-primary" href="${CHROME[lang].reviews}">${esc(readAll)}</a>
              <a class="btn btn-ghost" href="https://wa.me/201553766199" data-wa-review data-ps-event="whatsapp_cta" data-ps-label="leave-review">${esc(leave)}</a>
            </div>
          </div>
          <aside class="reviews-plaque" aria-label="${esc(note)}">
            <strong class="review-score-value">${score}</strong>
            <div class="review-stars" aria-hidden="true">★★★★★</div>
            <p>${esc(note)}</p>
          </aside>
        </div>
        <div class="wrap">
          <div class="review-rail" role="list">
${cards}
          </div>
        </div>
      </section>`;
}

function faqSection(kicker, title, faq) {
  const items = faq
    .map(([q, a]) => `            <details class="faq-item"><summary>${esc(q)}</summary><p>${a}</p></details>`)
    .join("\n");
  return `      <section class="section">
        <div class="wrap about-split">
          <div>
            <p class="kicker">${esc(kicker)}</p>
            <h2 class="faq-title">${esc(title)}</h2>
          </div>
          <div class="faq-list">
${items}
          </div>
        </div>
      </section>`;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function dialog(t) {
  return `    <dialog class="dialog" id="project-dialog" aria-labelledby="wizard-title">
      <div class="dialog-inner">
        <div class="dialog-head">
          <div>
            <p class="kicker" data-i18n="qualify.kicker">${t.kickerStart}</p>
            <h2 id="wizard-title" data-i18n="wizard.dialogLabel">${t.start}</h2>
          </div>
          <button class="icon-btn" type="button" data-close-wizard aria-label="${t.close}" data-i18n-aria="cta.close">×</button>
        </div>
        <div class="progress" data-progress></div>
        <h3 data-q></h3>
        <div class="choice-grid" data-choices></div>
        <div class="contact-fields" data-contact-fields hidden>
          <label>
            <span data-label-name data-i18n="qualify.name">${t.name}</span>
            <input type="text" name="name" autocomplete="name" data-field-name required />
            <span class="field-error" data-error-name hidden></span>
          </label>
          <label>
            <span data-label-email data-i18n="qualify.email">${t.email}</span>
            <input type="email" name="email" autocomplete="email" data-field-email required />
            <span class="field-error" data-error-email hidden></span>
          </label>
          <label>
            <span data-label-phone data-i18n="qualify.phone">${t.phone}</span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" data-field-phone />
            <span class="field-error" data-error-phone hidden></span>
          </label>
          <label>
            <span data-label-company data-i18n="qualify.company">${t.company}</span>
            <input type="text" name="company" autocomplete="organization" data-field-company />
          </label>
          <label class="span-2">
            <span data-label-note data-i18n="qualify.note">${t.noteField}</span>
            <textarea name="note" rows="3" data-field-note></textarea>
          </label>
        </div>
        <p class="price-note" data-price-note></p>
        <p class="price-note" data-ready-note></p>
        <p class="price-note" data-privacy></p>
        <p class="form-status" data-form-status hidden></p>
        <div class="wizard-nav">
          <button class="btn btn-ghost" type="button" data-back hidden>${t.back}</button>
          <div class="wizard-nav-end">
            <button class="btn btn-ghost" type="button" data-email-send hidden>${t.sendEmail}</button>
            <button class="btn btn-primary" type="button" data-next>${t.next}</button>
          </div>
        </div>
      </div>
    </dialog>`;
}

function page(p) {
  const c = CHROME[p.lang];
  const t = c.t;
  const dir = p.lang === "ar" ? "rtl" : "ltr";
  const canonical = abs(p.path);
  const alternates = p.alternates
    ? `
    <link rel="alternate" hreflang="en" href="${abs(p.alternates.en)}" />
    <link rel="alternate" hreflang="ar" href="${abs(p.alternates.ar)}" />
    <link rel="alternate" hreflang="x-default" href="${abs(p.alternates.en)}" />`
    : "";
  const fonts =
    p.lang === "ar"
      ? `    <link rel="preload" href="/assets/fonts/ibm-plex-sans-arabic-500.woff2" as="font" type="font/woff2" crossorigin />`
      : `    <link rel="preload" href="/assets/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/instrument-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin />`;
  const home = p.lang === "ar" ? "الرئيسية" : "Home";
  const servicesName = p.lang === "ar" ? "الخدمات" : "Services";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: p.service.name,
        url: canonical,
        description: p.service.description,
        serviceType: p.service.type,
        provider: { "@id": `${ORIGIN}/#business` },
        areaServed: p.service.areaServed.map((name) => ({ "@type": "Country", name })),
        availableLanguage: ["ar", "en"],
        inLanguage: p.lang,
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#page`,
        url: canonical,
        name: p.title,
        description: p.description,
        inLanguage: p.lang,
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#business` },
        mainEntity: { "@id": `${canonical}#service` },
        significantLink: [abs(c.reviews), abs(c.work)],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: home, item: abs(c.home === "/" ? "/" : c.home) },
          { "@type": "ListItem", position: 2, name: servicesName, item: abs(c.services) },
          { "@type": "ListItem", position: 3, name: p.crumb, item: canonical },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: stripTags(a) },
        })),
      },
    ],
  };

  const nav = [
    [c.work, t.work, "nav.work"],
    [c.services, t.services, "nav.services"],
    [c.blog, t.blog, "nav.blog"],
    [c.approach, t.approach, "nav.approach"],
    [c.about, t.about, "nav.about"],
    [c.reviews, t.reviews, "nav.reviews"],
    [c.contact, t.contact, "nav.contact"],
  ]
    .map(([href, label, key]) => `<a href="${href}"${key === "nav.blog" ? ' data-nav="blog"' : ""} data-i18n="${key}">${label}</a>`)
    .join("\n          ");

  const explore = c.explore
    .map(([href, label]) => `<a href="${href}"${href === p.path ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("\n          ");

  const langEn = p.langSwitch.en;
  const langAr = p.langSwitch.ar;

  return `<!DOCTYPE html>
<html lang="${p.lang}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <script src="/js/lang-boot.js?v=${V.boot}"></script>
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="POWER SHIFT" />
    <meta name="geo.region" content="EG-C" />
    <meta name="geo.placename" content="Cairo" />
    <link rel="canonical" href="${canonical}" />${alternates}
    <meta name="theme-color" content="#12243C" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="POWER SHIFT" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${p.lang === "ar" ? "ar_EG" : "en_US"}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:image" content="${OG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(p.h1)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.title)}" />
    <meta name="twitter:description" content="${esc(p.description)}" />
    <meta name="twitter:image" content="${OG}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
${fonts}
    <link rel="stylesheet" href="/css/app.css?v=${V.app}" />
    <link rel="stylesheet" href="/css/pages.css?v=${V.pages}" />
    <script type="application/ld+json">
${jsonLd(schema)}
    </script>
  </head>
  <body data-page="landing" data-landing="${p.id}">
    <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
    <a class="skip" href="#main" data-i18n="skip">${t.skip}</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${c.home}" aria-label="POWER SHIFT">
          <img class="brand-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
        </a>
        <nav class="nav-desktop" aria-label="${t.primary}" data-i18n-aria="a11y.primaryNav">
          ${nav}
        </nav>
        <div class="header-end">
          <div class="header-actions">
            <div class="lang-switch" role="group" aria-label="${t.language}" data-i18n-aria="a11y.language">
              <span class="lang-thumb" aria-hidden="true"></span>
              <a href="${langEn}" data-lang="en" hreflang="en"${p.lang === "en" ? ' aria-current="true"' : ""}><span class="lang-flag lang-flag-en" aria-hidden="true"></span>EN</a>
              <a href="${langAr}" data-lang="ar" hreflang="ar"${p.lang === "ar" ? ' aria-current="true"' : ""}><span class="lang-flag lang-flag-ar" aria-hidden="true"></span>عربي</a>
            </div>
            <a class="btn btn-primary btn-header-cta" href="${c.contact}" data-open-wizard data-wizard-type="${p.wizard}" data-i18n="cta.startShort">${t.contact}</a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="${t.openMenu}" data-i18n-aria="cta.menu"><span></span></button>
          </div>
        </div>
      </div>
    </header>
    <nav class="nav-mobile" id="mobile-nav" aria-label="${t.mobile}" data-i18n-aria="a11y.mobileNav" aria-hidden="true" inert>
      <div class="nav-mobile-head"><p class="nav-mobile-label" data-i18n="nav.menuLabel">${t.menu}</p></div>
      <div class="nav-mobile-links">
        ${nav.replace(/\n {10}/g, "\n        ")}
      </div>
      <div class="nav-mobile-foot">
        <a class="btn btn-nav-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">${t.whatsapp}</a>
        <a class="btn btn-primary btn-nav-mobile" href="${c.contact}" data-open-wizard data-wizard-type="${p.wizard}" data-i18n="cta.start">${t.start}</a>
      </div>
    </nav>

    <main id="main">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="${t.breadcrumb}" data-i18n-aria="a11y.breadcrumb">
          <ol>
            <li><a href="${c.home}">${home}</a></li>
            <li><a href="${c.services}">${servicesName}</a></li>
            <li aria-current="page">${esc(p.crumb)}</li>
          </ol>
        </nav>
      </div>
      <header class="page-hero wrap">
        <p class="kicker">${esc(p.kicker)}</p>
        <h1>${esc(p.h1)}</h1>
        <p class="lead">${p.lead}</p>
        <div class="page-hero-actions">
          <a class="btn btn-primary" href="${c.contact}" data-open-wizard data-wizard-type="${p.wizard}" data-ps-event="hero_cta" data-ps-label="${p.id}">${esc(p.cta)}</a>
          <a class="btn btn-ghost" href="https://wa.me/201553766199" data-wa data-ps-event="whatsapp_cta" data-ps-label="${p.id}">${esc(p.waCta)}</a>
        </div>
        <p class="landing-proof"><a href="${c.reviews}"><span aria-hidden="true">★★★★★</span> ${esc(p.proof)}</a></p>
      </header>

${p.sections.join("\n\n")}

${faqSection(p.faqKicker, p.faqTitle, p.faq)}

      <section class="section section-dark final">
        <div class="wrap">
          <p class="kicker">${esc(p.final.kicker)}</p>
          <h2>${esc(p.final.title)}</h2>
          <p>${p.final.body}</p>
          <div class="final-actions">
            <a class="btn btn-mint" href="${c.contact}" data-open-wizard data-wizard-type="${p.wizard}" data-ps-event="final_cta" data-ps-label="${p.id}">${esc(p.final.cta)}</a>
            <a class="btn btn-ghost-invert" href="https://wa.me/201553766199" data-wa data-ps-event="whatsapp_cta" data-ps-label="${p.id}-final">${t.whatsapp}</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-grid wrap-wide">
        <div class="footer-brand">
          <img class="footer-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
          <p>${t.note}</p>
        </div>
        <div class="footer-col">
          <p class="footer-label">${t.contactLabel}</p>
          <a href="mailto:info@powershift.space" data-email-link dir="ltr">info@powershift.space</a>
          <a href="tel:+201553766199" data-tel dir="ltr">+20 155 376 6199</a>
          <a href="https://wa.me/201553766199" data-wa>${t.whatsapp}</a>
          <span>${t.location}</span>
        </div>
        <div class="footer-col">
          <p class="footer-label">${t.explore}</p>
          ${explore}
        </div>
        <div class="footer-col">
          <p class="footer-label">${t.follow}</p>
          <a href="https://www.instagram.com/powershift.dev/" rel="me noopener" target="_blank">Instagram</a>
          <a href="https://www.facebook.com/people/Power-Shift/61573374143956/" rel="me noopener" target="_blank">Facebook</a>
          <a href="https://www.linkedin.com/in/nasser-ahmed-6384a824a" rel="me noopener" target="_blank">LinkedIn</a>
        </div>
      </div>
      <div class="footer-base wrap-wide">
        <span>POWER SHIFT · <span data-year>2026</span> · ${t.rights}</span>
        <span>${t.privacy}</span>
      </div>
    </footer>
    <div class="sticky-bar" data-sticky-bar>
      <a class="btn btn-primary btn-sticky-start" href="${c.contact}" data-open-wizard data-wizard-type="${p.wizard}" data-i18n="cta.startShort">${t.contact}</a>
      <a class="btn btn-mint btn-sticky-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">${t.whatsapp}</a>
    </div>
${dialog(t)}
    <script type="module" src="/js/main.js?v=${V.main}"></script>
  </body>
</html>
`;
}

function cards(items, gridClass = "about-page-grid") {
  return `          <div class="${gridClass}">
${items.map(([h, body]) => `            <article class="about-page-card"><h3>${esc(h)}</h3><p>${body}</p></article>`).join("\n")}
          </div>`;
}

function serviceRows(items) {
  return items
    .map(
      ([title, body], i) =>
        `            <article class="service-row"><span class="svc-n">${String(i + 1).padStart(2, "0")}</span><h3 class="svc-title">${esc(title)}</h3><p class="svc-body">${body}</p></article>`
    )
    .join("\n");
}

function processSteps(items) {
  return items
    .map(
      ([title, body], i) =>
        `            <article class="process-step"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(title)}</h3><p>${body}</p></article>`
    )
    .join("\n");
}

function section({ kicker, title, intro, body, dark = false, extraClass = "" }) {
  const cls = ["section", dark ? "section-dark" : "", extraClass].filter(Boolean).join(" ");
  return `      <section class="${cls}">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">${esc(kicker)}</p>
            <h2>${esc(title)}</h2>${intro ? `\n            <p>${intro}</p>` : ""}
          </div>
${body}
        </div>
      </section>`;
}

const AR_PROCESS = [
  ["فهم النشاط والهدف", "نحدد الجمهور والفعل المطلوب والقيود والمحتوى المتاح."],
  ["تحديد النطاق كتابةً", "نكتب الصفحات واللغات والوظائف وما يمكن تأجيله، قبل أي سعر."],
  ["التصميم والمحتوى", "نبني الهيكل والواجهة ومسار التواصل، ونحدد من يجهّز النصوص والصور."],
  ["البرمجة والمراجعة", "رابط تجريبي تفتحه من موبايلك وتراجعه، ثم تعديلات النطاق المتفق عليه."],
  ["الإطلاق", "نراجع الصفحات والروابط والنماذج وقابلية الفهرسة في جوجل قبل النشر."],
  ["ما بعد الإطلاق", "صيانة وتحديثات والنسخة التالية حسب اتفاق المشروع."],
];

const pages = [
  {
    id: "egypt-ar",
    file: "ar/تصميم-مواقع-مصر/index.html",
    path: PATHS.egyptAr,
    lang: "ar",
    alternates: { en: PATHS.egyptEn, ar: PATHS.egyptAr },
    langSwitch: { en: PATHS.egyptEn, ar: PATHS.egyptAr },
    wizard: "website",
    title: "تصميم مواقع في مصر للشركات والعيادات والمتاجر | باور شيفت",
    description:
      "شركة تصميم مواقع في القاهرة: موقع شركة أو عيادة أو متجر إلكتروني بالعربي والإنجليزي، مسار واتساب واضح، ونطاق مكتوب قبل السعر. أمثلة حية و15 تقييم 5 نجوم.",
    crumb: "تصميم مواقع في مصر",
    kicker: "تصميم وتطوير مواقع في مصر",
    h1: "تصميم مواقع في مصر للشركات — بنطاق واضح قبل السعر",
    lead: "نصمم ونبرمج مواقع الشركات والعيادات ومكاتب المحاماة والمتاجر الإلكترونية من القاهرة. الهدف ليس صفحة جميلة فقط، بل موقع يفهمه العميل من الموبايل ويقوده إلى مكالمة أو رسالة واتساب أو طلب.",
    cta: "ناقش موقعك",
    waCta: "راسلنا على واتساب",
    proof: "5.0 من 15 مراجعة عملاء — اقرأها",
    service: {
      name: "تصميم وتطوير مواقع الشركات في مصر",
      description: "تصميم وبرمجة مواقع الشركات والعيادات والمتاجر الإلكترونية بالعربي والإنجليزي من باور شيفت في القاهرة.",
      type: "Website design and development",
      areaServed: ["Egypt"],
    },
    sections: [
      section({
        kicker: "لمن هذه الخدمة؟",
        title: "للشركة التي تحتاج موقعًا يؤدي وظيفة واضحة",
        intro: "قبل التصميم نسأل: من سيزور الموقع، ماذا يحتاج أن يفهم، وما الخطوة التي يجب أن يتخذها؟",
        extraClass: "about-page",
        body: cards([
          ["الشركات ومقدمو الخدمات", "لعرض الخدمات والخبرة ورابط واحد ترسله للعميل بدل أن تشرح كل مرة ماذا تقدم."],
          ["العيادات والأطباء", 'لتوضيح التخصص والفريق وأماكن العيادات ومسار حجز عبر واتساب — مثل <a href="/work/heba.html">موقع عيادة د. هبة عز العرب</a>.'],
          ["مكاتب المحاماة والممارسات المهنية", 'لعرض مجالات العمل بلغة يفهمها العميل ومسار تواصل مباشر — مثل <a href="/work/radwan.html">موقع مكتب رضوان عز العرب</a>.'],
          ["المتاجر والعلامات والموردون", 'لكتالوج أو متجر أو طلب جملة. التفاصيل في صفحة <a href="/ar/تصميم-متجر-الكتروني">تصميم متجر إلكتروني في مصر</a>.'],
        ]),
      }),
      section({
        kicker: "ماذا نبني؟",
        title: "موقع يناسب طريقة بيعك، لا قالب جاهز",
        dark: true,
        body: `          <div class="service-table">
${serviceRows([
  ["موقع شركة", "صفحات واضحة للنشاط والخدمات والأعمال والتواصل."],
  ["موقع تعريفي وتسويقي", "هيكل ومحتوى يساعد العميل على الفهم واتخاذ الخطوة التالية."],
  ["متجر أو كتالوج إلكتروني", "تصفح منتجات وسلة وطلب عبر واتساب أو دفع أو طلب جملة حسب نشاطك."],
  ["صفحة هبوط", "عرض واحد وجمهور واحد وفعل واضح، عندما لا تحتاج موقعًا كاملًا."],
  ["موقع عربي وإنجليزي", "محتوى وواجهة وRTL تُبنى معًا من البداية، لا ترجمة تُضاف في النهاية."],
])}
          </div>
          <p class="services-also">لمنتجات SaaS وأنظمة الفواتير والمخزون، راجع <a href="/ar/services">كل خدمات باور شيفت</a>.</p>`,
      }),
      section({
        kicker: "أعمال يمكن فتحها",
        title: "مواقع ومتاجر حقيقية نفذناها",
        intro: "لا ننشر نتائج أو أرقامًا لم يصرّح بها العميل. كل رابط يشرح نطاق المشروع وحالته المنشورة.",
        body: `          <div class="related-grid">
${workCards("ar", [
  ["heba", "موقع عيادة د. هبة عز العرب", "موقع عيادة بلغتين لطب المسنين، مع أماكن العيادات في القاهرة وحجز عبر واتساب."],
  ["radwan", "موقع مكتب رضوان عز العرب للمحاماة", "موقع مكتب محاماة بالعربي لمجالات العمل ونماذج قضايا مجهّلة وحجز عبر واتساب."],
  ["medlab", "متجر MedLab Market للمستلزمات الطبية", "كتالوج عربي للمستلزمات الطبية والمعملية مع سلة ومسار طلب عرض سعر."],
  ["nourvive", "متجر Nourvive للجمال", "واجهة متجر جمال في القاهرة بكتالوج عربي وإنجليزي ومسار سلة."],
  ["corolla", "متجر Corolla للفواكه المجففة", "متجر علامة مصرية يبيع للمنازل ويستقبل طلبات الجملة."],
  ["via", "موقع VIA Holidays للسفر", "موقع سفر بصفحات وجهات لمصر والأردن وتركيا ومسار استفسار واضح."],
])}
          </div>`,
      }),
      reviewsSection("ar", ["marwan", "hazem", "basant", "mahmoud"], {
        kicker: "آراء العملاء",
        title: "ماذا يقول أصحاب المواقع",
        note: "المتوسط من 15 مراجعة عملاء",
        readAll: "اقرأ كل المراجعات",
        leave: "اكتب تقييمك",
      }),
      section({
        kicker: "طريقة العمل",
        title: "من فهم المطلوب إلى الإطلاق والدعم",
        body: `          <div class="process">
${processSteps(AR_PROCESS)}
          </div>`,
      }),
      `      <section class="section about-page">
        <div class="wrap about-page-grid">
          <article class="about-page-card">
            <p class="kicker">التكلفة</p>
            <h2>سعر تصميم الموقع يتبع النطاق</h2>
            <p>عدد الصفحات، والعربي والإنجليزي، وكتابة المحتوى، والمتجر أو الدفع، والتكاملات، والوظائف المخصصة كلها تغيّر حجم العمل. لذلك لا ننشر رقمًا واحدًا لا يصف مشروعك.</p>
            <p>للمقارنة الصحيحة بين العروض، اقرأ <a href="/ar/blog/how-much-does-a-website-cost-in-egypt.html">كم تكلفة عمل موقع إلكتروني في مصر</a>.</p>
          </article>
          <article class="about-page-card">
            <p class="kicker">النطاق</p>
            <h2>ما الذي يُحسم قبل العرض؟</h2>
            <p>الهدف، الصفحات، اللغات، من يجهّز النصوص والصور، طريقة التواصل أو الطلب، أي تكاملات، ومن يملك الدومين والاستضافة، ومن سيحدّث الموقع بعد الإطلاق.</p>
            <p>هذا يمنع مقارنة موقع شركة بمتجر أو نظام تشغيل كأنها المهمة نفسها.</p>
          </article>
        </div>
      </section>`,
      section({
        kicker: "اقرأ قبل أن تبدأ",
        title: "إجابات مكتوبة لأسئلة أصحاب الشركات في مصر",
        body: `          <div class="related-grid">
${readingCards([
  ["/ar/blog/how-much-does-a-website-cost-in-egypt.html", "كم تكلفة عمل موقع في مصر؟", "ما الذي يرفع السعر أو يخفّضه، وكيف تقارن عرضين."],
  ["/ar/blog/how-long-does-it-take-to-build-a-website.html", "كم يستغرق تصميم موقع؟", "ما الذي يؤخر التسليم فعلًا، وما الذي بيدك أنت."],
  ["/ar/blog/domain-and-hosting-for-business-website.html", "الدومين والاستضافة: ماذا يجب أن تملك؟", "حتى لا يبقى موقعك باسم المبرمج."],
  ["/ar/blog/how-to-choose-a-website-company-in-egypt.html", "كيف تختار شركة تصميم مواقع في مصر", "روابط حية، نطاق مكتوب، ومن يصون الموقع بعد الإطلاق."],
  ["/ar/blog/facebook-or-website-for-business-egypt.html", "فيسبوك أم موقع لنشاطك؟", "متى تكفي الصفحة ومتى تحتاج موقعًا تملكه."],
  ["/ar/blog/clinic-website-egypt.html", "ماذا يحتاج موقع العيادة أو الطبيب؟", "الصفحات التي تجعل المريض يحجز بدل أن يسأل."],
])}
          </div>`,
      }),
    ],
    faqKicker: "أسئلة شائعة",
    faqTitle: "إجابات قبل أن ترسل تفاصيل المشروع",
    faq: [
      ["كم تكلفة تصميم موقع شركة في مصر؟", 'لا يوجد سعر واحد لكل المواقع. تتبع التكلفة الصفحات واللغات والمحتوى والتكاملات والوظائف، ونحددها بعد فهم النطاق. اقرأ <a href="/ar/blog/how-much-does-a-website-cost-in-egypt.html">ما الذي يغيّر التكلفة</a>.'],
      ["كم يستغرق تنفيذ الموقع؟", 'تتحدد المدة بعد معرفة حجم الموقع وجاهزية المحتوى واللغات والوظائف، ونكتبها في النطاق قبل البدء. أكثر ما يؤخر المواقع هو تأخر النصوص والصور — راجع <a href="/ar/blog/how-long-does-it-take-to-build-a-website.html">مدة تصميم الموقع</a>.'],
      ["هل تنفذون الموقع بالعربي والإنجليزي؟", "نعم، عندما يكون ذلك ضمن النطاق. تُبنى الواجهة والنصوص وRTL معًا بدل إضافة العربية في النهاية."],
      ["هل تعملون مع عملاء خارج القاهرة؟", 'نعم. نعمل من القاهرة مع عملاء في محافظات مصر وفي الخليج عن بُعد، عبر واتساب ومكالمات وروابط مراجعة. لعملاء السعودية والإمارات راجع <a href="/ar/تصميم-مواقع-الخليج">تصميم مواقع للشركات في الخليج</a>.'],
      ["ماذا عن الدومين والاستضافة؟", 'نحدد داخل النطاق من يملك الدومين والاستضافة ومن يديرهما. ننصح أن يكون الدومين باسم شركتك وحسابك — راجع <a href="/ar/blog/domain-and-hosting-for-business-website.html">الدومين والاستضافة</a>.'],
      ["هل أستطيع تعديل المحتوى بعد الإطلاق؟", "يعتمد ذلك على طريقة بناء المشروع وما تحتاج إلى تحديثه. نحدد الصفحات أو البيانات القابلة للإدارة ضمن النطاق."],
      ["هل يظهر الموقع في جوجل؟", 'نبني صفحات قابلة للفهرسة بعناوين ووصف وهيكل صحيح، ولا نبيع ضمانات ترتيب. اقرأ <a href="/ar/blog/why-isnt-my-website-showing-on-google.html">لماذا لا يظهر موقعي على جوجل</a>.'],
      ["هل يوجد دعم وصيانة؟", "نعم. الصيانة والتحديثات والنسخة التالية تُناقش ضمن الاتفاق، ولا ينتهي العمل برسالة تسليم فقط."],
    ],
    final: {
      kicker: "الخطوة التالية",
      title: "أرسل ما تبيعه وما الذي تريد من الموقع أن يفعله",
      body: "سنساعدك في تحديد هل تحتاج موقع شركة أو متجرًا أو صفحة هبوط، وما الذي يجب أن يدخل النسخة الأولى.",
      cta: "ابدأ تحديد النطاق",
    },
  },
  {
    id: "egypt-en",
    file: "web-design-egypt/index.html",
    path: PATHS.egyptEn,
    lang: "en",
    alternates: { en: PATHS.egyptEn, ar: PATHS.egyptAr },
    langSwitch: { en: PATHS.egyptEn, ar: PATHS.egyptAr },
    wizard: "website",
    title: "Web Design Company in Egypt | Business Websites by Power Shift Cairo",
    description:
      "Website design and development in Cairo for companies, clinics, law offices and shops in Egypt. Arabic and English, WhatsApp-first enquiries, a written scope before price. 15 five-star reviews.",
    crumb: "Web design in Egypt",
    kicker: "Web design & development in Egypt",
    h1: "Web design in Egypt for companies that need enquiries, not just a homepage",
    lead: "Power Shift designs and builds websites for companies, clinics, law offices and shops from Cairo. The job is a site a customer understands on their phone — and a clear path to a call, a WhatsApp message, or an order.",
    cta: "Discuss your website",
    waCta: "Message us on WhatsApp",
    proof: "5.0 from 15 client reviews — read them",
    service: {
      name: "Website design and development in Egypt",
      description: "Custom websites, bilingual Arabic/English sites and e-commerce storefronts for businesses in Egypt, built by Power Shift in Cairo.",
      type: "Website design and development",
      areaServed: ["Egypt"],
    },
    sections: [
      section({
        kicker: "Who it is for",
        title: "Businesses that need a website with a job to do",
        intro: "Before design we ask three questions: who visits, what they need to understand, and what they should do next.",
        extraClass: "about-page",
        body: cards([
          ["Companies and service firms", "One link you can send a prospect instead of explaining what you do every time."],
          ["Clinics and doctors", 'Specialty, team, clinic locations and a WhatsApp booking path — like the <a href="/work/heba.html">Dr. Heba Ezz El-Arab clinic site</a>.'],
          ["Law offices and professional practices", 'Practice areas in plain language and a direct contact path — like the <a href="/work/radwan.html">Radwan Ezz El-Arab law office site</a>.'],
          ["Shops, brands and suppliers", 'A catalogue, a cart, or a wholesale enquiry path — see <a href="/work/medlab.html">MedLab Market</a> and <a href="/work/corolla.html">Corolla</a>.'],
        ]),
      }),
      section({
        kicker: "What we build",
        title: "A site that fits how you sell — not a template",
        dark: true,
        body: `          <div class="service-table">
${serviceRows([
  ["Company website", "Clear pages for the business, services, work and contact."],
  ["Marketing site", "Structure and copy that help a visitor understand and take the next step."],
  ["Shop or catalogue", "Products, cart, and WhatsApp order, checkout or wholesale enquiry — whatever the business actually needs."],
  ["Landing page", "One offer, one audience, one action, when a full site is not needed yet."],
  ["Arabic and English site", 'Content, interface and RTL built together — see <a href="/blog/bilingual-arabic-english-website-egypt-gcc.html">why bilingual is its own job</a>.'],
])}
          </div>
          <p class="services-also">For SaaS products and operations systems, see <a href="/services">all Power Shift services</a>.</p>`,
      }),
      section({
        kicker: "Work you can open",
        title: "Live sites and shops we built",
        intro: "We do not publish results or numbers a client has not approved. Each link explains the scope and what is live.",
        body: `          <div class="related-grid">
${workCards("en", [
  ["heba", "Dr. Heba Ezz El-Arab clinic website", "Bilingual geriatric clinic site with Cairo clinic pages and WhatsApp booking."],
  ["radwan", "Radwan Ezz El-Arab law office website", "Arabic law-office site with practice areas, anonymized case examples and WhatsApp booking."],
  ["medlab", "MedLab Market medical catalogue", "Arabic medical and laboratory catalogue with cart and a quote request path."],
  ["nourvive", "Nourvive beauty storefront", "Bilingual Cairo beauty storefront with categories, product pages and cart."],
  ["lodiamo", "Lodiamo corporate website", "Bilingual corporate site for a UAE food import/export company."],
  ["via", "VIA Holidays travel website", "Travel site with destination pages for Egypt, Jordan and Türkiye and a clear enquiry path."],
])}
          </div>`,
      }),
      reviewsSection("en", ["nour", "mina", "salma", "maya"], {
        kicker: "Client reviews",
        title: "What website clients say",
        note: "Average from 15 client reviews",
        readAll: "Read all reviews",
        leave: "Leave a review",
      }),
      section({
        kicker: "Process",
        title: "From the brief to launch and support",
        body: `          <div class="process">
${processSteps([
  ["Understand the business", "Audience, the action you want, constraints and the content you already have."],
  ["Write the scope", "Pages, languages, features and what can wait — before any price."],
  ["Design and content", "Structure, interface and the contact path, plus who supplies copy and photos."],
  ["Build and review", "A preview link you open on your phone, then the agreed revisions."],
  ["Launch", "Pages, links, forms and Google indexability checked before going live."],
  ["After launch", "Maintenance, updates and the next version, as agreed."],
])}
          </div>`,
      }),
      section({
        kicker: "Read before you brief",
        title: "Written answers for business owners in Egypt",
        body: `          <div class="related-grid">
${readingCards([
  ["/blog/how-much-does-a-website-cost-in-egypt.html", "How much does a website cost in Egypt?", "What moves the price, and how to compare two quotes."],
  ["/blog/how-long-does-it-take-to-build-a-website.html", "How long does it take to build a website?", "What actually delays launch — and what is in your hands."],
  ["/blog/domain-and-hosting-for-business-website.html", "Domain and hosting: what should you own?", "So your site is not registered in the developer's name."],
  ["/blog/how-to-choose-a-website-company-in-egypt.html", "How to choose a website company in Egypt", "Live links, a written scope, and who maintains it."],
])}
          </div>`,
      }),
    ],
    faqKicker: "FAQ",
    faqTitle: "Answers before you send a brief",
    faq: [
      ["How much does a website cost in Egypt?", 'There is no single price. Cost follows pages, languages, content, integrations and features, and we set it after the scope is clear. Read <a href="/blog/how-much-does-a-website-cost-in-egypt.html">what changes website cost</a>.'],
      ["How long does a website take?", 'Timing depends on size, content readiness, languages and features, and is written into the scope before work starts. Late copy and photos are the most common delay — see <a href="/blog/how-long-does-it-take-to-build-a-website.html">website timelines</a>.'],
      ["Do you build Arabic and English websites?", "Yes, when it is part of the scope. Interface, copy and RTL are built together rather than bolted on at the end."],
      ["Do you work with clients outside Cairo?", "Yes. We work from Cairo with clients across Egypt and remotely with clients in the GCC, over WhatsApp, calls and preview links."],
      ["Who owns the domain and hosting?", 'We agree it in the scope. We recommend the domain sits in your company account — see <a href="/blog/domain-and-hosting-for-business-website.html">domain and hosting explained</a>.'],
      ["Will the website show on Google?", 'We build indexable pages with proper titles, descriptions and structure. We do not sell ranking guarantees. Read <a href="/blog/why-isnt-my-website-showing-on-google.html">why a site may not show on Google</a>.'],
      ["Is there support after launch?", "Yes. Maintenance, updates and the next version are part of the agreement, not an afterthought."],
    ],
    final: {
      kicker: "Next step",
      title: "Tell us what you sell and what the site should do",
      body: "We will tell you whether you need a company site, a shop or a landing page — and what belongs in version one.",
      cta: "Start the scope",
    },
  },
  {
    id: "shop-ar",
    file: "ar/تصميم-متجر-الكتروني/index.html",
    path: PATHS.shopAr,
    lang: "ar",
    langSwitch: { en: "/services#ecommerce", ar: PATHS.shopAr },
    wizard: "ecommerce",
    title: "تصميم متجر إلكتروني في مصر | متاجر عربي وإنجليزي — باور شيفت",
    description:
      "تصميم وبرمجة متجر إلكتروني في مصر لعلامات الملابس والتجميل والأغذية والمستلزمات الطبية: كتالوج وسلة وطلب عبر واتساب أو دفع أو طلب جملة. أمثلة حية من القاهرة.",
    crumb: "تصميم متجر إلكتروني",
    kicker: "تصميم متاجر إلكترونية في مصر",
    h1: "تصميم متجر إلكتروني في مصر يناسب طريقة بيعك",
    lead: "بعض النشاطات تحتاج متجرًا بسلة ودفع، وبعضها يحتاج كتالوجًا وطلبًا عبر واتساب أو طلب جملة. نبدأ بتحديد أيهما يناسبك، ثم نبني واجهة عربية أو بلغتين يتصفحها عميلك من الموبايل بسهولة.",
    cta: "ناقش متجرك",
    waCta: "راسلنا على واتساب",
    proof: "5.0 من 15 مراجعة عملاء — اقرأها",
    service: {
      name: "تصميم وتطوير المتاجر الإلكترونية في مصر",
      description: "تصميم وبرمجة متاجر وكتالوجات إلكترونية بالعربي والإنجليزي لعلامات التجزئة والجملة في مصر من باور شيفت في القاهرة.",
      type: "E-commerce website development",
      areaServed: ["Egypt"],
    },
    sections: [
      section({
        kicker: "قبل البناء",
        title: "متجر كامل أم كتالوج وطلب مباشر؟",
        intro: 'هذا أول قرار، وهو يغيّر التكلفة والمدة. شرحناه بالتفصيل في <a href="/ar/blog/ecommerce-website-or-catalogue-egypt.html">متجر إلكتروني أم كتالوج في مصر؟</a>',
        extraClass: "about-page",
        body: cards([
          ["متجر بسلة وإتمام طلب", "عندما يشتري العميل مباشرة: منتجات ومقاسات أو أنواع، سلة، ثم طلب عبر واتساب أو دفع إلكتروني حسب ما يُتفق عليه."],
          ["كتالوج وطلب عرض سعر", "عندما تبيع لشركات أو معامل أو تجار جملة: تصفح حسب القطاع ثم طلب عرض سعر بدل الدفع الفوري."],
          ["متجر للأفراد وطلبات جملة معًا", "عندما تبيع للمنازل وتستقبل طلبات الموزعين في نفس الوقت، بمسارين واضحين."],
          ["واجهة علامة فاخرة", "عندما يكون شكل العلامة وتجربة التصفح جزءًا من البيع، لا مجرد قائمة منتجات."],
        ]),
      }),
      section({
        kicker: "ماذا يشمل المتجر؟",
        title: "ما نحدده معك في النطاق",
        dark: true,
        body: `          <div class="service-table">
${serviceRows([
  ["الأقسام وصفحات المنتجات", "هيكل يسهل على العميل الوصول للمنتج من الموبايل، بصور وأسعار ووصف واضح."],
  ["السلة وطريقة الطلب", "طلب عبر واتساب، أو دفع إلكتروني، أو طلب عرض سعر — حسب نشاطك ومزود الدفع الذي تختاره."],
  ["العربي والإنجليزي", "واجهة RTL صحيحة، ولغة ثانية عندما يخدم ذلك عملاءك فعلًا."],
  ["إدارة المنتجات والأسعار", "نحدد من يضيف المنتجات ويغيّر الأسعار بعد الإطلاق، وكيف."],
  ["الظهور في جوجل", "صفحات منتجات وأقسام قابلة للفهرسة بعناوين ووصف صحيح."],
])}
          </div>
          <p class="services-also">إذا كان فريقك يحتاج فواتير ومخزونًا وعملاء خلف المتجر، فهذا نظام تشغيل — راجع <a href="/work/haseb.html">7aseb</a> و<a href="/ar/services#bms">أنظمة التشغيل</a>.</p>`,
      }),
      section({
        kicker: "متاجر يمكن فتحها",
        title: "متاجر وكتالوجات نفذناها لعلامات في مصر",
        intro: "لا ننشر أرقام مبيعات لم يصرّح بها العميل. كل رابط يشرح ما تم بناؤه.",
        body: `          <div class="related-grid">
${workCards("ar", [
  ["adam", "متجر Adam Trending لملابس الأطفال", "متجر عربي لترنجات الأولاد والبنات مع سلة وإتمام الطلب عبر واتساب."],
  ["nourvive", "متجر Nourvive للجمال", "واجهة متجر جمال في القاهرة بأقسام وصفحات منتجات وسلة، عربي وإنجليزي."],
  ["medlab", "كتالوج MedLab Market الطبي", "كتالوج عربي للمستلزمات الطبية والمعملية بتصفح حسب القطاع وسلة وطلب عرض سعر."],
  ["corolla", "متجر Corolla للفواكه المجففة", "متجر علامة مصرية يبيع للمنازل ويستقبل طلبات الجملة."],
  ["uruz", "موقع URUZ للتجميل الفاخر", "موقع علامة تجميل فاخرة بهيكل تحريري ومجموعات ومتجر."],
])}
          </div>`,
      }),
      reviewsSection("ar", ["rana", "mahmoud", "yassin"], {
        kicker: "آراء العملاء",
        title: "ماذا يقول العملاء",
        note: "المتوسط من 15 مراجعة عملاء",
        readAll: "اقرأ كل المراجعات",
        leave: "اكتب تقييمك",
      }),
      section({
        kicker: "طريقة العمل",
        title: "من قائمة المنتجات إلى أول طلب",
        body: `          <div class="process">
${processSteps([
  ["المنتجات والعميل", "ماذا تبيع، لمن، وكيف يطلب اليوم (واتساب، هاتف، معرض)."],
  ["قرار المتجر أو الكتالوج", "نحدد طريقة الطلب والدفع والشحن وما يؤجَّل للنسخة التالية."],
  ["الهيكل والتصميم", "الأقسام وصفحة المنتج والسلة، مصممة للموبايل أولًا."],
  ["البرمجة وإدخال المنتجات", "رابط تجريبي تراجعه، مع اتفاق واضح على من يُدخل المنتجات والصور."],
  ["الإطلاق", "اختبار الطلب من البداية للنهاية قبل النشر."],
  ["ما بعد الإطلاق", "تحديثات ومنتجات جديدة ونسخة تالية حسب الاتفاق."],
])}
          </div>`,
      }),
    ],
    faqKicker: "أسئلة شائعة",
    faqTitle: "أسئلة أصحاب المتاجر قبل البدء",
    faq: [
      ["كم تكلفة تصميم متجر إلكتروني في مصر؟", 'تتبع التكلفة عدد المنتجات والأقسام، وطريقة الطلب والدفع، واللغات، ومن يُدخل المنتجات. نحددها بعد النطاق — واقرأ <a href="/ar/blog/how-much-does-a-website-cost-in-egypt.html">ما الذي يغيّر التكلفة</a>.'],
      ["هل يمكن أن يكون الطلب عبر واتساب بدل الدفع الإلكتروني؟", 'نعم، وكثير من المتاجر تبدأ هكذا. متجر <a href="/work/adam.html">Adam Trending</a> مثال على سلة تنتهي برسالة واتساب.'],
      ["هل تربطون بوابة دفع وشركة شحن؟", "عندما يكون ذلك ضمن النطاق. نحدد مزود الدفع والشحن مع صاحب النشاط قبل البناء، ولا نفترض تكاملًا لم يُتفق عليه."],
      ["هل أستطيع إضافة المنتجات وتغيير الأسعار بنفسي؟", "نحدد ذلك في النطاق: ما البيانات التي تديرها أنت، وما الذي يحتاج تدخلنا."],
      ["هل تبنون متاجر جملة أو طلب عرض سعر؟", 'نعم. <a href="/work/medlab.html">MedLab Market</a> كتالوج بطلب عرض سعر، و<a href="/work/corolla.html">Corolla</a> يستقبل طلبات الجملة بجانب البيع للأفراد.'],
      ["هل المتجر بالعربي والإنجليزي؟", "حسب جمهورك. نبني RTL صحيحًا للعربية، ونضيف الإنجليزية عندما يكون لها عملاء فعليون."],
    ],
    final: {
      kicker: "الخطوة التالية",
      title: "أرسل ماذا تبيع وكيف يطلب عملاؤك اليوم",
      body: "سنقول لك هل تحتاج متجرًا كاملًا أم كتالوجًا وطلبًا مباشرًا، وما الذي يدخل النسخة الأولى.",
      cta: "ابدأ تحديد نطاق المتجر",
    },
  },
  {
    id: "gcc-ar",
    file: "ar/تصميم-مواقع-الخليج/index.html",
    path: PATHS.gccAr,
    lang: "ar",
    langSwitch: { en: "/services", ar: PATHS.gccAr },
    wizard: "website",
    title: "تصميم مواقع للشركات في السعودية والإمارات والخليج | باور شيفت",
    description:
      "باور شيفت استوديو في القاهرة يصمم مواقع الشركات والمتاجر لعملاء في السعودية والإمارات والكويت وقطر والبحرين وعُمان عن بُعد: عربي أولًا مع الإنجليزي، ونطاق مكتوب، وتواصل على واتساب.",
    crumb: "تصميم مواقع في الخليج",
    kicker: "تصميم مواقع لشركات الخليج",
    h1: "تصميم مواقع للشركات في السعودية والإمارات والخليج — من القاهرة عن بُعد",
    lead: "نحن استوديو في القاهرة، وليس لدينا مكتب في الخليج. نعمل مع شركات في السعودية والإمارات ودول الخليج عن بُعد: نطاق مكتوب، مكالمات ورسائل واتساب، وروابط مراجعة تفتحها من موبايلك في أي وقت.",
    cta: "ناقش موقع شركتك",
    waCta: "راسلنا على واتساب",
    proof: "5.0 من 15 مراجعة عملاء — اقرأها",
    service: {
      name: "تصميم وتطوير مواقع الشركات في الخليج عن بُعد",
      description: "تصميم وبرمجة مواقع الشركات والمتاجر بالعربية والإنجليزية لعملاء في السعودية والإمارات ودول الخليج، تنفذها باور شيفت من القاهرة عن بُعد.",
      type: "Website design and development",
      areaServed: ["Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman"],
    },
    sections: [
      section({
        kicker: "كيف نعمل عن بُعد",
        title: "وضوح في كل خطوة، حتى بدون لقاء",
        intro: "التعامل عن بُعد ينجح عندما يكون كل شيء مكتوبًا ويمكن فتحه. هذا ما نلتزم به.",
        extraClass: "about-page",
        body: cards([
          ["نطاق مكتوب قبل السعر", "الصفحات واللغات والوظائف وما يُؤجَّل، في ملف واحد توافق عليه قبل البدء."],
          ["واتساب ومكالمات مجدولة", "قناة واحدة للقرارات، ومكالمات عند الحاجة. فرق التوقيت بين القاهرة ومدن الخليج لا يتجاوز ساعتين."],
          ["روابط مراجعة حية", "ترى الموقع يُبنى على رابط تجريبي، وتراجعه من الموبايل مع فريقك."],
          ["ما بعد الإطلاق", "صيانة وتحديثات والنسخة التالية حسب الاتفاق، بنفس قناة التواصل."],
        ]),
      }),
      section({
        kicker: "ماذا نبني لشركات الخليج؟",
        title: "مواقع عربية أولًا، وإنجليزية عندما يحتاجها عملاؤك",
        dark: true,
        body: `          <div class="service-table">
${serviceRows([
  ["موقع شركة أو مؤسسة", "صفحات توضّح خدمات المؤسسة بشكل مرتب، ورابط واحد تشاركه مع العملاء."],
  ["موقع عربي وإنجليزي", 'العربية بواجهة RTL صحيحة والإنجليزية كنسخة كاملة لا ترجمة آلية — اقرأ <a href="/ar/blog/bilingual-arabic-english-website-egypt-gcc.html">لماذا الموقع بلغتين مشروع مستقل</a>.'],
  ["متجر أو كتالوج", 'منتجات وسلة وطلب عبر واتساب أو دفع أو طلب جملة — راجع <a href="/ar/تصميم-متجر-الكتروني">تصميم المتاجر الإلكترونية</a>.'],
  ["صفحة هبوط لحملة", "عرض واحد وجمهور واحد وفعل واضح لحملة إعلانية."],
  ["نظام أو منتج SaaS", 'عندما يحتاج فريقك أداة يومية لا موقعًا فقط — راجع <a href="/ar/services">كل الخدمات</a>.'],
])}
          </div>`,
      }),
      section({
        kicker: "أعمال يمكن فتحها",
        title: "مشاريع لأسواق خارج مصر ومواقع بلغتين",
        intro: "لا ننشر نتائج لم يصرّح بها العميل. هذه مشاريع حقيقية يمكنك فتحها.",
        body: `          <div class="related-grid">
${workCards("ar", [
  ["lodiamo", "موقع Lodiamo المؤسسي في الإمارات", "موقع مؤسسي بلغتين لشركة استيراد وتصدير أغذية في الإمارات، مع كتالوج ومسار تواصل تجاري."],
  ["via", "موقع VIA Holidays للسفر", "موقع سفر بالتشيكية والإنجليزية لمسافرين من التشيك إلى مصر والأردن وتركيا."],
  ["nourvive", "متجر Nourvive للجمال", "واجهة متجر بلغتين بأقسام وصفحات منتجات وسلة."],
  ["haseb", "نظام 7aseb للتشغيل", "نظام عربي وإنجليزي للفواتير والمخزون والعملاء والخزينة مع مشاركة عبر واتساب."],
])}
          </div>`,
      }),
      reviewsSection("ar", ["lulwa", "rashid", "abdulrahman", "meshaal"], {
        kicker: "آراء العملاء",
        title: "ماذا يقول العملاء",
        note: "المتوسط من 15 مراجعة عملاء",
        readAll: "اقرأ كل المراجعات",
        leave: "اكتب تقييمك",
      }),
      section({
        kicker: "طريقة العمل",
        title: "من أول رسالة إلى الإطلاق",
        body: `          <div class="process">
${processSteps(AR_PROCESS)}
          </div>`,
      }),
    ],
    faqKicker: "أسئلة شائعة",
    faqTitle: "أسئلة شركات الخليج قبل البدء",
    faq: [
      ["هل لديكم مكتب في السعودية أو الإمارات؟", "لا. باور شيفت تعمل من القاهرة، ونخدم عملاء الخليج عن بُعد عبر واتساب والمكالمات وروابط المراجعة."],
      ["كيف أتأكد من جودة العمل قبل أن أبدأ؟", 'افتح أعمالنا الحية في <a href="/ar/work">صفحة الأعمال</a>، واقرأ <a href="/ar/reviews">مراجعات العملاء</a>، واطلب نطاقًا مكتوبًا قبل أي التزام.'],
      ["هل فرق التوقيت مشكلة؟", "عادةً لا. الفرق بين القاهرة والرياض أو دبي لا يتجاوز ساعتين، ونحدد مواعيد المكالمات مسبقًا."],
      ["هل تبنون المواقع بالعربية أولًا؟", "نعم عندما يكون جمهورك عربيًا. نبني RTL صحيحًا من البداية، ونضيف الإنجليزية كنسخة كاملة عندما يحتاجها عملاؤك."],
      ["كم تكلفة تصميم موقع لشركة في الخليج؟", 'تتبع التكلفة النطاق: الصفحات واللغات والمحتوى والوظائف. نحددها بعد فهم المشروع، ولا ننشر رقمًا واحدًا لا يصف عملك. اقرأ <a href="/ar/blog/how-much-does-a-website-cost-in-egypt.html">ما الذي يغيّر التكلفة</a>.'],
      ["من يملك الدومين والاستضافة؟", 'ننصح أن تكون باسم شركتك وحسابك، ونتفق على ذلك في النطاق — راجع <a href="/ar/blog/domain-and-hosting-for-business-website.html">الدومين والاستضافة</a>.'],
    ],
    final: {
      kicker: "الخطوة التالية",
      title: "أرسل نشاط شركتك وما تريد من الموقع أن يفعله",
      body: "نرد على واتساب بأسئلة النطاق، ثم نقترح ما يدخل النسخة الأولى وما يمكن تأجيله.",
      cta: "ابدأ تحديد النطاق",
    },
  },
];

for (const p of pages) {
  const file = join(root, p.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(p), "utf8");
}
console.log(`Wrote ${pages.length} landing pages`);
