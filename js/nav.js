import { getLang, t } from "./i18n.js";

export function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".nav-mobile");
  if (!toggle || !panel) return;

  const syncToggleLabel = (open) => {
    const copy = t(getLang());
    toggle.setAttribute("aria-label", open ? copy.cta.closeMenu : copy.cta.menu);
    toggle.setAttribute("aria-controls", "mobile-nav");
  };

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    panel.toggleAttribute("inert", !open);
    panel.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("is-nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    syncToggleLabel(open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  panel.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (
      panel.classList.contains("is-open") &&
      !panel.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      setOpen(false);
    }
  });

  document.addEventListener("ps:lang", () => {
    syncToggleLabel(toggle.getAttribute("aria-expanded") === "true");
  });

  const header = document.querySelector(".site-header");
  if (!header) return;

  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.setAttribute("role", "presentation");
  sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none";
  document.body.prepend(sentinel);
  const headerWatch = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-scrolled", !entry.isIntersecting);
    },
    { threshold: 1 }
  );
  headerWatch.observe(sentinel);
}
