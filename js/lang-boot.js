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
    }
  } catch (e) {}
})();
