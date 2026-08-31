import { getLang } from "./i18n.js?v=20260831c";

function readingTime(root) {
  const text = root.innerText || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function slugifyHeading(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function initArticle() {
  const main = document.querySelector(".blog-body");
  const toc = document.querySelector("[data-blog-toc]");
  const timeEl = document.querySelector("[data-read-time]");
  if (!main) return;

  if (timeEl) {
    const minutes = readingTime(main);
    const lang = document.documentElement.lang === "ar" ? "ar" : "en";
    timeEl.textContent =
      lang === "ar"
        ? minutes === 1
          ? "دقيقة قراءة"
          : `${minutes} دقائق قراءة`
        : minutes === 1
          ? "1 min read"
          : `${minutes} min read`;
  }

  if (!toc) return;
  const headings = [...main.querySelectorAll("h2")];
  if (headings.length < 3) {
    toc.hidden = true;
    return;
  }

  const list = toc.querySelector("ol");
  if (!list) return;
  list.replaceChildren();
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = slugifyHeading(heading.textContent) || `section-${index + 1}`;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    item.appendChild(link);
    list.appendChild(item);
  });
}

function initListing() {
  const list = document.querySelector("[data-blog-list]");
  const empty = document.querySelector("[data-blog-empty]");
  const search = document.querySelector("[data-blog-search]");
  const filters = document.querySelector("[data-blog-filters]");
  if (!list) return;

  const rows = [...list.querySelectorAll("[data-blog-row]")];
  const featuredEl = document.querySelector("[data-blog-featured]");
  let category = "all";
  let query = "";

  const apply = () => {
    const q = query.trim().toLowerCase();
    let visible = 0;
    rows.forEach((row) => {
      const cat = row.getAttribute("data-category") || "";
      const hay = (row.getAttribute("data-search") || "").toLowerCase();
      const matchCat = category === "all" || cat === category;
      const matchQ = !q || hay.includes(q);
      const show = matchCat && matchQ;
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (featuredEl) {
      const featCat = featuredEl.getAttribute("data-category") || "";
      featuredEl.hidden = category !== "all" && category !== featCat;
    }
    if (empty) empty.hidden = visible !== 0 || (featuredEl && !featuredEl.hidden);
  };

  if (search) {
    const form = search.closest("form");
    if (form) {
      form.addEventListener("submit", (event) => event.preventDefault());
    }
    search.addEventListener("input", () => {
      query = search.value || "";
      apply();
    });
  }

  if (filters) {
    filters.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-filter]");
      if (!btn) return;
      category = btn.getAttribute("data-filter") || "all";
      filters.querySelectorAll("[data-filter]").forEach((el) => {
        el.setAttribute("aria-pressed", el === btn ? "true" : "false");
      });
      apply();
    });
  }

  apply();
}

function syncBlogNav() {
  const lang = getLang();
  document.querySelectorAll("[data-nav='blog']").forEach((link) => {
    if (link.closest(".lang-switch")) return;
    const path = lang === "ar" ? "/ar/blog" : "/blog";
    if (link.getAttribute("href") !== path) link.setAttribute("href", path);
  });
}

export function initBlog() {
  syncBlogNav();
  document.addEventListener("ps:lang", syncBlogNav);
  const page = document.body.getAttribute("data-page");
  if (page === "blog") initListing();
  if (page === "blog-article") initArticle();
}
