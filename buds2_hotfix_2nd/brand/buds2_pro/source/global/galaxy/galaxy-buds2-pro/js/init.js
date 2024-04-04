var ___GALAXY_START_TIME = new Date().getTime(),
  ___IS_GALAXY =
    -1 < location.href.indexOf("/global/galaxy/") || !0 === window.IS_CAMPAIGN;
!(function () {
  ___IS_GALAXY ||
    ((t = (e = document.querySelector('meta[name="viewport"]')).getAttribute(
      "content"
    )),
    window.outerWidth < 768 &&
      534 < window.outerWidth &&
      "width=768,maximum-scale=1.0" !== t &&
      e.setAttribute("content", "width=768,maximum-scale=1.0"));
  var e,
    t = window.innerWidth;
  for (
    sizeMode = 1440 < t ? 4 : 1023 < t ? 3 : 767 < t ? 2 : 1,
      html5tags = [
        "article",
        "aside",
        "details",
        "figcaption",
        "figure",
        "footer",
        "header",
        "hgroup",
        "nav",
        "section",
        "summary",
      ],
      i = 0,
      max = html5tags.length,
      i = 0;
    i < max;
    i++
  )
    document.createElement(html5tags[i]);
  document.documentElement.className +=
    " s" +
    sizeMode +
    " s" +
    (sizeMode < 3 ? 12 : 34) +
    (t < 360 ? " s0" : "") +
    (___IS_GALAXY ? "" : " dotcom");
})();
