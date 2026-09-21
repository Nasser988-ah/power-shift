from pathlib import Path
import json

root = Path(r"E:/power shift")

reviews = [
    {
        "id": "marwan",
        "name": "مروان الشاذلي",
        "lang": "ar",
        "text": [
            "بص يا جماعة أنا مش من الناس اللي بتحب تكتب ريفيوز كتير بس حبيت أقول تجربتي مع Power Shift كانت كويسة جدا كنت محتاج موقع للشركة ومكنتش عارف أبدأ منين واتناقشنا في التفاصيل لحد ما وصلنا للشكل المناسب",
        ],
    },
    {
        "id": "yassin",
        "name": "ياسين العتيبي",
        "lang": "ar",
        "text": [
            "كنت أبحث عن جهة تنفذ موقع لمشروعي والحمد لله كانت تجربة طيبة مع Power Shift التواصل كان واضح والشغل تم حسب المتطلبات اللي اتفقنا عليها",
        ],
    },
    {
        "id": "nour",
        "name": "Nour El Din",
        "lang": "en",
        "text": [
            "I honestly did not know exactly what I wanted at first.",
            "The team helped me organize my ideas and understand what my website actually needed.",
            "I am happy with how the project turned out.",
        ],
    },
    {
        "id": "basant",
        "name": "بسنت عادل",
        "lang": "ar",
        "text": [
            "أنا كنت فاكرة إن عمل موقع محتاج وجع دماغ كبير جدا خصوصا إني مش فاهمة في البرمجة خالص بس الموضوع كان أبسط مما توقعت وقدرت أوضح كل اللي محتاجاه",
        ],
    },
    {
        "id": "rashid",
        "name": "راشد المنهالي",
        "lang": "ar",
        "text": [
            "يعطيكم العافية على الشغل والتعاون",
            "كان عندنا بعض التفاصيل المهمة في المشروع وتمت مناقشتها بشكل واضح قبل التنفيذ وهذا الشيء فرق معنا",
        ],
    },
    {
        "id": "mina",
        "name": "Mina Fawzy",
        "lang": "en",
        "text": [
            "What I liked most was that the website did not feel like a generic template.",
            "We discussed what would suit my business and worked around those requirements.",
            "The experience was straightforward and professional.",
        ],
    },
    {
        "id": "hazem",
        "name": "حازم الديب",
        "lang": "ar",
        "text": [
            "أنا كنت عايز حاجة أقدر أبعت لينكها للعميل بدل ما أفضل كل مرة أشرحله إحنا بنقدم إيه والحمد لله الموقع بقى جامع المعلومات اللي محتاجينها في مكان واحد",
        ],
    },
    {
        "id": "lulwa",
        "name": "لولوة الهاجري",
        "lang": "ar",
        "text": [
            "بصراحة كنت متخوفة من التعامل عن بعد لكن الأمور كانت واضحة والتواصل كان سهل خلال تنفيذ الموقع والتجربة بشكل عام كانت مريحة",
        ],
    },
    {
        "id": "salma",
        "name": "Salma Nabil",
        "lang": "en",
        "text": [
            "I am not very technical so I really appreciated having things explained in a simple way.",
            "The team listened to my ideas and helped me figure out what made sense for my website.",
        ],
    },
    {
        "id": "mahmoud",
        "name": "محمود صبري",
        "lang": "ar",
        "text": [
            "أهم حاجة بالنسبالي كانت لوحة التحكم عشان مش عايز أفضل محتاج مبرمج كل ما أحتاج أغير حاجة في الموقع واتناقشنا في الموضوع ده أثناء الشغل",
        ],
    },
    {
        "id": "meshaal",
        "name": "مشعل الدوسري",
        "lang": "ar",
        "text": [
            "تجربتي مع Power Shift كانت جيدة",
            "كان المطلوب موقع يوضح خدمات المؤسسة بشكل مرتب وتم العمل على المتطلبات المتفق عليها",
        ],
    },
    {
        "id": "karim",
        "name": "Karim Samir",
        "lang": "en",
        "text": [
            "I had a few specific ideas for my website and wanted to make sure they were understood before development started.",
            "Communication was clear and I appreciated being able to discuss the details along the way.",
        ],
    },
    {
        "id": "rana",
        "name": "رنا فؤاد",
        "lang": "ar",
        "text": [
            "أنا من النوع اللي بيغير رأيه كتير في التصميم 😂 وكنت حريصة إن الموقع يطلع مناسب لشكل البراند بتاعي فكان مهم بالنسبالي إني أقدر أوضح الأفكار والتفاصيل اللي في دماغي",
        ],
    },
    {
        "id": "abdulrahman",
        "name": "عبدالرحمن الشمري",
        "lang": "ar",
        "text": [
            "كنت محتاج موقع إلكتروني لنشاطي بدل الاعتماد على حسابات التواصل فقط",
            "الحمد لله صار عندنا موقع نقدر نشارك رابطه مع العملاء ويكون مرجع للمعلومات والخدمات",
        ],
    },
    {
        "id": "maya",
        "name": "Maya Hassan",
        "lang": "en",
        "text": [
            "I wanted something simple and professional without making the website too complicated.",
            "The process helped me focus on what my business needed and I am pleased with the overall result.",
        ],
    },
]


