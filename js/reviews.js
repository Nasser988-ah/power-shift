export const REVIEW_STATS = {
  ratingValue: 5,
  bestRating: 5,
  worstRating: 1,
  reviewCount: 15,
};

export const FEATURED_REVIEW_IDS = ["nour", "marwan", "mina", "rashid", "salma", "hazem"];

export const REVIEWS = [
  {
    id: "marwan",
    name: "مروان الشاذلي",
    lang: "ar",
    rating: 5,
    text: [
      "بص يا جماعة أنا مش من الناس اللي بتحب تكتب ريفيوز كتير بس حبيت أقول تجربتي مع Power Shift كانت كويسة جدا كنت محتاج موقع للشركة ومكنتش عارف أبدأ منين واتناقشنا في التفاصيل لحد ما وصلنا للشكل المناسب",
    ],
  },
  {
    id: "yassin",
    name: "ياسين العتيبي",
    lang: "ar",
    rating: 5,
    text: [
      "كنت أبحث عن جهة تنفذ موقع لمشروعي والحمد لله كانت تجربة طيبة مع Power Shift التواصل كان واضح والشغل تم حسب المتطلبات اللي اتفقنا عليها",
    ],
  },
  {
    id: "nour",
    name: "Nour El Din",
    lang: "en",
    rating: 5,
    text: [
      "I honestly did not know exactly what I wanted at first.",
      "The team helped me organize my ideas and understand what my website actually needed.",
      "I am happy with how the project turned out.",
    ],
  },
  {
    id: "basant",
    name: "بسنت عادل",
    lang: "ar",
    rating: 5,
    text: [
      "أنا كنت فاكرة إن عمل موقع محتاج وجع دماغ كبير جدا خصوصا إني مش فاهمة في البرمجة خالص بس الموضوع كان أبسط مما توقعت وقدرت أوضح كل اللي محتاجاه",
    ],
  },
  {
    id: "rashid",
    name: "راشد المنهالي",
    lang: "ar",
    rating: 5,
    text: [
      "يعطيكم العافية على الشغل والتعاون",
      "كان عندنا بعض التفاصيل المهمة في المشروع وتمت مناقشتها بشكل واضح قبل التنفيذ وهذا الشيء فرق معنا",
    ],
  },
  {
    id: "mina",
    name: "Mina Fawzy",
    lang: "en",
    rating: 5,
    text: [
      "What I liked most was that the website did not feel like a generic template.",
      "We discussed what would suit my business and worked around those requirements.",
      "The experience was straightforward and professional.",
    ],
  },
  {
    id: "hazem",
    name: "حازم الديب",
    lang: "ar",
    rating: 5,
    text: [
      "أنا كنت عايز حاجة أقدر أبعت لينكها للعميل بدل ما أفضل كل مرة أشرحله إحنا بنقدم إيه والحمد لله الموقع بقى جامع المعلومات اللي محتاجينها في مكان واحد",
    ],
  },
  {
    id: "lulwa",
    name: "لولوة الهاجري",
    lang: "ar",
    rating: 5,
    text: [
      "بصراحة كنت متخوفة من التعامل عن بعد لكن الأمور كانت واضحة والتواصل كان سهل خلال تنفيذ الموقع والتجربة بشكل عام كانت مريحة",
    ],
  },
  {
    id: "salma",
    name: "Salma Nabil",
    lang: "en",
    rating: 5,
    text: [
      "I am not very technical so I really appreciated having things explained in a simple way.",
      "The team listened to my ideas and helped me figure out what made sense for my website.",
    ],
  },
  {
    id: "mahmoud",
    name: "محمود صبري",
    lang: "ar",
    rating: 5,
    text: [
      "أهم حاجة بالنسبالي كانت لوحة التحكم عشان مش عايز أفضل محتاج مبرمج كل ما أحتاج أغير حاجة في الموقع واتناقشنا في الموضوع ده أثناء الشغل",
    ],
  },
  {
    id: "meshaal",
    name: "مشعل الدوسري",
    lang: "ar",
    rating: 5,
    text: [
      "تجربتي مع Power Shift كانت جيدة",
      "كان المطلوب موقع يوضح خدمات المؤسسة بشكل مرتب وتم العمل على المتطلبات المتفق عليها",
    ],
  },
  {
    id: "karim",
    name: "Karim Samir",
    lang: "en",
    rating: 5,
    text: [
      "I had a few specific ideas for my website and wanted to make sure they were understood before development started.",
      "Communication was clear and I appreciated being able to discuss the details along the way.",
    ],
  },
  {
    id: "rana",
    name: "رنا فؤاد",
    lang: "ar",
    rating: 5,
    text: [
      "أنا من النوع اللي بيغير رأيه كتير في التصميم 😂 وكنت حريصة إن الموقع يطلع مناسب لشكل البراند بتاعي فكان مهم بالنسبالي إني أقدر أوضح الأفكار والتفاصيل اللي في دماغي",
    ],
  },
  {
    id: "abdulrahman",
    name: "عبدالرحمن الشمري",
    lang: "ar",
    rating: 5,
    text: [
      "كنت محتاج موقع إلكتروني لنشاطي بدل الاعتماد على حسابات التواصل فقط",
      "الحمد لله صار عندنا موقع نقدر نشارك رابطه مع العملاء ويكون مرجع للمعلومات والخدمات",
    ],
  },
  {
    id: "maya",
    name: "Maya Hassan",
    lang: "en",
    rating: 5,
    text: [
      "I wanted something simple and professional without making the website too complicated.",
      "The process helped me focus on what my business needed and I am pleased with the overall result.",
    ],
  },
];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function reviewById(id) {
  return REVIEWS.find((review) => review.id === id);
}

export function featuredReviews() {
  return FEATURED_REVIEW_IDS.map(reviewById).filter(Boolean);
}

export function starsHtml(rating = 5, label = "5 out of 5 stars") {
  const count = Math.max(1, Math.min(5, Number(rating) || 5));
  return `<div class="review-stars" aria-label="${escapeHtml(label)}"><span aria-hidden="true">${"★".repeat(count)}</span></div>`;
}

export function reviewCardHtml(review, starLabel = "5 out of 5 stars") {
  if (!review) return "";
  const dir = review.lang === "ar" ? "rtl" : "ltr";
  const body = review.text.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  return `<article class="review-card" lang="${review.lang}" dir="${dir}" data-review-id="${review.id}">
    ${starsHtml(review.rating, starLabel)}
    <blockquote>${body}</blockquote>
    <footer><cite>${escapeHtml(review.name)}</cite></footer>
  </article>`;
}

export function reviewsHtml(list, starLabel) {
  return list.map((review) => reviewCardHtml(review, starLabel)).join("");
}

export function reviewSchemaList(list = REVIEWS) {
  return list.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.name },
    inLanguage: review.lang,
    reviewBody: review.text.join(" "),
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.rating),
      bestRating: String(REVIEW_STATS.bestRating),
      worstRating: String(REVIEW_STATS.worstRating),
    },
    itemReviewed: { "@id": "https://www.powershift.space/#business" },
  }));
}
