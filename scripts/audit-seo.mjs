import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const pages = [
  {
    file: "index.html",
    canonical: "https://www.powershift.space/",
    alternates: {
      en: "https://www.powershift.space/",
      ar: "https://www.powershift.space/ar",
    },
  },
  {
    file: "ar/index.html",
    canonical: "https://www.powershift.space/ar",
    alternates: {
      en: "https://www.powershift.space/",
      ar: "https://www.powershift.space/ar",
    },
  },
  {
    file: "about/index.html",
    canonical: "https://www.powershift.space/about",
    alternates: {
      en: "https://www.powershift.space/about",
      ar: "https://www.powershift.space/ar/about",
    },
  },
  {
    file: "ar/about/index.html",
    canonical: "https://www.powershift.space/ar/about",
    alternates: {
      en: "https://www.powershift.space/about",
      ar: "https://www.powershift.space/ar/about",
    },
  },
];

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const page of pages) {
  const html = readFileSync(join(root, page.file), "utf8");
  const label = page.file;
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  const jsonLdBlocks = html
    .split('<script type="application/ld+json">')
    .slice(1)
    .map((block) => block.split("</script>")[0]);

  expect(/<title>[^<]+<\/title>/.test(html), `${label}: missing title`);
  expect(/<meta\s+name="description"\s+content="[^"]+"/.test(html) || /<meta[\s\S]+?name="description"[\s\S]+?content="[^"]+"/.test(html), `${label}: missing meta description`);
  expect(new RegExp(`<link rel="canonical" href="${escapeRegExp(page.canonical)}"`).test(html), `${label}: incorrect canonical`);
  expect(h1Count === 1, `${label}: expected one H1, found ${h1Count}`);
  expect(jsonLdBlocks.length > 0, `${label}: missing JSON-LD`);

  for (const [lang, url] of Object.entries(page.alternates)) {
    expect(
      new RegExp(`<link rel="alternate" hreflang="${lang}" href="${escapeRegExp(url)}"`).test(html),
      `${label}: missing ${lang} alternate`
    );
  }

  jsonLdBlocks.forEach((block, index) => {
    try {
      JSON.parse(block);
    } catch (error) {
      failures.push(`${label}: invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  });
}

try {
  JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
} catch (error) {
  failures.push(`vercel.json: invalid JSON: ${error.message}`);
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const page of pages) {
  expect(sitemap.includes(`<loc>${page.canonical}</loc>`), `sitemap.xml: missing ${page.canonical}`);
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed for ${pages.length} priority pages.`);
}