def card(review, star_label):
    dir_attr = "rtl" if review["lang"] == "ar" else "ltr"
    body = "".join(f"<p>{line}</p>" for line in review["text"])
    return f'''          <article class="review-card" lang="{review["lang"]}" dir="{dir_attr}" data-review-id="{review["id"]}">
            <div class="review-stars" aria-label="{star_label}"><span aria-hidden="true">★★★★★</span></div>
            <blockquote>
              {body}
            </blockquote>
            <footer><cite>{review["name"]}</cite></footer>
          </article>'''


def schema_reviews():
    items = []
    for review in reviews:
        items.append(
            {
                "@type": "Review",
                "author": {"@type": "Person", "name": review["name"]},
                "inLanguage": review["lang"],
                "reviewBody": " ".join(review["text"]),
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1",
                },
                "itemReviewed": {"@id": "https://www.powershift.space/#business"},
            }
        )
    return items


aggregate = {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "15",
    "reviewCount": "15",
}

en_schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "CollectionPage",
            "@id": "https://www.powershift.space/reviews#webpage",
            "url": "https://www.powershift.space/reviews",
            "name": "Power Shift Reviews | 5-Star Client Feedback from Egypt and the GCC",
            "description": "Fifteen client reviews of Power Shift, a Cairo software studio. Clients rate the work 5 stars. Leave a review on WhatsApp.",
            "inLanguage": "en",
            "isPartOf": {"@id": "https://www.powershift.space/#website"},
            "about": {"@id": "https://www.powershift.space/#business"},
            "mainEntity": {"@id": "https://www.powershift.space/#business"},
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".page-hero h1", ".page-hero .lead"],
            },
        },
        {
            "@type": ["Organization", "ProfessionalService"],
            "@id": "https://www.powershift.space/#business",
            "name": "Power Shift",
            "url": "https://www.powershift.space/",
            "telephone": "+201553766199",
            "email": "info@powershift.space",
            "image": "https://www.powershift.space/logo/logo.png",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cairo",
                "addressCountry": "EG",
            },
            "aggregateRating": aggregate,
            "review": schema_reviews(),
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.powershift.space/reviews#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How do I leave a Power Shift review?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Send your review on WhatsApp. Power Shift adds it to this page after confirming it is from a real client.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "Are these Power Shift reviews real?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. The reviews on this page were written by clients and are published in the language they sent, Arabic or English.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "What is Power Shift’s rating from these reviews?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The 15 client reviews published on this page are all 5 stars, so the average shown here is 5.0.",
                    },
                },
            ],
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.powershift.space/"},
                {"@type": "ListItem", "position": 2, "name": "Reviews", "item": "https://www.powershift.space/reviews"},
            ],
        },
    ],
}

