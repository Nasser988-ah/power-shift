import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ARTICLES } from "./blog-data.mjs";
import { articlePath, renderBody } from "./render-blog.mjs";

const root = join(process.cwd());
const titles = new Map();
const descs = new Map();
const issues = [];

function checkHtml(file, html) {
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const desc = (html.match(/name="description" content="([^"]+)"/) || [])[1];
  const h1s = [...html.matchAll(/<h1\b[^>]*>/g)];
  const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const hreflang = [...html.matchAll(/hreflang="(en|ar|x-default)"/g)].map((m) => m[1]);
  if (!title) issues.push(`${file}: missing title`);
  if (!desc) issues.push(`${file}: missing description`);
  if (h1s.length !== 1) issues.push(`${file}: h1 count ${h1s.length}`);
  if (!canonical) issues.push(`${file}: missing canonical`);
  if (!hreflang.includes("en") || !hreflang.includes("ar") || !hreflang.includes("x-default")) {
    issues.push(`${file}: incomplete hreflang`);
  }
  if (title) {
    if (titles.has(title)) issues.push(`duplicate title: ${title}`);
    else titles.set(title, file);
  }
  if (desc) {
    if (descs.has(desc) && !file.includes("index.html")) issues.push(`duplicate description in ${file}`);
    else if (!descs.has(desc)) descs.set(desc, file);
  }
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!json) issues.push(`${file}: missing json-ld`);
  else {
    try {
      JSON.parse(json[1]);
    } catch (err) {
      issues.push(`${file}: json-ld parse ${err.message}`);
    }
  }
  const hrefs = [...html.matchAll(/href="(\/blog\/[^"#]+|\/ar\/blog\/[^"#]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    const rel = href.replace(/^\//, "").replace(/\/$/, "/index.html");
    const disk = rel.endsWith(".html") ? rel : join(rel, "index.html");
    if (!existsSync(join(root, disk)) && !existsSync(join(root, rel, "index.html"))) {
      issues.push(`${file}: broken ${href}`);
    }
  }
}

for (const lang of ["en", "ar"]) {
  const index = lang === "ar" ? "ar/blog/index.html" : "blog/index.html";
  checkHtml(index, readFileSync(join(root, index), "utf8"));
  for (const article of ARTICLES) {
    const file = (lang === "ar" ? "ar/blog/" : "blog/") + article.slug + ".html";
    checkHtml(file, readFileSync(join(root, file), "utf8"));
    const body = renderBody(article[lang].body);
    if (/in today's digital|ever-evolving digital|as technology continues/i.test(body)) {
      issues.push(`${article.id} ${lang}: banned intro`);
    }
  }
}

console.log("articles", ARTICLES.length);
console.log("issues", issues.length ? issues : "none");
