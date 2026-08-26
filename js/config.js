/**
 * POWER SHIFT — central site configuration.
 * Set email and leadEndpoint when you have them. WhatsApp works without either.
 */
export const CONFIG = {
  brand: "POWER SHIFT",
  tagline: "We Code. We Create. We Shift.",
  whatsappDigits: "201553766199",
  whatsappUrl: "https://wa.me/201553766199",
  phoneDisplay: "+20 155 376 6199",
  phoneE164: "+201553766199",
  email: "",
  city: "Cairo",
  country: "Egypt",
  siteOrigin: "https://www.powershift.space",
  social: {
    instagram: "https://www.instagram.com/powershift.dev/",
    facebook: "https://www.facebook.com/people/Power-Shift/61573374143956/",
    linkedin: "https://www.linkedin.com/in/nasser-ahmed-6384a824a",
  },
  founder: {
    name: "Nasser Ahmed",
    linkedin: "https://www.linkedin.com/in/nasser-ahmed-6384a824a",
  },
  langKey: "ps-lang",
  defaultLang: "en",
  stickyWhatsappAfter: 0.08,
  leadEndpoint: "",
};

export function mailtoUrl(subject, body) {
  if (!CONFIG.email) return "";
  return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