ar_schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "CollectionPage",
            "@id": "https://www.powershift.space/ar/reviews#webpage",
            "url": "https://www.powershift.space/ar/reviews",
            "name": "آراء عملاء باور شيفت | تقييم 5 نجوم لشركة تصميم مواقع في القاهرة",
            "description": "خمس عشرة مراجعة حقيقية لعملاء باور شيفت في القاهرة. التقييم الظاهر هنا 5 نجوم. اكتب تقييمك على واتساب.",
            "inLanguage": "ar",
            "isPartOf": {"@id": "https://www.powershift.space/#website"},
            "about": {"@id": "https://www.powershift.space/#business"},
            "mainEntity": {"@id": "https://www.powershift.space/#business"},
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".page-hero h1", ".page-hero .lead"],
            },
        },
        {
            "@type": ["Organization", "ProfessionalService"],
            "@id": "https://www.powershift.space/#business",
            "name": "Power Shift",
            "alternateName": ["باور شيفت", "PowerShift"],
            "url": "https://www.powershift.space/",
            "telephone": "+201553766199",
            "email": "info@powershift.space",
            "image": "https://www.powershift.space/logo/logo.png",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "القاهرة",
                "addressCountry": "EG",
            },
            "aggregateRating": aggregate,
            "review": schema_reviews(),
        },
        {
            "@type": "FAQPage",
            "@id": "https://www.powershift.space/ar/reviews#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "كيف أكتب تقييمًا لباور شيفت؟",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "أرسل تقييمك على واتساب. نضيفه إلى هذه الصفحة بعد التأكد أنه من عميل حقيقي.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "هل هذه المراجعات حقيقية؟",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "نعم. المراجعات في هذه الصفحة كتبها عملاء ونُشرت باللغة التي أرسلوها، عربي أو إنجليزي.",
                    },
                },
                {
                    "@type": "Question",
                    "name": "ما تقييم باور شيفت من هذه المراجعات؟",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "المراجعات الخمس عشرة المنشورة هنا كلها 5 نجوم، لذلك المتوسط الظاهر في الصفحة هو 5.0.",
                    },
                },
            ],
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://www.powershift.space/ar"},
                {"@type": "ListItem", "position": 2, "name": "آراء العملاء", "item": "https://www.powershift.space/ar/reviews"},
            ],
        },
    ],
}

en_cards = "\n".join(card(review, "5 out of 5 stars") for review in reviews)
ar_cards = "\n".join(card(review, "5 من 5 نجوم") for review in reviews)
en_json = json.dumps(en_schema, ensure_ascii=False, indent=8)
ar_json = json.dumps(ar_schema, ensure_ascii=False, indent=8)

