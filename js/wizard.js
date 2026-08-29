import { t, getLang } from "./i18n.js?v=20260829h";
import { PROJECTS } from "./content.js?v=20260829h";
import { CONFIG } from "./config.js?v=20260829h";
import { buildWhatsAppUrl } from "./whatsapp.js?v=20260829h";
import { track } from "./analytics.js?v=20260829h";
import { workPictureHTML } from "./media.js?v=20260829h";

const STEPS = ["type", "goal", "timeline"];
const TYPE_ALIAS = {
  webapp: "system",
  saas: "system",
  mobile: "system",
  bms: "system",
  ai: "system",
  custom: "system",
};

function optionButtons(container, items, selected, onPick) {
  container.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = item.label;
    btn.setAttribute("aria-pressed", item.id === selected ? "true" : "false");
    btn.addEventListener("click", () => onPick(item.id));
    container.appendChild(btn);
  });
}

function payloadFrom(state) {
  return {
    type: state.type,
    goal: state.goal,
    timeline: state.timeline,
    name: state.name.trim(),
    email: state.email.trim(),
    phone: state.phone.trim(),
    company: state.company.trim(),
    note: state.note.trim(),
  };
}

async function persistLead(state) {
  if (!CONFIG.leadEndpoint) return { ok: false, skipped: true };
  try {
    const res = await fetch(CONFIG.leadEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payloadFrom(state), t: Date.now(), lang: getLang() }),
    });
    return { ok: res.ok, skipped: false };
  } catch {
    return { ok: false, skipped: false };
  }
}

function normalizeType(id) {
  return TYPE_ALIAS[id] || id;
}

