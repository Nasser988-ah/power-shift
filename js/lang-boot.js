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
    var pathBlogEn = /^\/blog(?:\/|$)/.test(path);
    var urlLocked = home || pathAr || pathBlogEn;
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
      if (!document.querySelector('script[src="' + PIXEL_SRC + '"]')) {
        var pixel = document.createElement("script");
        pixel.async = true;
        pixel.src = PIXEL_SRC;
        pixel.setAttribute("data-meta-pixel", PIXEL_ID);
        document.head.appendChild(pixel);
      }
      if (!window._psPixelBooted) {
        window._psPixelBooted = true;
        fbq("init", PIXEL_ID);
        fbq("track", "PageView");
      }
    }
    if (!bot && home && !pathAr && ((chosen && stored === "ar") || (!chosen && prefersAr))) {
      location.replace("/ar");
      return;
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
