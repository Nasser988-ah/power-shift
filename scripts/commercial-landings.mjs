export function commercialPages({
  PATHS,
  section,
  cards,
  serviceRows,
  processSteps,
  workCards,
  readingCards,
  reviewsSection,
  includeSection,
  AR_PROCESS,
}) {
  const EN_PROCESS = [
    ["Understand the business", "Audience, the action you want, constraints and the content you already have."],
    ["Write the scope", "Pages, languages, features and what can wait — before any price."],
    ["Design and content", "Structure, interface and the contact path, plus who supplies copy and photos."],
    ["Build and review", "A preview link you open on your phone, then the agreed revisions."],
    ["Launch", "Pages, links, forms and Google indexability checked before going live."],
    ["After launch", "Maintenance, updates and the next version, as agreed."],
  ];

  const websiteOfferEn = {
    kicker: "Free prototype",
    title: "Have a business but no professional website?",
    body: "Send what you sell and who the customer is. We prepare an initial website prototype so you can see how the business could look online, then we say what belongs in version one. It is a first visual sample — not a finished site.",
    cta: "Get a Free Website Prototype",
  };

  const websiteOfferAr = {
    kicker: "نموذج مجاني",
    title: "عندك نشاط ومفيش موقع احترافي؟",
    body: "ابعت لنا إيه اللي بتبيعه ومين عميلك. نجهّز نموذج أولي لموقعك عشان تشوف شكل النشاط أونلاين، وبعدين نقول لك إيه يدخل النسخة الأولى. النموذج اتجاه بصري أول، مش موقع نهائي.",
    cta: "احصل على نموذج موقع مجاني",
  };

  const websiteIncludeEn = includeSection({
    kicker: "What is included",
    title: "What a website project covers",
    intro: "Price follows the written scope. These items are part of website and shop quotes unless a line is excluded in writing.",
    items: [
      ["Free first prototype", "A visual sample of how the business could look online, before you commit to a full build."],
      ["Written scope before price", "Pages, languages, features, and what can wait — in one document you approve."],
      ["First-year domain and hosting", "Included in the website or shop quote, with accounts in your company name."],
      ["You own the website", "Files and admin access are handed over. We do not hold the site after delivery."],
      ["Mobile-first, WhatsApp path", "Pages that read on a phone, with a clear call, WhatsApp, or order action."],
      ["Arabic and English when needed", "RTL and bilingual copy built together, not pasted on at the end."],
    ],
  });

  const websiteIncludeAr = includeSection({
    kicker: "ماذا يشمل العمل؟",
    title: "ما يدخل عرض الموقع",
    intro: "السعر يتبع النطاق المكتوب. البنود التالية جزء من مشاريع المواقع والمتاجر ما لم يُستثنَ بند في الاتفاق.",
    items: [
      ["نموذج أولي مجاني", "عيّنة بصرية أولى لشكل النشاط أونلاين، قبل الالتزام بنسخة كاملة."],
      ["نطاق مكتوب قبل السعر", "الصفحات واللغات والوظائف وما يُؤجَّل، في ملف توافق عليه."],
      ["الدومين والاستضافة للسنة الأولى", "ضمن عرض الموقع أو المتجر، والحسابات باسم شركتك لا باسمنا."],
      ["ملكية الموقع لك", "الملفات وحسابات الإدارة تُسلَّم لك. نحن لا نحتجز الموقع بعد التسليم."],
      ["موبايل أولًا ومسار واتساب", "صفحات تُقرأ من الهاتف، وزر واضح لمكالمة أو واتساب أو طلب."],
      ["عربي وإنجليزي عند الحاجة", "واجهة RTL تُبنى مع المحتوى، لا ترجمة تُلصق في الآخر."],
    ],
  });

  return [
    {
      id: "dev-en",
      file: "web-development-egypt/index.html",
      path: PATHS.devEn,
      lang: "en",
      alternates: { en: PATHS.devEn, ar: PATHS.devAr },
      langSwitch: { en: PATHS.devEn, ar: PATHS.devAr },
      wizard: "website",
      title: "Web Development Company in Egypt | Power Shift Cairo",
      description:
        "Web development company in Egypt for businesses that need a site that works: company websites, shops, landing pages, Arabic and English, WhatsApp enquiries. Built in Cairo. 15 five-star reviews.",
      crumb: "Web development in Egypt",
      kicker: "Web development company in Egypt",
      h1: "Web development company in Egypt — we build the site your customer can actually use",
      lead: "Power Shift is a Cairo studio that develops websites and shops for companies in Egypt and the GCC. Design is part of the job. The job itself is a live site on the phone, with a path to a call, WhatsApp, or an order.",
      cta: "Get a Free Website Prototype",
      ctaShort: "Free Prototype",
      waCta: "WhatsApp Us",
      proof: "5.0 from 15 client reviews — read them",
      service: {
        name: "Web development company in Egypt",
        description: "Custom web development for company websites, landing pages and shops, built by Power Shift in Cairo for businesses in Egypt.",
        type: "Web development",
        areaServed: ["Egypt"],
      },
      offer: websiteOfferEn,
      sections: [
        section({
          kicker: "Who this is for",
          title: "Owners looking for a web development company, not a template seller",
          intro: "If you searched for a website development company in Egypt, you need someone who will write the scope, build the pages, and stay after launch.",
          extraClass: "about-page",
          body: cards([
            ["Companies that still explain the business on WhatsApp", "A site that states what you do, who it is for, and how to reach you — one link you can send."],
            ["Teams comparing agencies in Egypt", "Live work you can open, a written scope before price, and a named person after launch."],
            ["Businesses that need Arabic and English", "RTL and both languages built as one product, not a translation bolted on."],
            ["Owners who also need a shop later", 'We will say if version one is a site or a store. Shop work lives on <a href="/ecommerce-website-development">ecommerce website development</a>.'],
          ]),
        }),
        websiteIncludeEn,
        section({
          kicker: "What we develop",
          title: "Websites, shops, and landing pages — scoped as separate jobs",
          dark: true,
          body: `          <div class="service-table">
${serviceRows([
  ["Business website", "Pages for the company, services, work and contact, built to load on a phone."],
  ["Landing page", "One offer, one audience, one action, when a full site is more than you need."],
  ["Ecommerce when it is the right shape", 'Catalogue, cart, WhatsApp order or checkout — see <a href="/ecommerce-website-development">ecommerce development</a>.'],
  ["Cairo-based delivery", 'The studio is in Cairo. Local website work is also covered on <a href="/website-development-cairo">website development in Cairo</a>.'],
])}
          </div>
          <p class="services-also">For operations software rather than a public site, see <a href="/custom-software-development">custom software development</a>. For design-led company sites, see <a href="/web-design-egypt">website design in Egypt</a>.</p>`,
        }),
        section({
          kicker: "Work you can open",
          title: "Sites this studio has already shipped",
          intro: "We do not publish traffic or sales numbers a client has not approved.",
          body: `          <div class="related-grid">
${workCards("en", [
  ["heba", "Dr. Heba Ezz El-Arab clinic website", "Clinic pages families can find, fast on a phone, with WhatsApp booking."],
  ["radwan", "Radwan Ezz El-Arab law office website", "Arabic law-office site with practice areas and WhatsApp booking."],
  ["via", "VIA Holidays travel website", "Travel site with destination pages and a clear enquiry path."],
  ["lodiamo", "Lodiamo corporate website", "Catalogue pages a Gulf buyer can find, fast enough for a commercial enquiry."],
  ["medlab", "MedLab Market catalogue", "Arabic medical catalogue with cart and a quote request path."],
  ["adam", "Adam Trending kids shop", "Arabic shop with cart orders sent on WhatsApp."],
])}
          </div>`,
        }),
        reviewsSection("en", ["nour", "mina", "salma", "maya"], {
          kicker: "Client reviews",
          title: "What clients say about the build",
          note: "Average from 15 client reviews",
          readAll: "Read all reviews",
          leave: "Leave a review",
        }),
        section({
          kicker: "Process",
          title: "From brief to a live URL",
          body: `          <div class="process">
${processSteps(EN_PROCESS)}
          </div>`,
        }),
        section({
          kicker: "Related pages",
          title: "Pick the page that matches the search you came from",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.egyptEn, "Website design company in Egypt", "When the look, structure and enquiry path are the main job."],
  [PATHS.cairoEn, "Website development in Cairo", "When you want a Cairo studio you can reach on WhatsApp."],
  [PATHS.shopEn, "Ecommerce website development", "When the job is a shop, catalogue or wholesale path."],
  [PATHS.softwareEn, "Custom software development", "When a public website is not enough."],
])}
          </div>`,
        }),
      ],
      faqKicker: "FAQ",
      faqTitle: "Before you brief a web development company",
      faq: [
        ["How much does web development cost in Egypt?", 'There is no single price. Cost follows pages, languages, content and features, and we set it after the scope is clear. Read <a href="/blog/how-much-does-a-website-cost-in-egypt.html">what changes website cost</a>.'],
        ["Do you include domain and hosting?", "On website and shop projects, the first year of domain and hosting is included in the quote. Accounts stay in your company name."],
        ["Who owns the website?", "You do. Files and admin access are handed over. That is written into the scope."],
        ["Do you build Arabic and English sites?", "Yes, when it is in the scope. Interface, copy and RTL are built together."],
        ["Is this the same as website design?", `Design is part of development. If you searched specifically for design, use <a href="${PATHS.egyptEn}">website design in Egypt</a>.`],
      ],
      final: {
        kicker: "Next step",
        title: "Tell us what the business does",
        body: "We send a first prototype direction, then a written scope for version one.",
        cta: "Get a Free Website Prototype",
      },
    },
    {
      id: "dev-ar",
      file: "ar/شركة-برمجة-مواقع/index.html",
      path: PATHS.devAr,
      lang: "ar",
      alternates: { en: PATHS.devEn, ar: PATHS.devAr },
      langSwitch: { en: PATHS.devEn, ar: PATHS.devAr },
      wizard: "website",
      title: "شركة برمجة مواقع في مصر | باور شيفت القاهرة",
      description:
        "شركة برمجة مواقع في مصر لأصحاب الشركات: موقع يعمل من الموبايل، عربي وإنجليزي، مسار واتساب، ونطاق مكتوب قبل السعر. استوديو في القاهرة و15 تقييم 5 نجوم.",
      crumb: "شركة برمجة مواقع",
      kicker: "شركة برمجة مواقع في مصر",
      h1: "شركة برمجة مواقع في مصر — نبرمج موقع تقدر تبعته لعميلك",
      lead: "باور شيفت استوديو في القاهرة بيبرمّج مواقع الشركات والمتاجر. التصميم جزء من الشغل. الشغل نفسه موقع يفتح من الموبايل، وله خطوة واضحة: مكالمة أو واتساب أو طلب.",
      cta: "احصل على نموذج موقع مجاني",
      ctaShort: "نموذج مجاني",
      waCta: "راسلنا واتساب",
      proof: "5.0 من 15 مراجعة عملاء — اقرأها",
      service: {
        name: "شركة برمجة مواقع في مصر",
        description: "برمجة مواقع الشركات وصفحات الهبوط والمتاجر الإلكترونية من باور شيفت في القاهرة.",
        type: "Web development",
        areaServed: ["Egypt"],
      },
      offer: websiteOfferAr,
      sections: [
        section({
          kicker: "لمن الصفحة؟",
          title: "لصاحب النشاط اللي بيدوّر على شركة برمجة، مش قالب جاهز",
          intro: "لو بتدور على شركة برمجة مواقع، محتاج حد يكتب النطاق، يبرمج الصفحات، ويفضل موجود بعد الإطلاق.",
          extraClass: "about-page",
          body: cards([
            ["شركات بتشرح شغلها كل مرة على واتساب", "موقع يقول تعمل إيه ولمين، ورابط واحد تبعته بدل الشرح المتكرر."],
            ["مقارنة بين شركات برمجة في مصر", "أعمال تقدر تفتحها، نطاق مكتوب قبل السعر، ومسؤول باسمه بعد الإطلاق."],
            ["شغل عربي وإنجليزي", "RTL واللغتين منتج واحد، مش ترجمة في الآخر."],
            ["لو هتحتاج متجر بعد كده", `نقول لك من الأول الموقع يكفي ولا المتجر. تفاصيل المتاجر في <a href="${PATHS.shopAr}">تصميم متجر إلكتروني</a>.`],
          ]),
        }),
        websiteIncludeAr,
        section({
          kicker: "ماذا نبرمج؟",
          title: "موقع شركة، صفحة هبوط، أو متجر — كل واحد نطاقه",
          dark: true,
          body: `          <div class="service-table">
${serviceRows([
  ["موقع شركة", "صفحات النشاط والخدمات والأعمال والتواصل، تشتغل من الموبايل."],
  ["صفحة هبوط", "عرض واحد وجمهور واحد وفعل واحد، لما الموقع الكامل أكبر من احتياجك."],
  ["متجر عند الحاجة", `كتالوج وسلة وطلب واتساب أو دفع — <a href="${PATHS.shopAr}">تصميم متجر إلكتروني</a>.`],
  ["تنفيذ من القاهرة", `الاستوديو في القاهرة. لو بتدور محليًا: <a href="${PATHS.cairoAr}">تصميم مواقع في القاهرة</a>.`],
])}
          </div>
          <p class="services-also">لو المطلوب برنامج للفريق مش موقع عام، راجع <a href="${PATHS.softwareAr}">برمجة أنظمة مخصصة</a>. ولو البحث عن تصميم مواقع شركات: <a href="${PATHS.egyptAr}">تصميم مواقع في مصر</a>.</p>`,
        }),
        section({
          kicker: "أعمال يمكن فتحها",
          title: "مواقع برمجناها ونقدر تفتحها",
          intro: "لا ننشر أرقام زيارات أو مبيعات لم يصرّح بها العميل.",
          body: `          <div class="related-grid">
${workCards("ar", [
  ["heba", "موقع عيادة د. هبة عز العرب", "صفحة للعيادة ولكل فرع. تفتح على الموبايل، والحجز على واتساب من الشاشة الأولى."],
  ["radwan", "موقع مكتب رضوان عز العرب", "موقع محاماة بالعربي ومجالات عمل ومسار واتساب."],
  ["via", "موقع VIA Holidays", "موقع سفر بصفحات وجهات ومسار استفسار."],
  ["medlab", "كتالوج MedLab Market", "كتالوج طبي عربي وسلة وطلب عرض سعر."],
  ["adam", "متجر Adam Trending", "متجر عربي والطلب يكتمل على واتساب."],
  ["lodiamo", "موقع Lodiamo", "يصل إلى خط المنتجات بالعربي أو الإنجليزي، ويرسل استفساره قبل أن يغلق الصفحة."],
])}
          </div>`,
        }),
        reviewsSection("ar", ["marwan", "hazem", "basant", "mahmoud"], {
          kicker: "آراء العملاء",
          title: "ماذا يقول العملاء عن التنفيذ",
          note: "المتوسط من 15 مراجعة عملاء",
          readAll: "اقرأ كل المراجعات",
          leave: "اكتب تقييمك",
        }),
        section({
          kicker: "طريقة العمل",
          title: "من الرسالة إلى رابط حي",
          body: `          <div class="process">
${processSteps(AR_PROCESS)}
          </div>`,
        }),
        section({
          kicker: "صفحات مرتبطة",
          title: "اختَر الصفحة الأقرب لبحثك",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.egyptAr, "شركة تصميم مواقع في مصر", "لما التركيز على شكل الموقع ومسار التواصل."],
  [PATHS.companyAr, "تصميم موقع شركة", "لما المطلوب موقع شركة يوضح النشاط."],
  [PATHS.cairoAr, "شركة تصميم مواقع في القاهرة", "لما تدور على استوديو في القاهرة."],
  [PATHS.softwareAr, "برمجة أنظمة مخصصة", "لما الموقع العام مش كفاية."],
])}
          </div>`,
        }),
      ],
      faqKicker: "أسئلة شائعة",
      faqTitle: "قبل ما تبعت تفاصيل لشركة برمجة مواقع",
      faq: [
        ["كم تكلفة برمجة موقع في مصر؟", 'مفيش سعر واحد. التكلفة تتبع الصفحات واللغات والمحتوى والوظائف، وبتتحدد بعد النطاق. اقرأ <a href="/ar/blog/how-much-does-a-website-cost-in-egypt.html">ما الذي يغيّر التكلفة</a>.'],
        ["الدومين والاستضافة مشمولين؟", "في مشاريع المواقع والمتاجر السنة الأولى من الدومين والاستضافة ضمن العرض، والحسابات باسم شركتك."],
        ["مين مالك الموقع؟", "إنت. الملفات وصلاحيات الإدارة بتتتسلم لك، وده مكتوب في النطاق."],
        ["بتعملوا عربي وإنجليزي؟", "أيوه لما يكونوا في النطاق. الواجهة والنصوص وRTL بيتبنوا مع بعض."],
      ],
      final: {
        kicker: "الخطوة التالية",
        title: "قول لنا النشاط بيعمل إيه",
        body: "نجهّز اتجاه النموذج الأولي، وبعدين نطاق مكتوب للنسخة الأولى.",
        cta: "احصل على نموذج موقع مجاني",
      },
    },
    {
      id: "cairo-en",
      file: "website-development-cairo/index.html",
      path: PATHS.cairoEn,
      lang: "en",
      alternates: { en: PATHS.cairoEn, ar: PATHS.cairoAr },
      langSwitch: { en: PATHS.cairoEn, ar: PATHS.cairoAr },
      wizard: "website",
      title: "Website Development in Cairo | Web Design Company in Cairo — Power Shift",
      description:
        "Website development in Cairo for companies, clinics and shops. A remote-first studio based in Cairo — WhatsApp, preview links, written scope. Arabic and English. 15 five-star reviews.",
      crumb: "Website development in Cairo",
      kicker: "Website development company in Cairo",
      h1: "Website development in Cairo for businesses that want a studio they can actually reach",
      lead: "Power Shift is based in Cairo. We do not run a walk-in office. Work happens on WhatsApp, calls, and preview links you open on your phone — for clients in Cairo, the rest of Egypt, and the GCC.",
      cta: "Get a Free Website Prototype",
      ctaShort: "Free Prototype",
      waCta: "WhatsApp Us",
      proof: "5.0 from 15 client reviews — read them",
      service: {
        name: "Website development in Cairo",
        description: "Website design and development for businesses, delivered by a Cairo studio over WhatsApp, calls and preview links.",
        type: "Website development",
        areaServed: ["Cairo", "Egypt"],
      },
      offer: websiteOfferEn,
      sections: [
        section({
          kicker: "Cairo, honestly",
          title: "A Cairo studio — not a fake local branch",
          intro: "If you searched for a web design company in Cairo, you should know how delivery actually works.",
          extraClass: "about-page",
          body: cards([
            ["Based in Cairo", "The founder and the build sit in Cairo. You reach the people who will do the work."],
            ["No public walk-in office", "We do not ask you to visit a showroom. Briefs, reviews and launch happen online."],
            ["Same city, same working hours", "Calls are easy to schedule. WhatsApp is the default thread."],
            ["Work already done for Cairo businesses", 'Clinic and law-office sites for Cairo practices — <a href="/work/heba.html">Dr. Heba Ezz</a> and <a href="/work/radwan.html">Radwan Ezz El-Arab</a>.'],
          ]),
        }),
        websiteIncludeEn,
        section({
          kicker: "What we build from Cairo",
          title: "Company sites, landing pages, and shops",
          dark: true,
          body: `          <div class="service-table">
${serviceRows([
  ["Company website", "The page a Cairo client can send instead of explaining the business again."],
  ["Landing page", "One offer and one action for a campaign or a first version."],
  ["Shop or catalogue", `When selling is the job — <a href="${PATHS.shopEn}">ecommerce website development</a>.`],
  ["Egypt-wide or GCC", `Clients outside Cairo are normal. Egypt-wide work: <a href="${PATHS.devEn}">web development in Egypt</a>.`],
])}
          </div>`,
        }),
        section({
          kicker: "Cairo work you can open",
          title: "Sites built for businesses you can recognise",
          body: `          <div class="related-grid">
${workCards("en", [
  ["heba", "Dr. Heba Ezz El-Arab clinic website", "Geriatric clinic site with New Cairo and Mohandessin pages."],
  ["radwan", "Radwan Ezz El-Arab law office", "Arabic Cairo law-office site with WhatsApp booking."],
  ["nourvive", "Nourvive beauty storefront", "A beauty shop buyers can find, that opens fast, with a cart."],
  ["corolla", "Corolla food shop", "Egyptian brand shop for homes and wholesale orders."],
])}
          </div>`,
        }),
        reviewsSection("en", ["mina", "salma", "nour", "karim"], {
          kicker: "Client reviews",
          title: "What clients say",
          note: "Average from 15 client reviews",
          readAll: "Read all reviews",
          leave: "Leave a review",
        }),
        section({
          kicker: "Related",
          title: "If Cairo was not the word you searched",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.devEn, "Web development company in Egypt", "Egypt-wide development, same studio."],
  [PATHS.egyptEn, "Website design in Egypt", "Design and enquiry path for company sites."],
  [PATHS.softwareEn, "Custom software development", "When you need a system, not a brochure site."],
])}
          </div>`,
        }),
      ],
      faqKicker: "FAQ",
      faqTitle: "Working with a Cairo web studio",
      faq: [
        ["Do you have an office in Cairo I can visit?", "We are remote-first in Cairo and do not operate a public walk-in office. You brief and review online."],
        ["Do you only work with Cairo clients?", "No. Cairo is where we sit. We also work across Egypt and remotely with GCC companies."],
        ["Who owns the domain?", "You do. On website projects the first year of domain and hosting is included in the quote, in your company account."],
        ["How do reviews happen?", "A preview link you open on your phone, plus WhatsApp or a scheduled call."],
      ],
      final: {
        kicker: "Next step",
        title: "Message from Cairo working hours",
        body: "Send the business name and what the site should do. We reply with prototype questions on WhatsApp.",
        cta: "Get a Free Website Prototype",
      },
    },
    {
      id: "cairo-ar",
      file: "ar/تصميم-مواقع-القاهرة/index.html",
      path: PATHS.cairoAr,
      lang: "ar",
      alternates: { en: PATHS.cairoEn, ar: PATHS.cairoAr },
      langSwitch: { en: PATHS.cairoEn, ar: PATHS.cairoAr },
      wizard: "website",
      title: "شركة تصميم مواقع في القاهرة | باور شيفت",
      description:
        "شركة تصميم مواقع في القاهرة لأصحاب الشركات والعيادات والمتاجر. استوديو في القاهرة يشتغل أونلاين: واتساب وروابط معاينة ونطاق مكتوب. عربي وإنجليزي. 15 تقييم 5 نجوم.",
      crumb: "تصميم مواقع في القاهرة",
      kicker: "شركة تصميم مواقع في القاهرة",
      h1: "شركة تصميم مواقع في القاهرة — استوديو محلي تقدر توصله على واتساب",
      lead: "باور شيفت في القاهرة. مفيش مكتب استقبال للزيارات. الشغل بيحصل على واتساب ومكالمات وروابط معاينة بتفتحها من موبايلك — لعملاء القاهرة وباقي مصر والخليج.",
      cta: "احصل على نموذج موقع مجاني",
      ctaShort: "نموذج مجاني",
      waCta: "راسلنا واتساب",
      proof: "5.0 من 15 مراجعة عملاء — اقرأها",
      service: {
        name: "شركة تصميم مواقع في القاهرة",
        description: "تصميم وبرمجة مواقع الشركات من استوديو في القاهرة عبر واتساب والمكالمات وروابط المراجعة.",
        type: "Website design and development",
        areaServed: ["Cairo", "Egypt"],
      },
      offer: websiteOfferAr,
      sections: [
        section({
          kicker: "القاهرة بوضوح",
          title: "استوديو في القاهرة — من غير فرع شكلي",
          intro: "لو بتدور على شركة تصميم مواقع في القاهرة، لازم تعرف الشغل بيحصل إزاي.",
          extraClass: "about-page",
          body: cards([
            ["من القاهرة", "المؤسس والتنفيذ هنا. بتكلم الناس اللي هتبني الموقع."],
            ["من غير مكتب زيارات", "مش بنطلب منك تيجي معرض. الموجز والمراجعة والإطلاق أونلاين."],
            ["نفس التوقيت", "المكالمات سهلة، وواتساب هو الخط الأساسي."],
            ["شغل للقاهرة موجود", `مواقع عيادات ومكاتب في القاهرة — <a href="/work/heba.html">د. هبة عز</a> و<a href="/work/radwan.html">رضوان عز العرب</a>.`],
          ]),
        }),
        websiteIncludeAr,
        section({
          kicker: "ماذا نبني من القاهرة؟",
          title: "موقع شركة، صفحة هبوط، أو متجر",
          dark: true,
          body: `          <div class="service-table">
