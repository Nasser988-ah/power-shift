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
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
