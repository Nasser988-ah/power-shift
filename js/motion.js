import { CONFIG } from "./config.js";
import { PROJECTS } from "./content.js";
import { t } from "./i18n.js";
import { workStem } from "./media.js";

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function initMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) document.documentElement.classList.add("reduce-motion");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  const observeReveals = () => {
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
      if (reduce) el.classList.add("is-in");
      else io.observe(el);
    });
  };
  observeReveals();
  document.addEventListener("ps:lang", () => {
    window.setTimeout(observeReveals, 220);
  });

  const bar = document.querySelector("[data-scroll-progress]");
  const stickyBar = document.querySelector("[data-sticky-bar]");
  const visual = document.querySelector(".hero-visual");
  const onScroll = () => {
    const max = Math.max(document.body.scrollHeight - innerHeight, 1);
    const y = window.scrollY / max;
    if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, y))})`;
    if (stickyBar) stickyBar.classList.toggle("is-visible", y > CONFIG.stickyWhatsappAfter);
    if (visual && !reduce) {
      const shift = Math.min(window.scrollY, 520) * 0.08;
      visual.style.transform = `translate3d(0, ${shift}px, 0)`;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (reduce) return;

  const slides = PROJECTS;
  const slotA = document.querySelector('[data-hero-slot="a"]');
  const slotB = document.querySelector('[data-hero-slot="b"]');
  const urlEl = document.querySelector("[data-hero-url]");
  const nameEl = document.querySelector("[data-hero-name]");
  const metaEl = document.querySelector("[data-hero-meta]");
  const slots = [slotA, slotB].filter(Boolean);

  if (slots.length === 2 && slides.length) {
    let i = 0;
    let front = 0;

    const metaFor = (project) => {
      const item = t().work.items[project.id];
      if (urlEl) urlEl.textContent = hostOf(project.url);
      if (nameEl) nameEl.textContent = item.name;
      if (metaEl) metaEl.textContent = item.category.split("·")[0].trim();
      return item;
    };

    const show = (index) => {
      const project = slides[index % slides.length];
      const item = metaFor(project);
      const next = 1 - front;
      const incoming = slots[next];
      const outgoing = slots[front];
      const swap = () => {
        incoming.alt = item.name;
        incoming.classList.add("is-on");
        outgoing.classList.remove("is-on");
        front = next;
      };
      if (incoming.getAttribute("src") === project.image) {
        swap();
        return;
      }
      incoming.onload = () => {
        incoming.onload = null;
        swap();
      };
      incoming.src = `${workStem(project.image)}.webp`;
    };

    document.addEventListener("ps:lang", () => metaFor(slides[i % slides.length]));
    window.setInterval(() => {
      i += 1;
      show(i);
    }, 4800);
  }
}