${serviceRows([
  ["موقع شركة", "الصفحة اللي العميل في القاهرة يبعتها بدل ما يشرح النشاط تاني."],
  ["صفحة هبوط", "عرض واحد وفعل واحد لحملة أو نسخة أولى."],
  ["متجر أو كتالوج", `لما البيع هو الشغل — <a href="${PATHS.shopAr}">تصميم متجر إلكتروني</a>.`],
  ["برّه القاهرة كمان", `عملاء المحافظات والخليج جزء من الشغل. على مستوى مصر: <a href="${PATHS.devAr}">شركة برمجة مواقع</a>.`],
])}
          </div>`,
        }),
        section({
          kicker: "أعمال من القاهرة",
          title: "مواقع لنشاطات تقدر تتعرف عليها",
          body: `          <div class="related-grid">
${workCards("ar", [
  ["heba", "موقع عيادة د. هبة عز العرب", "موقع عيادة بصفحات التجمع والمهندسين."],
  ["radwan", "موقع مكتب رضوان عز العرب", "موقع محاماة في القاهرة وحجز واتساب."],
  ["nourvive", "متجر Nourvive", "صفحة لكل منتج، بالعربي أو الإنجليزي، والسلة لا تقف."],
  ["corolla", "متجر Corolla", "متجر علامة مصرية للأفراد والجملة."],
])}
          </div>`,
        }),
        reviewsSection("ar", ["marwan", "basant", "hazem", "mahmoud"], {
          kicker: "آراء العملاء",
          title: "ماذا يقول العملاء",
          note: "المتوسط من 15 مراجعة عملاء",
          readAll: "اقرأ كل المراجعات",
          leave: "اكتب تقييمك",
        }),
        section({
          kicker: "صفحات مرتبطة",
          title: "لو القاهرة مش كلمة البحث الوحيدة",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.devAr, "شركة برمجة مواقع في مصر", "برمجة مواقع على مستوى مصر."],
  [PATHS.egyptAr, "شركة تصميم مواقع في مصر", "تصميم مواقع الشركات والعيادات والمتاجر."],
  [PATHS.companyAr, "تصميم موقع شركة", "لما المطلوب موقع شركة يوضح النشاط."],
])}
          </div>`,
        }),
      ],
      faqKicker: "أسئلة شائعة",
      faqTitle: "الشغل مع استوديو مواقع في القاهرة",
      faq: [
        ["عندكم مكتب أزوره في القاهرة؟", "إحنا remote-first في القاهرة، ومفيش مكتب استقبال للزيارات. الموجز والمراجعة أونلاين."],
        ["بتشتغلوا مع عملاء برّه القاهرة؟", "أيوه. القاهرة مكاننا. نشتغل في باقي مصر ومع شركات الخليج عن بُعد."],
        ["مين يملك الدومين؟", "إنت. في مشاريع المواقع السنة الأولى من الدومين والاستضافة ضمن العرض، والحساب باسم شركتك."],
        ["المراجعة بتتم إزاي؟", "رابط تجريبي بتفتحه من الموبايل، وواتساب أو مكالمة مجدولة."],
      ],
      final: {
        kicker: "الخطوة التالية",
        title: "ابعت من هنا — نفس توقيت القاهرة",
        body: "اسم النشاط وإيه المفروض الموقع يعمله. نرد بأسئلة النموذج على واتساب.",
        cta: "احصل على نموذج موقع مجاني",
      },
    },
    {
      id: "company-ar",
      file: "ar/تصميم-موقع-شركة/index.html",
      path: PATHS.companyAr,
      lang: "ar",
      langSwitch: { en: PATHS.egyptEn, ar: PATHS.companyAr },
      wizard: "website",
      title: "تصميم موقع شركة في مصر | باور شيفت",
      description:
        "تصميم موقع شركة في مصر يوضح النشاط والخدمات ومسار التواصل. عربي وإنجليزي، موبايل أولًا، نموذج أولي مجاني، والدومين باسم شركتك. أمثلة حية من القاهرة.",
      crumb: "تصميم موقع شركة",
      kicker: "تصميم موقع شركة",
      h1: "تصميم موقع شركة يوضح نشاطك ويقود العميل لواتساب أو مكالمة",
      lead: "موقع الشركة مش كاتالوج صور. هو الصفحة اللي العميل يدخلها عشان يفهم بتبيع إيه، ليه يثق فيك، وإزاي يتواصل. بنبني الموقع ده للشركات والعيادات والمكاتب من القاهرة.",
      cta: "احصل على نموذج موقع مجاني",
      ctaShort: "نموذج مجاني",
      waCta: "راسلنا واتساب",
      proof: "5.0 من 15 مراجعة عملاء — اقرأها",
      service: {
        name: "تصميم موقع شركة",
        description: "تصميم وبرمجة مواقع الشركات والخدمات المهنية في مصر من باور شيفت في القاهرة.",
        type: "Company website design",
        areaServed: ["Egypt"],
      },
      offer: websiteOfferAr,
      sections: [
        section({
          kicker: "إيه موقع الشركة؟",
          title: "صفحة تملكها، مش بوست على فيسبوك",
          intro: "فيسبوك يجيب رسالة. موقع الشركة هو العنوان اللي بتديه لأي عميل جاد، ويظهر في جوجل باسم نشاطك.",
          extraClass: "about-page",
          body: cards([
            ["شركات خدمات", "خدمات، أعمال، فريق، وتواصل. رابط واحد بدل الشرح المتكرر."],
            ["عيادات ومكاتب مهنية", `تخصص ومكان ومسار حجز — زي <a href="/work/heba.html">موقع العيادة</a> و<a href="/work/radwan.html">موقع المكتب</a>.`],
            ["شركات بتبيع للشركات", "نشاط واضح ودليل شغل ومسار طلب عرض سعر."],
            ["لو البيع أونلاين هو الأصل", `ده متجر مش موقع شركة. روح <a href="${PATHS.shopAr}">تصميم متجر إلكتروني</a>.`],
          ]),
        }),
        websiteIncludeAr,
        section({
          kicker: "إيه اللي بيتبني؟",
          title: "الصفحات اللي موقع الشركة محتاجها فعلًا",
          dark: true,
          body: `          <div class="service-table">
${serviceRows([
  ["الرئيسية", "جملة واحدة عن النشاط، ودليل إنكم حقيقيين، وزر تواصل ظاهر."],
  ["الخدمات", "كل خدمة بصفحة أو قسم واضح، من غير حشو."],
  ["من نحن / الأعمال", "لي يختاروك، وأمثلة تتفتح."],
  ["تواصل", "واتساب وهاتف ونموذج عند الحاجة، بالعربي وRTL."],
  ["صفحة هبوط عند الحاجة", "لما حملة أو عرض واحد أهم من الموقع الكامل."],
])}
          </div>
          <p class="services-also">لو بتدور على شركة تبني الموقع: <a href="${PATHS.devAr}">شركة برمجة مواقع</a> أو <a href="${PATHS.egyptAr}">شركة تصميم مواقع في مصر</a>.</p>`,
        }),
        section({
          kicker: "أمثلة",
          title: "مواقع شركات وممارسات مهنية",
          body: `          <div class="related-grid">
${workCards("ar", [
  ["lodiamo", "موقع Lodiamo", "يصل إلى خط المنتجات ويرسل استفساره قبل أن يغلق الصفحة."],
  ["via", "موقع VIA Holidays", "موقع شركة سياحة بصفحات وجهات."],
  ["heba", "موقع عيادة د. هبة", "صفحة للعيادة تفتح على الموبايل، والحجز على واتساب."],
  ["radwan", "موقع مكتب رضوان عز العرب", "موقع مكتب محاماة بالعربي."],
])}
          </div>`,
        }),
        reviewsSection("ar", ["marwan", "hazem", "basant"], {
          kicker: "آراء العملاء",
          title: "ماذا يقول أصحاب المواقع",
          note: "المتوسط من 15 مراجعة عملاء",
          readAll: "اقرأ كل المراجعات",
          leave: "اكتب تقييمك",
        }),
        section({
          kicker: "طريقة العمل",
          title: "من فهم النشاط إلى الإطلاق",
          body: `          <div class="process">
${processSteps(AR_PROCESS)}
          </div>`,
        }),
      ],
      faqKicker: "أسئلة شائعة",
      faqTitle: "قبل تصميم موقع الشركة",
      faq: [
        ["كام صفحة يحتاج موقع الشركة؟", "النسخة الأولى غالبًا رئيسية وخدمات وتواصل، وأعمال إن وُجدت. الباقي يتحدد بعد فهم النشاط."],
        ["ممكن موقع شركة بالعربي والإنجليزي؟", "أيوه لما جمهورك محتاج الاتنين. بيتبنى كمنتج واحد."],
        ["الدومين باسمي؟", "أيوه. السنة الأولى من الدومين والاستضافة ضمن عرض الموقع، والحساب باسم الشركة."],
        ["ده نفس تصميم المتجر؟", `لا. موقع الشركة يعرّف النشاط. المتجر يبيع منتجات. لو الاتنين مطلوبين، بنحدد إيه النسخة الأولى.`],
      ],
      final: {
        kicker: "الخطوة التالية",
        title: "قول لنا الشركة بتعمل إيه",
        body: "نجهّز نموذج أولي لموقع الشركة، وبعدين نكتب صفحات النسخة الأولى.",
        cta: "احصل على نموذج موقع مجاني",
      },
    },
    {
      id: "shop-en",
      file: "ecommerce-website-development/index.html",
      path: PATHS.shopEn,
      lang: "en",
      alternates: { en: PATHS.shopEn, ar: PATHS.shopAr },
      langSwitch: { en: PATHS.shopEn, ar: PATHS.shopAr },
      wizard: "ecommerce",
      title: "Ecommerce Website Development in Egypt | Power Shift",
      description:
        "Ecommerce website development in Egypt for brands that sell: catalogues, carts, WhatsApp orders, checkout or wholesale enquiry. Arabic and English. Live shops from Cairo. 15 five-star reviews.",
      crumb: "Ecommerce website development",
      kicker: "Ecommerce website development in Egypt",
      h1: "Ecommerce website development in Egypt that matches how you already sell",
      lead: "Some businesses need a cart and payment. Others need a catalogue and a WhatsApp or wholesale request. We decide that first, then build a storefront a customer can use on their phone.",
      cta: "Get a Free Website Prototype",
      ctaShort: "Free Prototype",
      waCta: "WhatsApp Us",
      proof: "5.0 from 15 client reviews — read them",
      service: {
        name: "Ecommerce website development in Egypt",
        description: "Ecommerce website design and development for retail, wholesale and brand shops in Egypt, built by Power Shift in Cairo.",
        type: "Ecommerce website development",
        areaServed: ["Egypt"],
      },
      offer: {
        kicker: "Free prototype",
        title: "Selling from Instagram or WhatsApp today?",
        body: "Send the product type and how people order now. We prepare a first storefront prototype for mobile, then say whether you need checkout or a catalogue with a direct request.",
        cta: "Get a Free Website Prototype",
      },
      sections: [
        section({
          kicker: "Before we build",
          title: "Full shop or catalogue — this changes the quote",
          intro: 'We wrote the distinction in <a href="/blog/ecommerce-website-or-catalogue-egypt.html">shop versus catalogue in Egypt</a>.',
          extraClass: "about-page",
          body: cards([
            ["Cart and order completion", "When the customer buys now: products, cart, then WhatsApp checkout or payment as agreed."],
            ["Catalogue and quote request", "When you sell to companies or wholesalers: browse by sector, then request a quote."],
            ["Retail and wholesale together", "Two clear paths on one storefront, when that is how the business already works."],
            ["Brand storefront", "When the browse experience is part of the sale, not a product list."],
          ]),
        }),
        includeSection({
          kicker: "What is included",
          title: "What an ecommerce project covers",
          intro: "Price follows catalogue size, order path, languages, and who enters products. First-year domain and hosting are included in the shop quote, in your name.",
          items: [
            ["Free storefront prototype", "A first look at categories and product pages on a phone."],
            ["Categories and product pages", "A structure a customer can actually browse on mobile."],
            ["The order path you need", "WhatsApp order, payment, or quote request — not a stack you will not use."],
            ["You own the shop", "Domain, hosting and storefront access in your company accounts."],
            ["Who updates products", "We agree who adds products and prices after launch."],
          ],
        }),
        section({
          kicker: "Shops you can open",
          title: "Ecommerce work already built in Egypt",
          intro: "We do not publish sales figures a client has not approved.",
          body: `          <div class="related-grid">
${workCards("en", [
  ["adam", "Adam Trending kids shop", "Arabic kids shop with cart and WhatsApp checkout."],
  ["nourvive", "Nourvive beauty storefront", "Product pages shoppers can find, a shop that opens fast, and a cart that moves."],
  ["medlab", "MedLab Market catalogue", "Medical catalogue with cart and quote request."],
  ["corolla", "Corolla food shop", "Retail plus wholesale enquiry."],
  ["uruz", "URUZ luxury beauty", "Editorial brand site with collections and commerce."],
])}
          </div>`,
        }),
        reviewsSection("en", ["rana", "maya", "nour"], {
          kicker: "Client reviews",
          title: "What shop clients say",
          note: "Average from 15 client reviews",
          readAll: "Read all reviews",
          leave: "Leave a review",
        }),
        section({
          kicker: "Related",
          title: "If a shop is not the whole job",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.devEn, "Web development in Egypt", "When you need the company site around the shop."],
  [PATHS.softwareEn, "Custom software development", "When inventory and invoices sit behind the storefront."],
  ["/blog/ecommerce-website-or-catalogue-egypt.html", "Shop or catalogue?", "The decision that changes cost and timeline."],
])}
          </div>`,
        }),
      ],
      faqKicker: "FAQ",
      faqTitle: "Before you brief an ecommerce build",
      faq: [
        ["How much does ecommerce website development cost in Egypt?", 'It follows products, order path, languages and who enters the catalogue. Read <a href="/blog/how-much-does-a-website-cost-in-egypt.html">what changes cost</a>.'],
        ["Can orders go to WhatsApp instead of payment?", 'Yes. <a href="/work/adam.html">Adam Trending</a> completes the cart on WhatsApp.'],
        ["Do you connect payment and shipping?", "When it is in the scope. We agree the provider before we build."],
        ["Who owns the shop?", "You do. First-year domain and hosting are included in the shop quote, in your company name."],
      ],
      final: {
        kicker: "Next step",
        title: "Tell us what you sell and how people order today",
        body: "We will say whether you need a shop or a catalogue, then prepare a first prototype.",
        cta: "Get a Free Website Prototype",
      },
    },
    {
      id: "software-en",
      file: "custom-software-development/index.html",
      path: PATHS.softwareEn,
      lang: "en",
      alternates: { en: PATHS.softwareEn, ar: PATHS.softwareAr },
      langSwitch: { en: PATHS.softwareEn, ar: PATHS.softwareAr },
      wizard: "system",
      title: "Custom Software Development in Cairo | Power Shift",
      description:
        "Custom software development in Cairo for operations, bookings, invoices and internal tools — when a website is not enough. Written first version, preview you can open. 15 five-star reviews.",
      crumb: "Custom software development",
      kicker: "Custom software development",
      h1: "Custom software development when a website cannot run the operation",
      lead: "Power Shift builds the public site and the system behind it. This page is for the system: bookings, invoices, inventory, roles and the screens staff use every day. We will say if you still only need a website.",
      cta: "Discuss your software",
      ctaShort: "Discuss software",
      waCta: "WhatsApp Us",
      proof: "5.0 from 15 client reviews — read them",
      service: {
        name: "Custom software development",
        description: "Custom operations software, SaaS products and internal tools built by Power Shift in Cairo.",
        type: "Custom software development",
        areaServed: ["Egypt", "Saudi Arabia", "United Arab Emirates"],
      },
      offer: {
        kicker: "First version",
        title: "Need software, not another brochure site?",
        body: "Describe the job staff do today in chats and spreadsheets. We will tell you whether a website, a shop, or a first software version is the right next step — before any build.",
        cta: "Discuss your software",
      },
      sections: [
        section({
          kicker: "Who this is for",
          title: "Teams whose work no longer fits WhatsApp and Excel",
          extraClass: "about-page",
          body: cards([
            ["Operations that need one system", "Invoices, stock, customers or bookings that currently live in notebooks and chats."],
            ["A product with logins and roles", "When more than one person must use the same workflows with permissions."],
            ["Property, booking, or finance tools", 'Shipped examples: <a href="/work/availio.html">Availio</a> and <a href="/work/haseb.html">7aseb</a>.'],
            ["If you actually need a website", `Start on <a href="${PATHS.devEn}">web development in Egypt</a> instead of this page.`],
          ]),
        }),
        includeSection({
          kicker: "What is included",
          title: "What a software first version covers",
          intro: "Software quotes are not website quotes. Domain-and-hosting-for-a-year applies to public websites and shops, not to every system stack.",
          items: [
            ["Written first version", "The workflows in, the workflows out, and who will use them."],
            ["A preview you can click", "You review screens before launch, not a slide deck."],
            ["You own the product", "Access and handover are part of the agreement."],
            ["Named contact after launch", "Fixes and the next version, not a handoff email."],
            ["An honest no", "We will say when a website or shop should come first."],
          ],
        }),
        section({
          kicker: "Software you can open",
          title: "Operations products from the same studio",
          body: `          <div class="related-grid">
