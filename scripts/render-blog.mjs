import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ARTICLES, CATEGORIES, ORIGIN, UI } from "./blog-data.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OG = `${ORIGIN}/assets/og/og-cover.png`;

export function articlePath(slug, lang) {
  return lang === "ar" ? `/ar/blog/${slug}.html` : `/blog/${slug}.html`;
}

export function articleUrl(slug, lang) {
  return `${ORIGIN}${articlePath(slug, lang)}`;
}

export function blogIndexPath(lang) {
  return lang === "ar" ? "/ar/blog" : "/blog";
}

export function renderBody(blocks) {
  if (typeof blocks === "string") return blocks;
  return blocks
    .map(([type, value]) => {
      if (type === "h2") return `<h2>${value}</h2>`;
      if (type === "h3") return `<h3>${value}</h3>`;
      if (type === "p") return `<p>${value}</p>`;
      if (type === "ul") return `<ul>${value.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      if (type === "ol") return `<ol>${value.map((item) => `<li>${item}</li>`).join("")}</ol>`;
      if (type === "html") return value;
      return "";
    })
    .join("\n");
}

function jsonLd(data) {
  return JSON.stringify(data, null, 6).replace(/</g, "\\u003c");
}

function wordCount(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function formatDate(iso, lang) {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function categoryLabel(id, lang) {
  const cat = CATEGORIES.find((item) => item.id === id);
  return cat ? cat[lang] : id;
}

function articleById(id) {
  return ARTICLES.find((item) => item.id === id);
}

function byDate(a, b) {
  return String(b.publishedAt).localeCompare(String(a.publishedAt)) || a.slug.localeCompare(b.slug);
}

function shell({
  lang,
  title,
  description,
  canonical,
  ogType = "website",
  extraHead = "",
  imageAlt = "POWER SHIFT software studio",
  schema,
  page,
  extraBody = "",
  brandHref,
  langEnHref,
  langArHref,
  navBlogHref,
  main,
}) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  const locale = lang === "ar" ? "ar_EG" : "en_US";
  const localeAlt = lang === "ar" ? "en_US" : "ar_EG";
  const arabicFont =
    lang === "ar"
      ? `    <link rel="preload" href="/assets/fonts/ibm-plex-sans-arabic-500.woff2" as="font" type="font/woff2" crossorigin />\n`
      : "";
  const htmlLang = lang === "ar" ? "ar" : "en";
  const blogLabel = lang === "ar" ? "المدونة" : "Blog";
  const skip = lang === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content";

  return `<!DOCTYPE html>
<html lang="${htmlLang}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <script src="/js/lang-boot.js?v=20260831c"></script>
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Nasser Ahmed, POWER SHIFT" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${langEnHref.startsWith("http") ? langEnHref : ORIGIN + langEnHref}" />
    <link rel="alternate" hreflang="ar" href="${langArHref.startsWith("http") ? langArHref : ORIGIN + langArHref}" />
    <link rel="alternate" hreflang="x-default" href="${langEnHref.startsWith("http") ? langEnHref : ORIGIN + langEnHref}" />
    <meta name="theme-color" content="#12243C" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="POWER SHIFT" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${localeAlt}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${OG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG}" />
    ${extraHead}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/instrument-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin />
${arabicFont}
    <link rel="stylesheet" href="/css/app.css?v=20260829g" />
    <link rel="stylesheet" href="/css/pages.css?v=20260829c" />
    <link rel="stylesheet" href="/css/blog.css?v=20260831c" />
    <script type="application/ld+json">
${schema}
    </script>
  </head>
  <body data-page="${page}"${extraBody}>
    <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
    <a class="skip" href="#main" data-i18n="skip">${skip}</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${brandHref}" aria-label="POWER SHIFT">
          <img class="brand-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
        </a>
        <nav class="nav-desktop" aria-label="Primary" data-i18n-aria="a11y.primaryNav">
          <a href="/work" data-i18n="nav.work">Work</a>
          <a href="/services" data-i18n="nav.services">Services</a>
          <a href="${navBlogHref}" data-nav="blog" data-i18n="nav.blog">${blogLabel}</a>
          <a href="/#approach" data-i18n="nav.approach">Approach</a>
          <a href="/#about" data-i18n="nav.about">About</a>
          <a href="/contact" data-i18n="nav.contact">Contact</a>
        </nav>
        <div class="header-end">
          <div class="header-actions">
            <div class="lang-switch" role="group" aria-label="Language" data-i18n-aria="a11y.language">
              <span class="lang-thumb" aria-hidden="true"></span>
              <a href="${langEnHref}" data-lang="en" hreflang="en"${lang === "en" ? ' aria-current="true"' : ""}><span class="lang-flag lang-flag-en" aria-hidden="true"></span>EN</a>
              <a href="${langArHref}" data-lang="ar" hreflang="ar"${lang === "ar" ? ' aria-current="true"' : ""}><span class="lang-flag lang-flag-ar" aria-hidden="true"></span>عربي</a>
            </div>
            <a class="btn btn-primary btn-header-cta" href="/contact" data-open-wizard data-ps-event="hero_cta" data-i18n="cta.startShort">Book a Call</a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu" data-i18n-aria="cta.menu">
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <nav class="nav-mobile" id="mobile-nav" aria-label="Mobile" data-i18n-aria="a11y.mobileNav" aria-hidden="true" inert>
      <div class="nav-mobile-head"><p class="nav-mobile-label" data-i18n="nav.menuLabel">Menu</p></div>
      <div class="nav-mobile-links">
        <a href="/work" data-i18n="nav.work">Work</a>
        <a href="/services" data-i18n="nav.services">Services</a>
        <a href="${navBlogHref}" data-nav="blog" data-i18n="nav.blog">${blogLabel}</a>
        <a href="/#approach" data-i18n="nav.approach">Approach</a>
        <a href="/#about" data-i18n="nav.about">About</a>
        <a href="/contact" data-i18n="nav.contact">Contact</a>
      </div>
      <div class="nav-mobile-foot">
        <a class="btn btn-nav-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">WhatsApp</a>
        <a class="btn btn-primary btn-nav-mobile" href="/contact" data-open-wizard data-i18n="cta.start">Book a Scope Call</a>
      </div>
    </nav>
    <main id="main">
${main}
    </main>
    <footer class="footer">
      <div class="footer-grid wrap-wide">
        <div class="footer-brand">
          <img class="footer-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
          <p data-i18n="footer.note">Software studio · Cairo · Egypt · GCC · International</p>
        </div>
        <div class="footer-col">
          <p class="footer-label" data-i18n="footer.contact">Contact</p>
          <a href="mailto:info@powershift.space" data-email-link dir="ltr">info@powershift.space</a>
          <a href="tel:+201553766199" data-tel>+20 155 376 6199</a>
          <a href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">WhatsApp</a>
          <span data-i18n="footer.location">Cairo, Egypt</span>
        </div>
        <div class="footer-col">
          <p class="footer-label" data-i18n="nav.work">Work</p>
          <a href="/work" data-copy="ourWork">Our Work</a>
          <a href="/work/via-holidays.html" data-copy="viaCase">VIA Holidays case study</a>
          <a href="/work/nourvive.html" data-copy="nourviveCase">Nourvive e-commerce work</a>
          <a href="/services" data-copy="servicesLink">Web & software services</a>
          <a href="${navBlogHref}" data-nav="blog" data-i18n="nav.blog">${blogLabel}</a>
          <a href="/contact" data-i18n="cta.start">Book a Scope Call</a>
        </div>
        <div class="footer-col">
          <p class="footer-label" data-i18n="footer.follow">Follow</p>
          <a href="https://www.instagram.com/powershift.dev/" rel="me noopener" target="_blank" data-i18n="footer.instagram" aria-label="POWER SHIFT on Instagram">Instagram</a>
          <a href="https://www.facebook.com/people/Power-Shift/61573374143956/" rel="me noopener" target="_blank" data-i18n="footer.facebook" aria-label="POWER SHIFT on Facebook">Facebook</a>
          <a href="https://www.linkedin.com/in/nasser-ahmed-6384a824a" rel="me noopener" target="_blank" data-i18n="footer.linkedin" aria-label="Nasser Ahmed, POWER SHIFT founder, on LinkedIn">LinkedIn</a>
        </div>
      </div>
      <div class="footer-base wrap-wide">
        <span>POWER SHIFT · <span data-year>2026</span> · <span data-i18n="footer.rights">All rights reserved.</span></span>
        <span data-i18n="footer.privacy">Briefs go to our WhatsApp. We do not sell your data.</span>
      </div>
    </footer>
    <div class="sticky-bar" data-sticky-bar>
      <a class="btn btn-primary btn-sticky-start" href="/contact" data-open-wizard data-i18n="cta.startShort">Book a Call</a>
      <a class="btn btn-mint btn-sticky-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">WhatsApp</a>
    </div>
    <dialog class="dialog" id="project-dialog" aria-labelledby="wizard-title">
      <div class="dialog-inner">
        <div class="dialog-head">
          <div>
            <p class="kicker" data-i18n="qualify.kicker">Start</p>
            <h2 id="wizard-title" data-i18n="wizard.dialogLabel">Book a Scope Call</h2>
          </div>
          <button class="icon-btn" type="button" data-close-wizard aria-label="Close" data-i18n-aria="cta.close">×</button>
        </div>
        <div class="progress" data-progress></div>
        <h3 data-q></h3>
        <div class="choice-grid" data-choices></div>
        <div class="contact-fields" data-contact-fields hidden>
          <label>
            <span data-label-name data-i18n="qualify.name">Name</span>
            <input type="text" name="name" autocomplete="name" data-field-name required />
            <span class="field-error" data-error-name hidden></span>
          </label>
          <label>
            <span data-label-email data-i18n="qualify.email">Email</span>
            <input type="email" name="email" autocomplete="email" data-field-email required />
            <span class="field-error" data-error-email hidden></span>
          </label>
          <label>
            <span data-label-phone data-i18n="qualify.phone">Phone (optional)</span>
            <input type="tel" name="phone" autocomplete="tel" inputmode="tel" data-field-phone />
            <span class="field-error" data-error-phone hidden></span>
          </label>
          <label>
            <span data-label-company data-i18n="qualify.company">Company</span>
            <input type="text" name="company" autocomplete="organization" data-field-company />
          </label>
          <label class="span-2">
            <span data-label-note data-i18n="qualify.note">Note</span>
            <textarea name="note" rows="3" data-field-note></textarea>
          </label>
        </div>
        <p class="price-note" data-price-note></p>
        <p class="price-note" data-ready-note></p>
        <p class="price-note" data-privacy></p>
        <p class="form-status" data-form-status hidden></p>
        <div class="wizard-nav">
          <button class="btn btn-ghost" type="button" data-back hidden>Back</button>
          <div class="wizard-nav-end">
            <button class="btn btn-ghost" type="button" data-email-send hidden>Send by email</button>
            <button class="btn btn-primary" type="button" data-next>Continue</button>
          </div>
        </div>
      </div>
    </dialog>
    <script type="module" src="/js/main.js?v=20260831c"></script>
  </body>
</html>
`;
}

function writeOut(rel, html) {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, "utf8");
}

function indexPage(lang) {
  const ui = UI[lang];
  const featured = ARTICLES.find((item) => item.featured) || ARTICLES[0];
  const rest = ARTICLES.filter((item) => item.id !== featured.id).sort(byDate);
  const popular = ARTICLES.filter((item) => item.popular && item.id !== featured.id).slice(0, 3);
  const copy = featured[lang];
  const featuredHref = articlePath(featured.slug, lang);

  const filters = [
    `<button type="button" data-filter="all" aria-pressed="true">${ui.all}</button>`,
    ...CATEGORIES.map(
      (cat) => `<button type="button" data-filter="${cat.id}" aria-pressed="false">${cat[lang]}</button>`
    ),
  ].join("\n            ");

  const rows = rest
    .map((item) => {
      const loc = item[lang];
      const search = [loc.title, loc.excerpt, loc.primaryKeyword, ...(loc.secondaryKeywords || [])].join(" ");
      return `<a class="blog-row" href="${articlePath(item.slug, lang)}" data-blog-row data-category="${item.category}" data-search="${search.replace(/"/g, "&quot;")}">
            <span class="blog-row-cat">${categoryLabel(item.category, lang)}</span>
            <h2 class="blog-row-title">${loc.title}</h2>
            <span class="blog-meta">${formatDate(item.publishedAt, lang)}</span>
            <p>${loc.excerpt}</p>
          </a>`;
    })
    .join("\n          ");

  const popularHtml = popular.length
    ? `<section class="section">
        <div class="wrap">
          <p class="kicker">${ui.popular}</p>
          <div class="blog-related">
            ${popular
              .map((item) => {
                const loc = item[lang];
                return `<a href="${articlePath(item.slug, lang)}"><span class="blog-row-cat">${categoryLabel(item.category, lang)}</span><strong>${loc.title}</strong></a>`;
              })
              .join("\n            ")}
          </div>
        </div>
      </section>`
    : "";

  const listItems = ARTICLES.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: articleUrl(item.slug, lang),
    name: item[lang].title,
  }));

  const canonical = `${ORIGIN}${blogIndexPath(lang)}`;
  const schema = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#page`,
        name: ui.seoTitle,
        url: canonical,
        inLanguage: lang,
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#business` },
        description: ui.seoDescription,
        mainEntity: {
          "@type": "ItemList",
          name: ui.h1,
          itemListElement: listItems,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: lang === "ar" ? `${ORIGIN}/ar` : `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: ui.blog, item: canonical },
        ],
      },
    ],
  });

  const main = `      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb" data-i18n-aria="a11y.breadcrumb">
          <ol>
            <li><a href="${lang === "ar" ? "/ar" : "/"}" data-copy="home">${ui.home}</a></li>
            <li aria-current="page">${ui.blog}</li>
          </ol>
        </nav>
      </div>
      <header class="page-hero wrap blog-hero">
        <p class="kicker">${ui.kicker}</p>
        <h1>${ui.h1}</h1>
        <p class="lead">${ui.lead}</p>
        <form class="blog-search" role="search" action="${blogIndexPath(lang)}" method="get">
          <label>
            <span>${ui.searchLabel}</span>
            <input type="search" name="q" data-blog-search autocomplete="off" placeholder="${ui.searchPlaceholder}" />
          </label>
        </form>
        <div class="blog-cats" data-blog-filters>
            ${filters}
        </div>
      </header>
      <section class="section" data-blog-featured data-category="${featured.category}">
        <div class="wrap">
          <p class="kicker">${ui.featured}</p>
          <article class="blog-featured">
            <div class="blog-cover" data-tone="${featured.tone}">
              <p class="kicker">${categoryLabel(featured.category, lang)}</p>
              <strong>${copy.title}</strong>
            </div>
            <div class="blog-featured-copy">
              <p class="blog-meta"><span>${formatDate(featured.publishedAt, lang)}</span></p>
              <h2>${copy.title}</h2>
              <p>${copy.excerpt}</p>
              <a class="btn btn-primary" href="${featuredHref}">${ui.read}</a>
            </div>
          </article>
        </div>
      </section>
      <section class="section">
        <div class="wrap">
          <p class="kicker">${ui.latest}</p>
          <div class="blog-list" data-blog-list>
          ${rows}
          </div>
          <p class="blog-empty" data-blog-empty hidden>${ui.empty}</p>
        </div>
      </section>
      ${popularHtml}
      <section class="section section-dark final">
        <div class="wrap">
          <p class="kicker">${ui.ctaKicker}</p>
          <h2>${ui.ctaTitle}</h2>
          <p>${ui.ctaBody}</p>
          <a class="btn btn-mint" href="/contact" data-open-wizard data-i18n="cta.start">${ui.ctaButton}</a>
        </div>
      </section>`;

  return shell({
    lang,
    title: ui.seoTitle,
    description: ui.seoDescription,
    canonical,
    schema,
    page: "blog",
    brandHref: lang === "ar" ? "/ar" : "/",
    langEnHref: "/blog",
    langArHref: "/ar/blog",
    navBlogHref: blogIndexPath(lang),
    main,
  });
}

function articlePage(article, lang) {
  const loc = article[lang];
  const ui = UI[lang];
  const body = renderBody(loc.body);
  const canonical = articleUrl(article.slug, lang);
  const related = (article.related || []).map(articleById).filter(Boolean);
  const words = wordCount(body);

  const schema = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: loc.h1,
        description: loc.seoDescription,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        inLanguage: lang,
        url: canonical,
        mainEntityOfPage: canonical,
        wordCount: words,
        keywords: [loc.primaryKeyword, ...(loc.secondaryKeywords || [])],
        image: {
          "@type": "ImageObject",
          url: OG,
          width: 1200,
          height: 630,
        },
        author: {
          "@type": "Person",
          name: "Nasser Ahmed",
          url: "https://www.linkedin.com/in/nasser-ahmed-6384a824a",
        },
        publisher: { "@id": `${ORIGIN}/#business` },
        isPartOf: { "@id": `${ORIGIN}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: lang === "ar" ? `${ORIGIN}/ar` : `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: ui.blog, item: `${ORIGIN}${blogIndexPath(lang)}` },
          { "@type": "ListItem", position: 3, name: loc.title, item: canonical },
        ],
      },
    ],
  });

  const extraHead = `<meta property="article:published_time" content="${article.publishedAt}" />
    <meta property="article:modified_time" content="${article.updatedAt || article.publishedAt}" />`;

  const relatedHtml = related
    .map((item) => {
      const copy = item[lang];
      return `<a href="${articlePath(item.slug, lang)}"><span class="blog-row-cat">${categoryLabel(item.category, lang)}</span><strong>${copy.title}</strong></a>`;
    })
    .join("\n              ");

  const main = `      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb" data-i18n-aria="a11y.breadcrumb">
          <ol>
            <li><a href="${lang === "ar" ? "/ar" : "/"}" data-copy="home">${ui.home}</a></li>
            <li><a href="${blogIndexPath(lang)}">${ui.blog}</a></li>
            <li aria-current="page">${loc.title}</li>
          </ol>
        </nav>
      </div>
      <article class="wrap blog-article-wrap">
        <div class="blog-article-main">
          <header class="blog-article-head">
            <p class="kicker">${categoryLabel(article.category, lang)}</p>
            <h1>${loc.h1}</h1>
            <p class="lead">${loc.excerpt}</p>
            <p class="blog-meta">
              <span>${ui.author}</span>
              <time datetime="${article.publishedAt}">${ui.published} ${formatDate(article.publishedAt, lang)}</time>
              <time datetime="${article.updatedAt || article.publishedAt}">${ui.updated} ${formatDate(article.updatedAt || article.publishedAt, lang)}</time>
              <span data-read-time></span>
            </p>
          </header>
          <div class="blog-cover" data-tone="${article.tone}" role="img" aria-label="${loc.ogAlt || loc.title}">
            <p class="kicker">${categoryLabel(article.category, lang)}</p>
            <strong>${loc.title}</strong>
          </div>
          <div class="blog-body case-body">
${body}
          </div>
        </div>
        <aside class="blog-aside">
          <nav class="blog-toc" data-blog-toc aria-label="${ui.toc}">
            <p>${ui.toc}</p>
            <ol></ol>
          </nav>
          <div class="blog-related">
            <p class="kicker">${ui.related}</p>
            ${relatedHtml}
          </div>
        </aside>
      </article>
      <section class="section section-dark final">
        <div class="wrap">
          <p class="kicker">${ui.ctaKicker}</p>
          <h2>${loc.ctaTitle || ui.ctaTitle}</h2>
          <p>${loc.ctaBody || ui.ctaBody}</p>
          <a class="btn btn-mint" href="/contact" data-open-wizard${article.wizard ? ` data-wizard-type="${article.wizard}"` : ""} data-i18n="cta.start">${ui.ctaButton}</a>
        </div>
      </section>`;

  return shell({
    lang,
    title: loc.seoTitle,
    description: loc.seoDescription,
    canonical,
    ogType: "article",
    extraHead,
    imageAlt: loc.ogAlt || loc.title,
    schema,
    page: "blog-article",
    extraBody: ` data-article="${article.id}"`,
    brandHref: lang === "ar" ? "/ar" : "/",
    langEnHref: articlePath(article.slug, "en"),
    langArHref: articlePath(article.slug, "ar"),
    navBlogHref: blogIndexPath(lang),
    main,
  });
}

