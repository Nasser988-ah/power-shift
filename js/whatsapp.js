import { CONFIG, mailtoUrl } from "./config.js?v=20260831a";
import { COPY } from "./content.js?v=20261002a";

function idMap(items) {
  return Object.fromEntries((items || []).map((item) => [item.id, item.label]));
}

function labels(lang) {
  const copy = COPY[lang] || COPY.en;
  return {
    type: idMap(copy.qualify.types),
    goal: idMap(copy.qualify.goals),
    time: idMap(copy.qualify.times),
  };
}

function clean(value, max = 180) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function buildBriefMessage(lang, payload = {}) {
  const type = clean(payload.type);
  const goal = clean(payload.goal);
  const timeline = clean(payload.timeline);
  const name = clean(payload.name, 80);
  const email = clean(payload.email, 120);
  const company = clean(payload.company, 80);
  const extra = clean(payload.note || payload.extra, 400);
  const L = labels(lang);

  if (lang === "ar") {
    const lines = [COPY.ar.waPrefill];
    if (name) lines.push(`الاسم: ${name}`);
    if (company) lines.push(`الشركة: ${company}`);
    if (email) lines.push(`البريد: ${email}`);
    if (payload.phone) lines.push(`الهاتف: ${clean(payload.phone, 40)}`);
    if (type) lines.push(`نوع المشروع: ${L.type[type] || type}`);
    if (goal) lines.push(`الهدف: ${L.goal[goal] || goal}`);
    if (timeline) lines.push(`الجدول الزمني: ${L.time[timeline] || timeline}`);
    if (extra) lines.push(extra);
    return lines.join("\n");
  }

  const lines = [COPY.en.waPrefill];
    if (name) lines.push(`Name: ${name}`);
    if (company) lines.push(`Company: ${company}`);
    if (email) lines.push(`Email: ${email}`);
    if (payload.phone) lines.push(`Phone: ${clean(payload.phone, 40)}`);
  if (type) lines.push(`Project type: ${L.type[type] || type}`);
  if (goal) lines.push(`Main goal: ${L.goal[goal] || goal}`);
  if (timeline) lines.push(`Timeline: ${L.time[timeline] || timeline}`);
  if (extra) lines.push(extra);
  return lines.join("\n");
}

export function buildWhatsAppMessage(lang, payload = {}) {
  return buildBriefMessage(lang, payload);
}

export function buildWhatsAppUrl(lang, payload = {}) {
  const text = buildWhatsAppMessage(lang, payload);
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

const PAGE_PREFILL = {
  "clinic-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع لعيادة: التخصص، الفروع، وطريقة الحجز.",
    en: "Hi POWER SHIFT, I would like a clinic website with the specialty, branches, and a way to book.",
  },
  "law-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع لمكتب محاماة ومجالات العمل وطريقة حجز الاستشارة.",
    en: "Hi POWER SHIFT, I would like a law-office website with practice areas and a way to book a consultation.",
  },
  "accounting-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع لمكتب محاسبة يشرح الخدمات وطريقة التواصل.",
    en: "Hi POWER SHIFT, I would like an accounting-office website that explains the services and how to get in touch.",
  },
  "realestate-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع يعرّف بشركة عقارية. لست أطلب برنامج تشغيل.",
    en: "Hi POWER SHIFT, I would like a website that introduces a real-estate company, not operations software.",
  },
  "company-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع تعريفي للشركة يمكن إرساله إلى العميل.",
    en: "Hi POWER SHIFT, I would like a company website I can send to a customer.",
  },
  "shop-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في متجر أو كتالوج يناسب طريقة البيع.",
    en: "Hi POWER SHIFT, I would like a shop or catalogue that matches how we sell.",
  },
  "shop-en": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في متجر أو كتالوج يناسب طريقة البيع.",
    en: "Hi POWER SHIFT, I would like a shop or catalogue that matches how we sell.",
  },
  "software-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في نظام للتشغيل اليومي، لا موقعًا تعريفيًا فقط.",
    en: "Hi POWER SHIFT, I would like software for daily operations, not only a public website.",
  },
  "software-en": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في نظام للتشغيل اليومي، لا موقعًا تعريفيًا فقط.",
    en: "Hi POWER SHIFT, I would like software for daily operations, not only a public website.",
  },
  "dev-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في برمجة موقع للشركة يمكن إرساله إلى العميل.",
    en: "Hi POWER SHIFT, I would like a company website built so I can send it to a customer.",
  },
  "dev-en": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في برمجة موقع للشركة يمكن إرساله إلى العميل.",
    en: "Hi POWER SHIFT, I would like a company website built so I can send it to a customer.",
  },
  "egypt-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع لنشاط في مصر، وأريد معرفة ما يدخل النسخة الأولى.",
    en: "Hi POWER SHIFT, I would like a website for a business in Egypt and what belongs in version one.",
  },
  "egypt-en": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع لنشاط في مصر، وأريد معرفة ما يدخل النسخة الأولى.",
    en: "Hi POWER SHIFT, I would like a website for a business in Egypt and what belongs in version one.",
  },
  "cairo-ar": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع من استوديو القاهرة، عبر واتساب لا عبر زيارة مكتب.",
    en: "Hi POWER SHIFT, I would like a website from the Cairo studio, over WhatsApp rather than a walk-in office.",
  },
  "cairo-en": {
    ar: "مرحبًا فريق POWER SHIFT، أرغب في موقع من استوديو القاهرة، عبر واتساب لا عبر زيارة مكتب.",
    en: "Hi POWER SHIFT, I would like a website from the Cairo studio, over WhatsApp rather than a walk-in office.",
  },
  "gcc-ar": {
    ar: "مرحبًا فريق POWER SHIFT، شركتنا في الخليج وأرغب في موقع بالعربية والإنجليزية عن بُعد من القاهرة.",
    en: "Hi POWER SHIFT, our company is in the Gulf and I would like an Arabic and English website delivered remotely from Cairo.",
  },
};

export function simpleWhatsAppUrl(lang) {
  const text = lang === "ar" ? COPY.ar.waPrefill : COPY.en.waPrefill;
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function pageWhatsAppUrl(lang, context = {}) {
  const project = clean(context.project, 80);
  if (project) {
    const text =
      lang === "ar"
        ? `مرحبًا فريق POWER SHIFT، اطّلعت على ${project} وأرغب في مناقشة عمل مشابه.`
        : `Hi POWER SHIFT, I looked at ${project} and I would like to discuss similar work.`;
    return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
  }
  const page = PAGE_PREFILL[context.landing];
  const text = page ? page[lang] || page.en : lang === "ar" ? COPY.ar.waPrefill : COPY.en.waPrefill;
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function reviewWhatsAppUrl(lang) {
  const text =
    lang === "ar"
      ? "مرحبًا فريق POWER SHIFT، أرغب في كتابة تقييم عن تجربتي معكم."
      : "Hi POWER SHIFT, I would like to leave a review of my experience with you.";
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function similarWorkUrl(lang, projectName) {
  const name = clean(projectName);
  const text =
    lang === "ar"
      ? `مرحبًا فريق POWER SHIFT، اطّلعت على مشروع ${name} وأرغب في مناقشة عمل مشابه. أرجو تحديد موعد لمكالمة قصيرة.`
      : `Hi POWER SHIFT, I saw the ${name} project and I would like to discuss similar work. Please book a project consultation.`;
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function buildMailto(lang, payload = {}) {
  const copy = COPY[lang] || COPY.en;
  return mailtoUrl(copy.cta.start, buildBriefMessage(lang, payload));
}