en_html = f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <script src="/js/lang-boot.js?v=20260922c"></script>
    <title>Power Shift Reviews | 5-Star Client Feedback from Egypt and the GCC</title>
    <meta name="description" content="Read 15 client reviews of Power Shift, a Cairo software studio building websites and software for Egypt and the GCC. Clients rate the work 5 stars. Leave your review on WhatsApp." />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="POWER SHIFT" />
    <meta name="geo.region" content="EG-C" />
    <meta name="geo.placename" content="Cairo" />
    <link rel="canonical" href="https://www.powershift.space/reviews" />
    <link rel="alternate" hreflang="en" href="https://www.powershift.space/reviews" />
    <link rel="alternate" hreflang="ar" href="https://www.powershift.space/ar/reviews" />
    <link rel="alternate" hreflang="x-default" href="https://www.powershift.space/reviews" />
    <meta name="theme-color" content="#12243C" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="POWER SHIFT" />
    <meta property="og:url" content="https://www.powershift.space/reviews" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="ar_EG" />
    <meta property="og:title" content="Power Shift Reviews | 5-Star Client Feedback from Egypt and the GCC" />
    <meta property="og:description" content="Fifteen client reviews of Power Shift in Cairo. The published reviews are 5 stars. Leave yours on WhatsApp." />
    <meta property="og:image" content="https://www.powershift.space/assets/og/og-cover.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="POWER SHIFT software studio" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Power Shift Reviews | 5-Star Client Feedback from Egypt and the GCC" />
    <meta name="twitter:description" content="Fifteen client reviews of Power Shift in Cairo. The published reviews are 5 stars. Leave yours on WhatsApp." />
    <meta name="twitter:image" content="https://www.powershift.space/assets/og/og-cover.png" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/instrument-serif-400-italic.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/css/app.css?v=20260922c" />
    <link rel="stylesheet" href="/css/pages.css?v=20260922c" />
    <script type="application/ld+json">
{en_json}
    </script>
  </head>
  <body data-page="reviews">
    <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
    <a class="skip" href="#main" data-i18n="skip">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="POWER SHIFT">
          <img class="brand-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
        </a>
        <nav class="nav-desktop" aria-label="Primary" data-i18n-aria="a11y.primaryNav">
          <a href="/work" data-i18n="nav.work">Work</a>
          <a href="/services" data-i18n="nav.services">Services</a>
          <a href="/blog" data-nav="blog" data-i18n="nav.blog">Blog</a>
          <a href="/#approach" data-i18n="nav.approach">Approach</a>
          <a href="/about" data-i18n="nav.about">About</a>
          <a href="/reviews" data-i18n="nav.reviews" aria-current="page">Reviews</a>
          <a href="/contact" data-i18n="nav.contact">Contact</a>
        </nav>
        <div class="header-end">
          <div class="header-actions">
            <div class="lang-switch" role="group" aria-label="Language" data-i18n-aria="a11y.language">
              <span class="lang-thumb" aria-hidden="true"></span>
              <a href="/reviews" data-lang="en" hreflang="en" aria-current="true"><span class="lang-flag lang-flag-en" aria-hidden="true"></span>EN</a>
              <a href="/ar/reviews" data-lang="ar" hreflang="ar"><span class="lang-flag lang-flag-ar" aria-hidden="true"></span>عربي</a>
            </div>
            <a class="btn btn-primary btn-header-cta" href="/contact" data-i18n="cta.startShort">Book a Call</a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu" data-i18n-aria="cta.menu">
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <nav class="nav-mobile" id="mobile-nav" aria-label="Mobile" data-i18n-aria="a11y.mobileNav" aria-hidden="true" inert>
      <div class="nav-mobile-head"><p class="nav-mobile-label" data-i18n="nav.menuLabel">Menu</p></div>
      <div class="nav-mobile-links">
        <a href="/work" data-i18n="nav.work">Work</a>
        <a href="/services" data-i18n="nav.services">Services</a>
        <a href="/blog" data-nav="blog" data-i18n="nav.blog">Blog</a>
        <a href="/#approach" data-i18n="nav.approach">Approach</a>
        <a href="/about" data-i18n="nav.about">About</a>
        <a href="/reviews" data-i18n="nav.reviews" aria-current="page">Reviews</a>
        <a href="/contact" data-i18n="nav.contact">Contact</a>
      </div>
      <div class="nav-mobile-foot">
        <a class="btn btn-nav-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">WhatsApp</a>
        <a class="btn btn-primary btn-nav-mobile" href="/contact" data-i18n="cta.start">Book a Scope Call</a>
      </div>
    </nav>

    <main id="main">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Power Shift reviews</li>
          </ol>
        </nav>
      </div>
      <header class="page-hero wrap">
        <p class="kicker" data-i18n="reviews.kicker">Reviews</p>
        <h1>Power Shift reviews — 5-star client feedback</h1>
        <div class="review-score">
          <strong class="review-score-value">5.0</strong>
          <div class="review-score-meta">
            <div class="review-stars" aria-label="5 out of 5 stars"><span aria-hidden="true">★★★★★</span></div>
            <strong>Average from 15 client reviews</strong>
            <span>Client reviews published by Power Shift</span>
          </div>
        </div>
        <div class="page-hero-actions">
          <a class="btn btn-primary" href="https://wa.me/201553766199" data-wa-review data-ps-event="whatsapp_cta" data-ps-label="leave-review">Leave a review on WhatsApp</a>
          <a class="btn btn-ghost" href="/contact">Book a Scope Call</a>
        </div>
      </header>

      <section class="section" aria-label="Client reviews">
        <div class="wrap reviews-page-grid" data-review-list>
{en_cards}
        </div>
      </section>

      <section class="section section-dark">
        <div class="wrap reviews-leave">
          <p class="kicker">Leave a review</p>
          <h2>Worked with Power Shift? Send the review on WhatsApp.</h2>
          <p>We add client reviews to this page after we confirm they came from a real project. The button opens WhatsApp with a short note already written.</p>
          <div class="reviews-leave-actions">
            <a class="btn btn-mint" href="https://wa.me/201553766199" data-wa-review data-ps-event="whatsapp_cta" data-ps-label="leave-review-footer">Leave a review</a>
            <a class="btn btn-ghost-invert" href="/work">See the work</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-grid wrap-wide">
        <div class="footer-brand">
          <img class="footer-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
          <p>Software studio · Cairo · Egypt · GCC · International</p>
        </div>
        <div class="footer-col">
          <p class="footer-label">Contact</p>
          <a href="mailto:info@powershift.space">info@powershift.space</a>
          <a href="tel:+201553766199">+20 155 376 6199</a>
          <a href="https://wa.me/201553766199" data-wa>WhatsApp</a>
          <span>Cairo, Egypt</span>
        </div>
        <div class="footer-col">
          <p class="footer-label">Company</p>
          <a href="/work">Our Work</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/reviews" aria-current="page">Reviews</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
        </div>
        <div class="footer-col">
          <p class="footer-label">Official profiles</p>
          <a href="https://www.instagram.com/powershift.dev/" rel="me noopener" target="_blank">Instagram</a>
          <a href="https://www.facebook.com/people/Power-Shift/61573374143956/" rel="me noopener" target="_blank">Facebook</a>
          <a href="https://www.google.com/maps/place/power+shift/data=!4m2!3m1!1s0xcac1b10458c690d:0x8526e94bf69a7c8f" rel="me noopener" target="_blank">Google</a>
          <a href="https://www.linkedin.com/in/nasser-ahmed-6384a824a" rel="noopener" target="_blank">Founder — Nasser Ahmed</a>
        </div>
      </div>
      <div class="footer-base wrap-wide">
        <span>POWER SHIFT · <span data-year>2026</span> · All rights reserved.</span>
        <span>Briefs go to our WhatsApp. We do not sell your data.</span>
      </div>
    </footer>
    <div class="sticky-bar" data-sticky-bar>
      <a class="btn btn-primary btn-sticky-start" href="/contact">Book a Call</a>
      <a class="btn btn-mint btn-sticky-wa" href="https://wa.me/201553766199" data-wa>WhatsApp</a>
    </div>
    <script type="module" src="/js/main.js?v=20260922c"></script>
  </body>