export function initWizard() {
  const dialog = document.querySelector("#project-dialog");
  const inline = document.querySelector("#qualify-inline");
  if (!dialog) return;

  const state = {
    type: "",
    goal: "",
    timeline: "",
    step: 0,
    name: "",
    email: "",
    phone: "",
    company: "",
    note: "",
    submitting: false,
    notice: "",
  };

  const closers = dialog.querySelectorAll("[data-close-wizard]");
  const lastStep = () => state.step === STEPS.length - 1;
  const currentKey = () => STEPS[state.step];

  const syncAll = () => {
    render(dialog.querySelector(".dialog-inner"));
    if (inline) render(inline);
  };

  const sendWhatsApp = async () => {
    if (!state.type || !state.goal || !state.timeline || state.submitting) return;
    state.submitting = true;
    state.notice = "";
    syncAll();
    track("wizard_complete", payloadFrom(state));
    await persistLead(state);
    const url = buildWhatsAppUrl(getLang(), payloadFrom(state));
    const popup = window.open(url, "_blank", "noopener");
    state.submitting = false;
    if (!popup) window.location.assign(url);
    else syncAll();
  };

  const pick = (id) => {
    const key = currentKey();
    state[key] = id;
    state.notice = "";
    if (key === "type") track("service_select", { type: id });
    if (lastStep()) {
      syncAll();
      sendWhatsApp();
      return;
    }
    state.step += 1;
    syncAll();
  };

  const openWizard = (from = "start", presetType = "") => {
    track("wizard_start", { from, type: presetType || undefined });
    state.notice = "";
    if (presetType) {
      state.type = normalizeType(presetType);
      state.step = state.step === 0 ? 1 : state.step;
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    render(dialog.querySelector(".dialog-inner"));
    dialog.querySelector(".choice")?.focus();
  };

  const render = (root) => {
    if (!root) return;
    const copy = t();
    const key = currentKey();
    const qMap = {
      type: copy.qualify.q1,
      goal: copy.qualify.q2,
      timeline: copy.qualify.q3,
    };
    const listMap = {
      type: copy.qualify.types,
      goal: copy.qualify.goals,
      timeline: copy.qualify.times,
    };

    root.querySelector("[data-q]").textContent = qMap[key];
    root.querySelector("[data-progress]").textContent = `${copy.qualify.stepOf} ${state.step + 1} ${copy.qualify.of} ${STEPS.length}`;

    const choices = root.querySelector("[data-choices]");
    const fields = root.querySelector("[data-contact-fields]");
    if (choices) choices.hidden = false;
    if (fields) fields.hidden = true;

    optionButtons(choices, listMap[key], state[key], pick);

    const back = root.querySelector("[data-back]");
    const next = root.querySelector("[data-next]");
    const emailBtn = root.querySelector("[data-email-send]");
    const status = root.querySelector("[data-form-status]");
    back.hidden = state.step === 0;
    back.textContent = copy.qualify.back;
    const readyToSend = lastStep() && Boolean(state[key]);
    next.textContent = state.submitting
      ? copy.qualify.opening
      : readyToSend
        ? copy.cta.continueWa
        : copy.qualify.next;
    next.disabled = state.submitting || !state[key];
    next.setAttribute("aria-busy", state.submitting ? "true" : "false");
    next.classList.toggle("is-loading", state.submitting);
    next.classList.toggle("btn-mint", readyToSend && !state.submitting);
    next.classList.toggle("btn-primary", !readyToSend || state.submitting);

    if (emailBtn) emailBtn.hidden = true;

    if (status) {
      status.textContent = state.notice;
      status.hidden = !state.notice;
      status.classList.toggle("is-error", Boolean(state.notice));
    }

    const note = root.querySelector("[data-price-note]");
    if (note) note.textContent = lastStep() ? copy.qualify.priceNote : "";
    const ready = root.querySelector("[data-ready-note]");
    if (ready) ready.textContent = lastStep() ? copy.qualify.ready : "";
    const privacy = root.querySelector("[data-privacy]");
    if (privacy) privacy.textContent = lastStep() ? copy.qualify.privacy : "";
  };

  const goNext = () => {
    const key = currentKey();
    if (!state[key] || state.submitting) return;
    if (lastStep()) {
      sendWhatsApp();
      return;
    }
    state.step += 1;
    syncAll();
  };

  const goBack = () => {
    state.notice = "";
    if (state.step > 0) state.step -= 1;
    syncAll();
  };

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-wizard]");
    if (!opener) return;
    e.preventDefault();
    openWizard(opener.getAttribute("data-ps-event") || "start", opener.getAttribute("data-wizard-type") || "");
  });

  closers.forEach((btn) => {
    btn.addEventListener("click", () => dialog.close?.() || dialog.removeAttribute("open"));
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close?.();
  });

  dialog.addEventListener("close", () => {
    state.submitting = false;
    state.notice = "";
  });

  const bindRoot = (root) => {
    if (!root) return;
    root.querySelector("[data-next]")?.addEventListener("click", goNext);
    root.querySelector("[data-back]")?.addEventListener("click", goBack);
  };

  bindRoot(dialog.querySelector(".dialog-inner"));
  bindRoot(inline);

  document.addEventListener("ps:lang", syncAll);
  render(inline);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function renderWork() {
  const grid = document.querySelector("[data-work-grid]");
  const copyRoot = document.querySelector("[data-work-copy]");
  const countRoot = document.querySelector("[data-work-count]");
  const dotsRoot = document.querySelector("[data-work-dots]");
  const prevButton = document.querySelector("[data-work-prev]");
  const nextButton = document.querySelector("[data-work-next]");
  if (!grid || !copyRoot) return;

  let active = 0;
  let scrollTimer;

  const paintCopy = () => {
    const copy = t();
    const project = PROJECTS[active];
    const item = copy.work.items[project.id];
    const visitLabel = project.preview ? copy.cta.visitPreview : copy.cta.visit;
    copyRoot.innerHTML = `
      <p class="cat">${escapeHtml(item.category)}</p>
      <h3>${escapeHtml(item.name)}</h3>
      <dl>
        <dt>${escapeHtml(copy.work.challenge)}</dt>
        <dd>${escapeHtml(item.challenge)}</dd>
        <dt>${escapeHtml(copy.work.solution)}</dt>
        <dd>${escapeHtml(item.solution)}</dd>
      </dl>
      <div class="work-actions">
        <a class="btn btn-primary" href="${project.path}">${escapeHtml(copy.work.caseStudy)} — ${escapeHtml(item.name)}</a>
        <a class="btn btn-ghost" href="${project.url}" target="_blank" rel="noopener" data-ps-event="portfolio_click" data-ps-label="${escapeHtml(item.name)}">${escapeHtml(visitLabel)}</a>
        <a class="btn btn-ghost" href="/contact" data-open-wizard data-ps-event="whatsapp_cta" data-ps-label="similar-${escapeHtml(item.name)}">${escapeHtml(copy.cta.similar)}</a>
      </div>
    `;
  };

  const syncSelection = () => {
    grid.querySelectorAll(".work-card").forEach((card, i) => {
      const selected = i === active;
      card.classList.toggle("is-active", selected);
      card.toggleAttribute("aria-current", selected);
    });
    dotsRoot?.querySelectorAll(".work-dot").forEach((dot, i) => {
      const selected = i === active;
      dot.classList.toggle("is-active", selected);
      if (selected) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (countRoot) {
      countRoot.textContent = `${String(active + 1).padStart(2, "0")} / ${String(PROJECTS.length).padStart(2, "0")}`;
    }
    paintCopy();
  };

  const goTo = (index, behavior = "smooth") => {
    active = (index + PROJECTS.length) % PROJECTS.length;
    syncSelection();
    grid.querySelector(`.work-card[data-i="${active}"]`)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior,
    });
  };

  const paintRail = () => {
    const copy = t();
    grid.setAttribute("aria-label", copy.a11y.projects);
    grid.innerHTML = PROJECTS.map((p, i) => {
      const name = copy.work.items[p.id].name;
      const selected = i === active;
      const badge = p.preview ? copy.work.previewNote : copy.work.liveNote;
      const picture = workPictureHTML({
        image: p.image,
        alt: `${name} — ${copy.work.items[p.id].category}`,
        eager: i < 1,
      });
      return `<a class="work-card reveal${selected ? " is-active" : ""}" href="${p.path}" role="listitem" data-i="${i}"${selected ? ' aria-current="true"' : ""}>
        <span class="work-chrome">
          <span class="device-dots" aria-hidden="true"></span>
          <span class="work-url">${escapeHtml(hostOf(p.url))}</span>
        </span>
        <span class="work-shot">${picture}</span>
        <span class="work-card-meta">
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(badge)}</span>
        </span>
      </a>`;
    }).join("");
  };

  const paintControls = () => {
    const copy = t();
    if (prevButton) prevButton.setAttribute("aria-label", copy.work.previous);
    if (nextButton) nextButton.setAttribute("aria-label", copy.work.next);
    if (!dotsRoot) return;
    dotsRoot.setAttribute("aria-label", copy.work.navigation);
    dotsRoot.innerHTML = PROJECTS.map((project, i) => {
      const name = copy.work.items[project.id].name;
      const current = i === active ? ' aria-current="true"' : "";
      return `<button class="work-dot${i === active ? " is-active" : ""}" type="button" data-work-i="${i}" aria-label="${escapeHtml(name)}"${current}></button>`;
    }).join("");
    dotsRoot.querySelectorAll(".work-dot").forEach((dot) => {
      dot.addEventListener("click", () => goTo(Number(dot.dataset.workI)));
    });
  };

  const paint = () => {
    paintRail();
    paintControls();
    syncSelection();
  };

  prevButton?.addEventListener("click", () => goTo(active - 1));
  nextButton?.addEventListener("click", () => goTo(active + 1));

  grid.addEventListener("keydown", (event) => {
    const rtl = document.documentElement.dir === "rtl";
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + (rtl ? -1 : 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active + (rtl ? 1 : -1));
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(PROJECTS.length - 1);
    }
  });

  grid.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const railCenter = grid.getBoundingClientRect().left + grid.clientWidth / 2;
      let nearest = active;
      let nearestDistance = Infinity;
      grid.querySelectorAll(".work-card").forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
        if (distance < nearestDistance) {
          nearest = i;
          nearestDistance = distance;
        }
      });
      if (nearest !== active) {
        active = nearest;
        syncSelection();
      }
    }, 100);
  }, { passive: true });

  document.addEventListener("ps:lang", paint);
  paint();
}
