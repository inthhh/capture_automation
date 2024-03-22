//const { log } = require("winjs");

var page = (function () {
  return {
    init: function () {
      console.log("page");
      this.include();
      this.casePage();
    },
    include: function () {
      const includeArea = document.querySelectorAll("[data-include]");

      for (let dom of includeArea) {
        const url = dom.dataset.include;
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            dom.innerHTML = data;
            dom.removeAttribute("data-include");
          });
      }
    },
    layerPage: function (popUp) {
      const currentUrl = window.location.href;
      const param = currentUrl.split("?");

      if (param[1] === popUp) {
        return true;
      } else {
        return false;
      }
    },
    casePage: function () {
      const caseArea = document.querySelectorAll("[data-case]");
      const currentUrl = window.location.href;
      const param = currentUrl.split("?");
      if (param.length > 1) {
        for (let dom of caseArea) {
          const getCase = $(dom).data("case");

          if (getCase === param[1]) {
            $(dom).show();
          } else {
            $(dom).hide();
          }
        }
      } else {
        for (let dom of caseArea) {
          const getCase = $(dom).data("case");

          if (getCase === "default") {
            $(dom).show();
          } else {
            $(dom).hide();
          }
        }
      }
    },
  };
})();

$(document).ready(function () {
  page.init();

  setTimeout(() => UI.event(), 100);
});