${workCards("en", [
  ["haseb", "7aseb operations and finance", "Internal system for invoices, stock and day-to-day operations."],
  ["availio", "Availio property operations", "Property operations software with booking control."],
])}
          </div>
          <p class="services-also">Mobile apps are built when the product needs them — they are not a separate brochure offer. See all <a href="/services">services</a>.</p>`,
        }),
        reviewsSection("en", ["yassin", "karim", "mina"], {
          kicker: "Client reviews",
          title: "What clients say",
          note: "Average from 15 client reviews",
          readAll: "Read all reviews",
          leave: "Leave a review",
        }),
        section({
          kicker: "Related",
          title: "Website and shop if that is the real job",
          body: `          <div class="related-grid">
${readingCards([
  [PATHS.devEn, "Web development in Egypt", "Public websites and landing pages."],
  [PATHS.shopEn, "Ecommerce website development", "Shops and catalogues."],
  ["/blog/website-or-custom-software.html", "Website or custom software?", "When the public site is not enough."],
])}
          </div>`,
        }),
      ],
      faqKicker: "FAQ",
      faqTitle: "Before a custom software brief",
      faq: [
        ["Do you publish a software price list?", "No. Investment follows the first-version scope. We will not invent a number that does not describe your operation."],
        ["Can this start as a website?", "Often yes. We will say so. A system on top of an unclear business is more expensive than a clear site."],
        ["Do you build mobile apps?", "When the product needs an app, not as a standalone marketing service."],
        ["Who owns the software?", "You own what we agree in the scope. Access is handed over."],
      ],
      final: {
        kicker: "Next step",
        title: "Describe the job the software should do",
        body: "We reply with whether a site, a shop, or a first software version is the next step.",
        cta: "Discuss your software",
      },
    },
    {
      id: "software-ar",
      file: "ar/برمجة-أنظمة-مخصصة/index.html",
      path: PATHS.softwareAr,
      lang: "ar",
      alternates: { en: PATHS.softwareEn, ar: PATHS.softwareAr },
      langSwitch: { en: PATHS.softwareEn, ar: PATHS.softwareAr },
      wizard: "system",
      title: "برمجة أنظمة مخصصة في القاهرة | باور شيفت",
      description:
        "برمجة أنظمة مخصصة في القاهرة للتشغيل والحجوزات والفواتير والأدوات الداخلية — لما الموقع مش كفاية. نسخة أولى مكتوبة ومعاينة تقدر تفتحها. 15 تقييم 5 نجوم.",
      crumb: "برمجة أنظمة مخصصة",
      kicker: "برمجة أنظمة مخصصة",
      h1: "برمجة أنظمة مخصصة لما الموقع مش هيشغّل العملية",
      lead: "باور شيفت بتبني الموقع العام والنظام اللي وراه. الصفحة دي للنظام: حجوزات، فواتير، مخزون، صلاحيات، والشاشات اللي الفريق بيفتحها كل يوم. وهنقول لك لو لسه محتاج موقع بس.",
      cta: "ناقش النظام",
      ctaShort: "ناقش النظام",
      waCta: "راسلنا واتساب",
      proof: "5.0 من 15 مراجعة عملاء — اقرأها",
      service: {
        name: "برمجة أنظمة مخصصة",
        description: "برمجة أنظمة تشغيل ومنتجات SaaS وأدوات داخلية من باور شيفت في القاهرة.",
        type: "Custom software development",
        areaServed: ["Egypt", "Saudi Arabia", "United Arab Emirates"],
      },
      offer: {
        kicker: "النسخة الأولى",
        title: "محتاج برنامج، مش موقع تعريفي تاني؟",
        body: "وصف الشغل اللي الفريق بيعمله النهاردة في الشات والإكسل. هنقول لك الموقع يكفي ولا المتجر ولا نسخة أولى من نظام — قبل أي برمجة.",
        cta: "ناقش النظام",
      },
      sections: [
        section({
          kicker: "لمن هذه الخدمة؟",
          title: "فرق شغلها عدّى واتساب والإكسل",
          extraClass: "about-page",
          body: cards([
            ["تشغيل محتاج نظام واحد", "فواتير ومخزون وعملاء أو حجوزات عايشة في دفاتر ومحادثات."],
            ["منتج بصلاحيات ودخول", "لما أكتر من شخص لازم يشتغل على نفس المسارات."],
            ["عقارات أو حجوزات أو مالية", `أمثلة شغّالة: <a href="/work/availio.html">Availio</a> و<a href="/work/haseb.html">7aseb</a>.`],
            ["لو محتاج موقع فعلًا", `ابدأ من <a href="${PATHS.devAr}">شركة برمجة مواقع</a> مش من هنا.`],
          ]),
        }),
        includeSection({
          kicker: "ماذا يشمل العمل؟",
          title: "ما تغطيه النسخة الأولى من النظام",
          intro: "عرض النظام مش عرض الموقع. سنة الدومين والاستضافة تنطبق على المواقع والمتاجر العامة، مش على كل بنية نظام.",
          items: [
            ["نسخة أولى مكتوبة", "المسارات اللي داخلة واللي برّه، ومين هيستخدمها."],
            ["معاينة تقدر تفتحها", "بتراجع شاشات قبل الإطلاق، مش عرض شرائح."],
            ["المنتج ملكك", "الصلاحيات والتسليم جزء من الاتفاق."],
            ["مسؤول باسمه بعد الإطلاق", "إصلاحات والنسخة التالية، مش رسالة تسليم."],
            ["لأ بصراحة", "هنقول لك لو الموقع أو المتجر لازم ييجوا الأول."],
          ],
        }),
        section({
          kicker: "أنظمة تقدر تفتحها",
          title: "منتجات تشغيل من نفس الاستوديو",
          body: `          <div class="related-grid">
