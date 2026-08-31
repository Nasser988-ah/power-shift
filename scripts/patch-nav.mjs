import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const files = [
  "index.html",
  "404.html",
  "ar/index.html",
  "services/index.html",
  "contact/index.html",
  "work/index.html",
  "work/via-holidays.html",
  "work/nourvive.html",
  "work/corolla.html",
  "work/uruz.html",
  "work/lodiamo.html",
  "work/availio.html",
  "work/haseb.html",
];

for (const rel of files) {
  const file = join(process.cwd(), rel);
  let html = readFileSync(file, "utf8");
  const ar = rel.startsWith("ar/");
  const href = ar ? "/ar/blog" : "/blog";
  const label = ar ? "المدونة" : "Blog";
  const link = `<a href="${href}" data-nav="blog" data-i18n="nav.blog">${label}</a>`;

  html = html.replaceAll("lang-boot.js?v=20260831b", "lang-boot.js?v=20260831c");
  html = html.replaceAll("main.js?v=20260831a", "main.js?v=20260831c");

  if (!html.includes('data-nav="blog"')) {
    html = html.replaceAll(
      `<a href="/services" data-i18n="nav.services">Services</a>`,
      `<a href="/services" data-i18n="nav.services">Services</a>\n          ${link}`
    );
    html = html.replace(
      `<a href="/services" data-copy="servicesLink">Web & software services</a>`,
      `<a href="/services" data-copy="servicesLink">Web & software services</a>\n          ${link}`
    );
  }

  writeFileSync(file, html);
  console.log("patched", rel);
}
