(function () {
  try {
    var PIXEL_ID = "1639209490886117";
    var PIXEL_SRC = "https://connect.facebook.net/en_US/fbevents.js";
    var path = location.pathname;
    var home =
      path === "/" ||
      path === "/index.html" ||
      path === "/ar" ||
      path === "/ar/" ||
      path === "/ar/index.html";
    var pathAr = /^\/ar(?:\/|$)/.test(path);
    var pathAboutEn = /^\/about(?:\/|$)/.test(path);
    var pathContactEn = /^\/contact(?:\/|$)/.test(path);
    var pathServicesEn = /^\/services(?:\/|$)/.test(path);
    var pathWorkEn = /^\/work(?:\/index\.html)?\/?$/.test(path);
    var pathBlogEn = /^\/blog(?:\/|$)/.test(path);
    var urlLocked = home || pathAr || pathAboutEn || pathContactEn || pathServicesEn || pathWorkEn || pathBlogEn;
    var bot = /Googlebot|Google-InspectionTool|bingbot|BingPreview|DuckDuckBot|Slurp|Yandex(Bot|RenderResourcesBot)|Baiduspider|facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Applebot|Bytespider|GPTBot|ClaudeBot|CCBot|GoogleOther/i.test(
      navigator.userAgent || ""
    );
    var stored = localStorage.getItem("ps-lang");
    var chosen = localStorage.getItem("ps-lang-chosen") === "1";
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
    var langAr = Array.prototype.some.call(langs, function (item) {
      return String(item || "").toLowerCase().indexOf("ar") === 0;
    });
    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (err) {}
    var zoneAr = /^(Africa\/(Cairo|Casablanca|Algiers|Tunis)|Asia\/(Riyadh|Dubai|Qatar|Kuwait|Bahrain|Muscat|Amman|Beirut|Baghdad))$/.test(tz);
    var prefersAr = langAr || zoneAr;
    if (!bot && home && !pathAr && ((chosen && stored === "ar") || (!chosen && prefersAr))) {
      location.replace("/ar");
      return;
    }
    if (!bot) {
      var fbq = window.fbq;
      if (!fbq) {
        fbq = function () {
          if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
          else fbq.queue.push(arguments);
        };
        window.fbq = fbq;
        if (!window._fbq) window._fbq = fbq;
        fbq.push = fbq;
        fbq.loaded = true;
        fbq.version = "2.0";
        fbq.queue = [];
      }
      if (!window._psPixelBooted) {
        window._psPixelBooted = true;
        fbq("init", PIXEL_ID);
      }
      if (!window._psPixelPageViewSent) {
        window._psPixelPageViewSent = true;
        var pageView = new Image(1, 1);
        pageView.alt = "";
        pageView.src =
          "https://www.facebook.com/tr?id=" +
          encodeURIComponent(PIXEL_ID) +
          "&ev=PageView&dl=" +
          encodeURIComponent(location.href) +
          "&rl=" +
          encodeURIComponent(document.referrer || "") +
          "&noscript=0";
      }
      if (!window._psLoadMetaPixel) {
        window._psLoadMetaPixel = function () {
          if (document.querySelector('script[src="' + PIXEL_SRC + '"]')) return;
          var pixel = document.createElement("script");
          pixel.async = true;
          pixel.src = PIXEL_SRC;
          pixel.setAttribute("data-meta-pixel", PIXEL_ID);
          document.head.appendChild(pixel);
        };
      }
      if (!window._psPixelLoadScheduled) {
        window._psPixelLoadScheduled = true;
        var pixelLoadRequested = false;
        var requestPixelLoad = function () {
          if (pixelLoadRequested) return;
          pixelLoadRequested = true;
          window._psLoadMetaPixel();
        };
        ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
          window.addEventListener(eventName, requestPixelLoad, { once: true, passive: true });
        });
      }
    }
    var lang = urlLocked
      ? pathAr
        ? "ar"
        : "en"
      : !bot && chosen && (stored === "ar" || stored === "en")
        ? stored
        : !bot && prefersAr
          ? "ar"
          : "en";
    if (lang === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      var link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = "/assets/fonts/ibm-plex-sans-arabic-500.woff2";
      document.head.appendChild(link);
    }
  } catch (e) {}
})();
