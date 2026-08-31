import { CONFIG, mailtoUrl } from "./config.js?v=20260831a";
import { COPY } from "./content.js?v=20260831b";

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

export function simpleWhatsAppUrl(lang) {
  const text = lang === "ar" ? COPY.ar.waPrefill : COPY.en.waPrefill;
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function similarWorkUrl(lang, projectName) {
  const name = clean(projectName);
  const text =
    lang === "ar"
      ? `مرحبًا فريق POWER SHIFT، اطّلعت على مشروع ${name} وأرغب في مناقشة عمل مشابه. أرجو تحديد موعد لمكالمة قصيرة.`
      : `Hi POWER SHIFT, I saw the ${name} project and I would like to discuss similar work. Please book a 20-minute scope call.`;
  return `${CONFIG.whatsappUrl}?text=${encodeURIComponent(text)}`;
}

export function buildMailto(lang, payload = {}) {
  const copy = COPY[lang] || COPY.en;
  return mailtoUrl(copy.cta.start, buildBriefMessage(lang, payload));
}