${workCards("ar", [
  ["haseb", "7aseb للتشغيل والمالية", "نظام داخلي للفواتير والمخزون والتشغيل اليومي."],
  ["availio", "Availio لتشغيل العقارات", "برنامج تشغيل عقارات وضبط حجوزات."],
])}
          </div>
          <p class="services-also">تطبيقات الموبايل بتتعمل لما المنتج يحتاجها — مش عرض تسويقي منفصل. كل الخدمات من <a href="/ar/services">صفحة الخدمات</a>.</p>`,
        }),
        reviewsSection("ar", ["yassin", "mahmoud", "hazem"], {
          kicker: "آراء العملاء",
          title: "ماذا يقول العملاء",
          note: "المتوسط من 15 مراجعة عملاء",
          readAll: "اقرأ كل المراجعات",
          leave: "اكتب تقييمك",
        }),
      ],
      faqKicker: "أسئلة شائعة",
      faqTitle: "قبل موجز نظام مخصص",
      faq: [
        ["في قائمة أسعار للأنظمة؟", "لا. الاستثمار يتبع نطاق النسخة الأولى. مش هنخترع رقم ما يوصفش تشغيلك."],
        ["ممكن نبدأ بموقع؟", "غالبًا أيوه. وهنقول كده. نظام فوق نشاط مش واضح أغلى من موقع واضح."],
        ["بتعملوا تطبيقات موبايل؟", "لما المنتج يحتاج تطبيق، مش كخدمة تسويق لوحدها."],
        ["مين يملك البرنامج؟", "تمتلك ما نتفق عليه في النطاق. الصلاحيات بتتسلم."],
      ],
      final: {
        kicker: "الخطوة التالية",
        title: "وصف الشغل اللي البرنامج المفروض يعمله",
        body: "نرد: موقع ولا متجر ولا نسخة أولى من نظام.",
        cta: "ناقش النظام",
      },
    },
  ];
}