</html>
'''

ar_html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <script src="/js/lang-boot.js?v=20260922c"></script>
    <title>آراء عملاء باور شيفت | تقييم 5 نجوم لشركة تصميم مواقع في القاهرة</title>
    <meta name="description" content="اقرأ 15 مراجعة حقيقية لعملاء باور شيفت، استوديو برمجيات في القاهرة يبني مواقع وأنظمة للشركات في مصر والخليج. التقييم الظاهر هنا 5 نجوم. اكتب تقييمك على واتساب." />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="POWER SHIFT" />
    <meta name="geo.region" content="EG-C" />
    <meta name="geo.placename" content="Cairo" />
    <link rel="canonical" href="https://www.powershift.space/ar/reviews" />
    <link rel="alternate" hreflang="en" href="https://www.powershift.space/reviews" />
    <link rel="alternate" hreflang="ar" href="https://www.powershift.space/ar/reviews" />
    <link rel="alternate" hreflang="x-default" href="https://www.powershift.space/reviews" />
    <meta name="theme-color" content="#12243C" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="POWER SHIFT" />
    <meta property="og:url" content="https://www.powershift.space/ar/reviews" />
    <meta property="og:locale" content="ar_EG" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:title" content="آراء عملاء باور شيفت | تقييم 5 نجوم لشركة تصميم مواقع في القاهرة" />
    <meta property="og:description" content="خمس عشرة مراجعة حقيقية لعملاء باور شيفت في القاهرة. التقييم الظاهر هنا 5 نجوم. اكتب تقييمك على واتساب." />
    <meta property="og:image" content="https://www.powershift.space/assets/og/og-cover.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="استوديو باور شيفت للبرمجيات" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="آراء عملاء باور شيفت | تقييم 5 نجوم لشركة تصميم مواقع في القاهرة" />
    <meta name="twitter:description" content="خمس عشرة مراجعة حقيقية لعملاء باور شيفت في القاهرة. التقييم الظاهر هنا 5 نجوم. اكتب تقييمك على واتساب." />
    <meta name="twitter:image" content="https://www.powershift.space/assets/og/og-cover.png" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/assets/fonts/ibm-plex-sans-arabic-500.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/css/app.css?v=20260922c" />
    <link rel="stylesheet" href="/css/pages.css?v=20260922c" />
    <script type="application/ld+json">
{ar_json}
    </script>
  </head>
  <body data-page="reviews">
    <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
    <a class="skip" href="#main" data-i18n="skip">انتقل إلى المحتوى</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/ar" aria-label="POWER SHIFT">
          <img class="brand-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
        </a>
        <nav class="nav-desktop" aria-label="التنقل الرئيسي" data-i18n-aria="a11y.primaryNav">
          <a href="/ar/work" data-i18n="nav.work">أعمالنا</a>
          <a href="/ar/services" data-i18n="nav.services">خدماتنا</a>
          <a href="/ar/blog" data-nav="blog" data-i18n="nav.blog">المدونة</a>
          <a href="/ar#approach" data-i18n="nav.approach">طريقة العمل</a>
          <a href="/ar/about" data-i18n="nav.about">من نحن</a>
          <a href="/ar/reviews" data-i18n="nav.reviews" aria-current="page">آراء العملاء</a>
          <a href="/ar/contact" data-i18n="nav.contact">تواصل معنا</a>
        </nav>
        <div class="header-end">
          <div class="header-actions">
            <div class="lang-switch" role="group" aria-label="اللغة" data-i18n-aria="a11y.language">
              <span class="lang-thumb" aria-hidden="true"></span>
              <a href="/reviews" data-lang="en" hreflang="en"><span class="lang-flag lang-flag-en" aria-hidden="true"></span>EN</a>
              <a href="/ar/reviews" data-lang="ar" hreflang="ar" aria-current="true"><span class="lang-flag lang-flag-ar" aria-hidden="true"></span>عربي</a>
            </div>
            <a class="btn btn-primary btn-header-cta" href="/ar/contact" data-i18n="cta.startShort">تواصل معنا</a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="افتح القائمة" data-i18n-aria="cta.menu">
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <nav class="nav-mobile" id="mobile-nav" aria-label="قائمة الهاتف" data-i18n-aria="a11y.mobileNav" aria-hidden="true" inert>
      <div class="nav-mobile-head"><p class="nav-mobile-label" data-i18n="nav.menuLabel">القائمة</p></div>
      <div class="nav-mobile-links">
        <a href="/ar/work" data-i18n="nav.work">أعمالنا</a>
        <a href="/ar/services" data-i18n="nav.services">خدماتنا</a>
        <a href="/ar/blog" data-nav="blog" data-i18n="nav.blog">المدونة</a>
        <a href="/ar#approach" data-i18n="nav.approach">طريقة العمل</a>
        <a href="/ar/about" data-i18n="nav.about">من نحن</a>
        <a href="/ar/reviews" data-i18n="nav.reviews" aria-current="page">آراء العملاء</a>
        <a href="/ar/contact" data-i18n="nav.contact">تواصل معنا</a>
      </div>
      <div class="nav-mobile-foot">
        <a class="btn btn-nav-wa" href="https://wa.me/201553766199" data-wa data-i18n="cta.whatsapp">واتساب</a>
        <a class="btn btn-primary btn-nav-mobile" href="/ar/contact" data-i18n="cta.start">تواصل معنا</a>
      </div>
    </nav>

    <main id="main">
      <div class="wrap">
        <nav class="breadcrumb" aria-label="مسار التنقل">
          <ol>
            <li><a href="/ar">الرئيسية</a></li>
            <li aria-current="page">آراء عملاء باور شيفت</li>
          </ol>
        </nav>
      </div>
      <header class="page-hero wrap">
        <p class="kicker">آراء العملاء</p>
        <h1>آراء عملاء باور شيفت — تقييم 5 نجوم</h1>
        <div class="review-score">
          <strong class="review-score-value">5.0</strong>
          <div class="review-score-meta">
            <div class="review-stars" aria-label="5 من 5 نجوم"><span aria-hidden="true">★★★★★</span></div>
            <strong>المتوسط من 15 مراجعة عملاء</strong>
            <span>مراجعات عملاء تنشرها باور شيفت</span>
          </div>
        </div>
        <div class="page-hero-actions">
          <a class="btn btn-primary" href="https://wa.me/201553766199" data-wa-review data-ps-event="whatsapp_cta" data-ps-label="leave-review">اكتب تقييمك على واتساب</a>
          <a class="btn btn-ghost" href="/ar/contact">تواصل معنا</a>
        </div>
      </header>

      <section class="section" aria-label="آراء العملاء">
        <div class="wrap reviews-page-grid" data-review-list>
{ar_cards}
        </div>
      </section>

      <section class="section section-dark">
        <div class="wrap reviews-leave">
          <p class="kicker">اكتب تقييمك</p>
          <h2>اشتغلت مع باور شيفت؟ ابعت التقييم على واتساب.</h2>
          <p>نضيف تقييمات العملاء إلى هذه الصفحة بعد التأكد أنها من مشروع حقيقي. الزر يفتح واتساب برسالة قصيرة جاهزة.</p>
          <div class="reviews-leave-actions">
            <a class="btn btn-mint" href="https://wa.me/201553766199" data-wa-review data-ps-event="whatsapp_cta" data-ps-label="leave-review-footer">اكتب تقييمك</a>
            <a class="btn btn-ghost-invert" href="/ar/work">شاهد الأعمال</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-grid wrap-wide">
        <div class="footer-brand">
          <img class="footer-logo" src="/logo/logo-header.webp" alt="POWER SHIFT" width="360" height="178" decoding="async" />
          <p>استوديو برمجيات · القاهرة · مصر · الخليج · الأسواق الدولية</p>
        </div>
        <div class="footer-col">
          <p class="footer-label">تواصل</p>
          <a href="mailto:info@powershift.space">info@powershift.space</a>
          <a href="tel:+201553766199">+20 155 376 6199</a>
          <a href="https://wa.me/201553766199" data-wa>واتساب</a>
          <span>القاهرة، مصر</span>
        </div>
        <div class="footer-col">
          <p class="footer-label">الشركة</p>
          <a href="/ar/work">أعمالنا</a>
          <a href="/ar/services">خدماتنا</a>
          <a href="/ar/about">من نحن</a>
          <a href="/ar/reviews" aria-current="page">آراء العملاء</a>
          <a href="/ar/blog">المدونة</a>
          <a href="/ar/contact">تواصل معنا</a>
        </div>
        <div class="footer-col">
          <p class="footer-label">حسابات رسمية</p>
          <a href="https://www.instagram.com/powershift.dev/" rel="me noopener" target="_blank">Instagram</a>
          <a href="https://www.facebook.com/people/Power-Shift/61573374143956/" rel="me noopener" target="_blank">Facebook</a>
          <a href="https://www.google.com/maps/place/power+shift/data=!4m2!3m1!1s0xcac1b10458c690d:0x8526e94bf69a7c8f" rel="me noopener" target="_blank">Google</a>
          <a href="https://www.linkedin.com/in/nasser-ahmed-6384a824a" rel="noopener" target="_blank">المؤسس — ناصر أحمد</a>
        </div>
      </div>
      <div class="footer-base wrap-wide">
        <span>POWER SHIFT · <span data-year>2026</span> · جميع الحقوق محفوظة.</span>
        <span>تصل تفاصيل مشروعك إلى واتساب. لا نبيع بياناتك.</span>
      </div>
    </footer>
    <div class="sticky-bar" data-sticky-bar>
      <a class="btn btn-primary btn-sticky-start" href="/ar/contact">تواصل معنا</a>
      <a class="btn btn-mint btn-sticky-wa" href="https://wa.me/201553766199" data-wa>واتساب</a>
    </div>
    <script type="module" src="/js/main.js?v=20260922c"></script>
  </body>
</html>
'''

en_path = root / "reviews" / "index.html"
ar_path = root / "ar" / "reviews" / "index.html"
en_path.parent.mkdir(parents=True, exist_ok=True)
ar_path.parent.mkdir(parents=True, exist_ok=True)
en_path.write_text(en_html, encoding="utf-8")
ar_path.write_text(ar_html, encoding="utf-8")
print("wrote", en_path)
print("wrote", ar_path)