function patchSitemap() {
  const file = join(root, "sitemap.xml");
  let xml = readFileSync(file, "utf8");
  xml = xml.replace(/\s*<!-- blog:start -->[\s\S]*?<!-- blog:end -->/g, "");
  const entries = [];
  for (const lang of ["en", "ar"]) {
    const loc = `${ORIGIN}${blogIndexPath(lang)}`;
    entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>2026-08-31</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/blog" />
    <xhtml:link rel="alternate" hreflang="ar" href="${ORIGIN}/ar/blog" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/blog" />
  </url>`);
  }
  for (const article of ARTICLES) {
    for (const lang of ["en", "ar"]) {
      entries.push(`  <url>
    <loc>${articleUrl(article.slug, lang)}</loc>
    <lastmod>${article.updatedAt || article.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${article.featured ? "0.8" : "0.7"}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${articleUrl(article.slug, "en")}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${articleUrl(article.slug, "ar")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${articleUrl(article.slug, "en")}" />
  </url>`);
    }
  }
  xml = xml.replace(
    "</urlset>",
    `<!-- blog:start -->\n${entries.join("\n")}\n  <!-- blog:end -->\n</urlset>`
  );
  writeFileSync(file, xml, "utf8");
}

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("render-blog.mjs")) {
  for (const lang of ["en", "ar"]) {
    writeOut(lang === "ar" ? "ar/blog/index.html" : "blog/index.html", indexPage(lang));
    for (const article of ARTICLES) {
      writeOut(
        lang === "ar" ? `ar/blog/${article.slug}.html` : `blog/${article.slug}.html`,
        articlePage(article, lang)
      );
    }
  }

  patchSitemap();
  console.log(`Wrote ${2 + ARTICLES.length * 2} blog pages and updated sitemap.xml`);
}
