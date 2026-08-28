(function () {
  try {
    var path = location.pathname;
    var home =
      path === "/" ||
      path === "/index.html" ||
      path === "/ar" ||
      path === "/ar/" ||
      path === "/ar/index.html";
    var lang = home
      ? (/^\/ar(?:\/|$)/.test(path) ? "ar" : "en")
      : localStorage.getItem("ps-lang") === "ar"
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
