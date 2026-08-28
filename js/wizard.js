import { t, getLang } from "./i18n.js";
import { PROJECTS } from "./content.js";
import { CONFIG } from "./config.js";
import { buildWhatsAppUrl, buildMailto } from "./whatsapp.js";
import { track } from "./analytics.js";
import { workPictureHTML } from "./media.js";

const STEPS = ["type", "goal", "timeline", "contact"];
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_OK = /^[+]?[\d\s()-]{8,20}$/;

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

function validContact(state) {
  const phone = state.phone.trim();
  const phoneOk = !phone || PHONE_OK.test(phone);
  return state.name.trim().length >= 2 && EMAIL_OK.test(state.email.trim()) && phoneOk;
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

function setFieldState(input, errorEl, message) {
  if (!input) return;
  const invalid = Boolean(message);
  input.classList.toggle("is-invalid", invalid);
  input.setAttribute("aria-invalid", invalid ? "true" : "false");
  if (errorEl) {
    errorEl.textContent = message || "";
    errorEl.hidden = !invalid;
  }
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

  const readFields = (root) => {
    const name = root.querySelector("[data-field-name]");
    const email = root.querySelector("[data-field-email]");
    const phone = root.querySelector("[data-field-phone]");
    const company = root.querySelector("[data-field-company]");
    const note = root.querySelector("[data-field-note]");
    if (name) state.name = name.value;
    if (email) state.email = email.value;
    if (phone) state.phone = phone.value;
    if (company) state.company = company.value;
    if (note) state.note = note.value;
  };

  const writeFields = (root) => {
    const name = root.querySelector("[data-field-name]");
    const email = root.querySelector("[data-field-email]");
    const phone = root.querySelector("[data-field-phone]");
    const company = root.querySelector("[data-field-company]");
    const note = root.querySelector("[data-field-note]");
    if (name) name.value = state.name;
    if (email) email.value = state.email;
    if (phone) phone.value = state.phone;
    if (company) company.value = state.company;
    if (note) note.value = state.note;
  };

  const paintErrors = (root) => {
    const copy = t();
    const phone = state.phone.trim();
    setFieldState(
      root.querySelector("[data-field-name]"),
      root.querySelector("[data-error-name]"),
      state.name.trim().length >= 2 ? "" : copy.qualify.errors.name
    );
    setFieldState(
      root.querySelector("[data-field-email]"),
      root.querySelector("[data-error-email]"),
      EMAIL_OK.test(state.email.trim()) ? "" : copy.qualify.errors.email
    );
    setFieldState(
      root.querySelector("[data-field-phone]"),
      root.querySelector("[data-error-phone]"),
      !phone || PHONE_OK.test(phone) ? "" : copy.qualify.errors.phone
    );
  };

  const clearErrors = (root) => {
    ["name", "email", "phone"].forEach((key) => {
      setFieldState(root.querySelector(`[data-field-${key}]`), root.querySelector(`[data-error-${key}]`), "");
    });
  };

  const openWizard = (from = "start", presetType = "") => {
    track("wizard_start", { from, type: presetType || undefined });
    state.notice = "";
    if (presetType) {
      state.type = presetType;
      state.step = state.step === 0 ? 1 : state.step;
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    const closeBtn = dialog.querySelector("[data-close-wizard]");
    closeBtn?.focus();
    render(dialog.querySelector(".dialog-inner"));
  };

  const render = (root) => {
    if (!root) return;
    const copy = t();
    const key = STEPS[state.step];
    const qMap = {
      type: copy.qualify.q1,
      goal: copy.qualify.q2,
      timeline: copy.qualify.q3,
      contact: copy.qualify.q4,
    };
    const listMap = {
      type: copy.qualify.types,
      goal: copy.qualify.goals,
      timeline: copy.qualify.times,
    };

    root.querySelector("[data-q]").textContent = qMap[key];
    root.querySelector("[data-progress]").textContent = `${copy.qualify.stepOf} ${state.step + 1} ${copy.qualify.of} 4`;

    const choices = root.querySelector("[data-choices]");
    const fields = root.querySelector("[data-contact-fields]");
    const isContact = key === "contact";
    if (choices) choices.hidden = isContact;
    if (fields) fields.hidden = !isContact;

    if (!isContact) {
      clearErrors(root);
      optionButtons(choices, listMap[key], state[key], (id) => {
        state[key] = id;
        if (key === "type") track("service_select", { type: id });
        render(dialog.querySelector(".dialog-inner"));
        if (inline) render(inline);
      });
    } else {
      writeFields(root);
      const nameL = root.querySelector("[data-label-name]");
      const emailL = root.querySelector("[data-label-email]");
      const phoneL = root.querySelector("[data-label-phone]");
      const companyL = root.querySelector("[data-label-company]");
      const noteL = root.querySelector("[data-label-note]");
      if (nameL) nameL.textContent = copy.qualify.name;
      if (emailL) emailL.textContent = copy.qualify.email;
      if (phoneL) phoneL.textContent = copy.qualify.phone;
      if (companyL) companyL.textContent = copy.qualify.company;
      if (noteL) noteL.textContent = copy.qualify.note;
      const name = root.querySelector("[data-field-name]");
      const email = root.querySelector("[data-field-email]");
      const phone = root.querySelector("[data-field-phone]");
      const company = root.querySelector("[data-field-company]");
      const note = root.querySelector("[data-field-note]");
      if (name) name.placeholder = copy.qualify.namePh;
      if (email) email.placeholder = copy.qualify.emailPh;
      if (phone) phone.placeholder = copy.qualify.phonePh;
      if (company) company.placeholder = copy.qualify.companyPh;
      if (note) note.placeholder = copy.qualify.notePh;
    }

    const back = root.querySelector("[data-back]");
    const next = root.querySelector("[data-next]");
    const emailBtn = root.querySelector("[data-email-send]");
    const status = root.querySelector("[data-form-status]");
    back.hidden = state.step === 0;
    back.textContent = copy.qualify.back;
    const complete = isContact && validContact(state);
    next.textContent = state.submitting ? copy.qualify.opening : complete ? copy.cta.continueWa : copy.qualify.next;
    next.disabled = state.submitting || (isContact ? !validContact(state) : !state[key]);
    next.setAttribute("aria-busy", state.submitting ? "true" : "false");
    next.classList.toggle("is-loading", state.submitting);
    next.classList.toggle("btn-mint", complete && !state.submitting);
    next.classList.toggle("btn-primary", !complete || state.submitting);

    if (emailBtn) {
      emailBtn.hidden = !complete || !CONFIG.email || state.submitting;
      emailBtn.textContent = copy.cta.continueEmail;
    }

    if (status) {
      status.textContent = state.notice;
      status.hidden = !state.notice;
      status.classList.toggle("is-error", Boolean(state.notice));
    }

    const note = root.querySelector("[data-price-note]");
    if (note) note.textContent = isContact ? copy.qualify.priceNote : "";
    const ready = root.querySelector("[data-ready-note]");
    if (ready) ready.textContent = isContact ? copy.qualify.ready : "";
    const privacy = root.querySelector("[data-privacy]");
    if (privacy) privacy.textContent = isContact ? copy.qualify.privacy : "";
  };

  const syncAll = () => {
    render(dialog.querySelector(".dialog-inner"));
    if (inline) render(inline);
  };

  const goNext = async (root) => {
    readFields(root);
    const key = STEPS[state.step];
    if (key === "contact") {
      paintErrors(root);
      if (!validContact(state) || state.submitting) return;
      state.submitting = true;
      state.notice = "";
      syncAll();
      track("wizard_complete", payloadFrom(state));
      await persistLead(state);
      const popup = window.open(buildWhatsAppUrl(getLang(), payloadFrom(state)), "_blank", "noopener");
      state.submitting = false;
      if (!popup) {
        state.notice = t().qualify.blocked;
      }
      syncAll();
      return;
    }
    if (!state[key]) return;
    state.step += 1;
    syncAll();
  };

  const goBack = (root) => {
    readFields(root);
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
    root.querySelector("[data-next]")?.addEventListener("click", () => goNext(root));
    root.querySelector("[data-back]")?.addEventListener("click", () => goBack(root));
    root.querySelector("[data-email-send]")?.addEventListener("click", () => {
      readFields(root);
      if (!validContact(state) || !CONFIG.email) return;
      persistLead(state);
      track("wizard_email", payloadFrom(state));
      window.location.href = buildMailto(getLang(), payloadFrom(state));
    });
    ["data-field-name", "data-field-email", "data-field-phone", "data-field-company", "data-field-note"].forEach((attr) => {
      root.querySelector(`[${attr}]`)?.addEventListener("input", () => {
        readFields(root);
        if (STEPS[state.step] !== "contact") return;
        const copy = t();
        const ok = validContact(state);
        paintErrors(root);
        [dialog.querySelector(".dialog-inner"), inline].forEach((el) => {
          if (!el) return;
          const next = el.querySelector("[data-next]");
          const emailBtn = el.querySelector("[data-email-send]");
          if (next) {
            next.disabled = !ok || state.submitting;
            next.textContent = state.submitting ? copy.qualify.opening : ok ? copy.cta.continueWa : copy.qualify.next;
            next.classList.toggle("btn-mint", ok && !state.submitting);
            next.classList.toggle("btn-primary", !ok || state.submitting);
          }
          if (emailBtn) {
            emailBtn.hidden = !ok || !CONFIG.email || state.submitting;
            emailBtn.textContent = copy.cta.continueEmail;
          }
        });
      });
    });
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
