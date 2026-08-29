(function () {
  try {
    var path = location.pathname;
    var home =
      path === "/" ||
      path === "/index.html" ||
      path === "/ar" ||
      path === "/ar/" ||
      path === "/ar/index.html";
    var pathAr = /^\/ar(?:\/|$)/.test(path);
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
    if (home && !pathAr && ((chosen && stored === "ar") || (!chosen && prefersAr))) {
      location.replace("/ar");
      return;
    }
    var lang = home
      ? pathAr
        ? "ar"
        : "en"
      : chosen && (stored === "ar" || stored === "en")
        ? stored
        : prefersAr
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
