var UI = (function () {
  return {
    init: function () {
      this.event();
      this.eventOnce();
    },
    element: {
      header: ".header-wrap",
      nav: ".menu-list",
      //sitemap: ".sitemap-wrap",
      //search: ".search-wrap",
      //quick: ".quick-wrap",
    },
    event: function () {
      var lThiz = this.element;
      var isScrolling;
      var pos = $("html,body").scrollTop();
      var sideTabCont = [];

      //layout
      if (pos === 0) {
        if (!$(".sub-wrap").hasClass("no-visual")) {
          $(lThiz.header).addClass("top");
          $(lThiz.quick).addClass("up");
        }
      }

      window.addEventListener(
        "scroll",
        function (event) {
          var st = $(this).scrollTop();

          if (st < 100) {
            if (!$(".sub-wrap").hasClass("no-visual")) {
              $(lThiz.header).addClass("top");
            }
            $(lThiz.quick).addClass("up");
          } else if (st > pos) {
            $(lThiz.header).removeClass("top");
            //$(lThiz.quick).removeClass("up");
            //$(lThiz.header).find(".link-select").removeClass("active");
          } else {
            $(lThiz.header).removeClass("top");
            //$(lThiz.quick).removeClass("up");
          }

          pos = st;

          window.clearTimeout(isScrolling);
          //$(lThiz.header).find(".lang-box").removeClass("active");
          $(lThiz.header).find(".menu-list>ul>li").removeClass("active");
          isScrolling = setTimeout(function () {}, 500);
        },
        false
      );

      $(lThiz.header)
        .find(".menu-list>ul>li")
        .on("mouseover", function () {
          $(this).addClass("active");
        })
        .on("mouseleave", function () {
          $(this).removeClass("active");
        });

      $(lThiz.header)
        .find(".menu-list>ul>li")
        .on("mouseenter focusin", function () {
          $(this)
            .parent()
            .addClass("active")
            .siblings("li")
            .removeClass("active");
          $(lThiz.header).removeClass("top");
          $(lThiz.header).addClass("active");
        });

      $(lThiz.header).on("mouseleave", function () {
        $(lThiz.header).find(".menu-list>ul>li").removeClass("active");
        $(lThiz.header).removeClass("active");
        if (pos === 0 && !$(".sub-wrap").hasClass("no-visual")) {
          $(lThiz.header).addClass("top");
        }
      });

      $(lThiz.nav)
        .find(".btn-menu")
        .on("click", function () {
          $(this).parents(".nav-wrap").removeClass("active");
          $("html,body").css({ overflow: "visible" });
        });

      $(lThiz.quick)
        .find(".btn-top")
        .on("click", function () {
          $("html, body").animate({ scrollTop: "0" }, 300);
        });

      $(".btn-depth3").on("click", function () {
        if ($(this).hasClass("active")) {
          $(this).next(".list-depth3").slideUp();
          $(this).removeClass("active");
        } else {
          $(this)
            .next(".list-depth3")
            .slideDown()
            .parent("li")
            .siblings("li")
            .find(".list-depth3")
            .slideUp();
          $(this)
            .addClass("active")
            .parent("li")
            .siblings("li")
            .find(".btn-depth3")
            .removeClass("active");
        }
      });

      //mo quick
      $(lThiz.quick)
        .find(".btn-quick")
        .on("click", function (e) {
          e.preventDefault();
          TweenMax.set($(lThiz.quick).find("ul li"), {
            y: "50%",
            opacity: "0",
          });
          if ($(lThiz.quick).hasClass("active")) {
            $(lThiz.quick).find(".dim").hide();
            $(lThiz.quick).removeClass("active");
            $("html,body").css({ overflow: "visible" });
          } else {
            $(lThiz.quick).find(".dim").show();
            $(lThiz.quick).addClass("active");
            TweenMax.staggerTo(
              $(lThiz.quick).find("ul li"),
              0.2,
              {
                y: "0%",
                opacity: 1,
                ease: Power4.ease,
                delay: 0.1,
              },
              0.1
            );
            $("html,body").css({ overflow: "hidden" });
          }
        });

      //지도 초기 셋팅
      $(".business .map-box").animate({ scrollLeft: "300px" }, 300);

      //common
      if ($(".tab-type").length > 0) {
        $(".tab-type").animate(
          {
            scrollLeft:
              $(".tab-type").find("li.active").offset().left - 60 + "px",
          },
          300
        );
      }

      //radio,checkbox
      $("input[type='checkbox'],input[type='radio']").each(function () {
        if ($(this).attr("checked")) {
          $(this).parent().addClass("selected");
        } else {
          $(this).parent().removeClass("selected");
        }
      });

      // checkbox
      $("input[type='checkbox']").change(function () {
        if ($(this).is(":checked")) {
          $(this).parent().addClass("selected");
          $(this).attr("checked", true);
        } else {
          $(this).parent().removeClass("selected");
          $(this).attr("checked", false);
        }
      });

      // radio
      $("input[type='radio']").change(function () {
        $("input:radio[name=" + $(this).attr("name") + "]")
          .parent()
          .removeClass("selected");
        $(this).parent().addClass("selected");
      });

      //select
      $(".select-type select").niceSelect();

      $(document).on("click.nice_select", () => {
        if (!$(document.activeElement).hasClass("open")) {
          $(document.activeElement).addClass("save");
        }
      });

      function selectHide() {
        $(".link-select").removeClass("active");
      }
      var selectHideTimer = setTimeout(selectHide, 3000);

      $(".link-select .current").on("click", function (e) {
        e.preventDefault();
        clearTimeout(selectHideTimer);
        if ($(this).parent(".link-select").hasClass("active")) {
          $(this).parent(".link-select").removeClass("active");
        } else {
          $(".link-select").removeClass("active");
          $(this).parent(".link-select").addClass("active");
        }
      });

      $(".link-select").on("mouseleave", function (e) {
        selectHideTimer = setTimeout(selectHide, 2000);
      });

      $(".link-select li a").on("click", function (e) {
        selectHide();
        $(this).parents(".link-select").find(".current").text($(this).text());
      });

      //tab
      let activeClass = "active";
      $(".js_tab li a").on("click", function (e) {
        e.preventDefault();
        $(this)
          .parent("li")
          .addClass(activeClass)
          .siblings("li")
          .removeClass(activeClass);
        if ($(this).attr("href") !== "#") {
          $($(this).attr("href"))
            .addClass(activeClass)
            .siblings(".tab-cont")
            .removeClass(activeClass);
        }
      });

      //password
      $(".btn-eye").on("click", function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
          $(this).siblings("input").attr("type", "text");
        } else {
          $(this).siblings("input").attr("type", "password");
        }
      });

      //toggle
      $(".js_toggle").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $("#" + $(this).attr("data-target")).removeClass("active");
          $(
            ".js_toggle_cont[data-cont='" + $(this).attr("data-target") + "']"
          ).removeClass("active");
        } else {
          $(this).addClass("active");
          $("#" + $(this).attr("data-target")).addClass("active");
          $(
            ".js_toggle_cont[data-cont='" + $(this).attr("data-target") + "']"
          ).addClass("active");
        }
      });

      //searchForm
      var searchForm = $(".search-form");
      var searchInput = searchForm.find("input[type='text']");
      var searchClear = searchForm.find(".btn-clear");

      searchInput
        .on("input change", function () {
          var $this = $(this);
          var visible = Boolean($this.val());
          $(this)
            .parents(".search-form")
            .find(".btn-clear")
            .toggleClass("hidden", !visible);

          if (searchForm.closest(".search-box").hasClass("auto-list")) {
            let value = $(this).val();
            console.log(value);

            if (value === null || value === "") {
              $(this).closest(".auto-list").removeClass("active");
            } else {
              $(this).closest(".auto-list").addClass("active");
            }
          }
        })
        .trigger("propertychange");

      searchClear.on("click", function () {
        $(this)
          .siblings("input[type='text']")
          .val("")
          .trigger("change")
          .focus();
        $(this).toggleClass("hidden", true);
      });

      searchForm.each(function () {
        var $this = $(this).find("input[type='text']");

        if (!Boolean($this.val())) {
          $this.parent().find(".btn-clear").addClass("hidden");
        }
      });

      $(".search-list li a").on("click", function (e) {
        e.preventDefault();
        let box = $(this).closest(".auto-list");
        let title;
        if ($(this).find("em").length > 0) {
          title = $(this).find("em").html();
        } else {
          title = "";
        }
        let input = box.find(".input-type");

        if (!box.hasClass("type2")) {
          title += " ";
          title += $(this).find("p").html();
        }

        console.log(title);
        input.val(title);
        box.removeClass("active");

        if (box.hasClass("select-status")) {
          console.log($(this).find("p"));
          if ($(this).find("p").hasClass("badge-status-gray")) {
            input.removeClass("badge-status-blue");
            input.removeClass("badge-status-red");
            input.addClass("badge-status-gray");
          }

          if ($(this).find("p").hasClass("badge-status-blue")) {
            input.removeClass("badge-status-gray");
            input.removeClass("badge-status-red");
            input.addClass("badge-status-blue");
          }

          if ($(this).find("p").hasClass("badge-status-red")) {
            input.removeClass("badge-status-gray");
            input.removeClass("badge-status-blue");
            input.addClass("badge-status-red");
          }
        }
      });

      $(".input-default").on("click", function (e) {
        e.preventDefault();
        $(this).closest(".input-layer").addClass("active");
      });

      $(".input-layer .btn-sl").on("click", function (e) {
        e.preventDefault();
        $(this).closest(".input-layer").removeClass("active");
      });

      //fileForm
      $(".file-type input").on("change", function (e) {
        if ($(this).val()) {
          var file = e.target.files[0];
          var reader = new FileReader();
          var preview = $(this).siblings(".img-box").find("img");
          reader.onload = function (e) {
            preview.attr("src", e.target.result);
          };
          reader.readAsDataURL(file);
          $(this).siblings(".btn-clear").show();
          $(this).siblings(".img-box").show();
          $(this).parents(".file-type").addClass("add");
        }
      });

      $(".file-type .btn-clear").on("click", function () {
        $(this).hide();
        $(this).siblings("input").val("");
        $(this).siblings(".img-box").hide().find("img").attr("src", "");
        $(this).parents(".file-type").removeClass("add");
      });

      //textarea
      $("textarea").on("change keyup paste", function () {
        if ($(this).val()) {
          $(this).parents(".textarea-type").find(".placeholder-box").hide();
        } else {
          $(this).parents(".textarea-type").find(".placeholder-box").show();
        }
      });

      $(".key-wrap input[type='checkbox']").change(function () {
        if ($(this).is(":checked")) {
          $(this).parents(".key-list").addClass("active");
        } else {
          $(this).parents(".key-list").removeClass("active");
        }
      });

      $(".sub-nav .btn-share").on("click", function () {
        var snsBox = $(this).parents(".sns-box");
        if (snsBox.hasClass("active")) {
          snsBox.removeClass("active");
        } else {
          snsBox.addClass("active");
        }
      });

      //responsive
      var timer = null;
      $(window)
        .resize(function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            console.log("resize");

            $(".board-wrap.tab .board-body").each(function (index) {
              sideTabCont.push({
                id: $(this).attr("id"),
                pos: parseInt($(this).offset().top) - 200,
                text: $(this).find(".title-type").text(),
              });
            });

            $(".textarea-type textarea").css(
              "height",
              $(".textarea-type").find(".placeholder-box").innerHeight() + 100
            );

            $(window).scroll(function () {
              var st = $(this).scrollTop();
              for (var i = 0; i < sideTabCont.length; i++) {
                if (st > sideTabCont[i].pos) {
                  var select = $(
                    ".board-wrap.tab .side-tab li a[href='" +
                      "#" +
                      sideTabCont[i].id +
                      "']"
                  );
                  var select2 = $(
                    ".board-wrap.tab .link-select li a[href='" +
                      "#" +
                      sideTabCont[i].id +
                      "']"
                  );

                  select
                    .parents("li")
                    .addClass("active")
                    .siblings("li")
                    .removeClass("active")
                    .find("li")
                    .removeClass("active");
                  select2
                    .parents("li")
                    .addClass("active")
                    .siblings("li")
                    .removeClass("active")
                    .find("li")
                    .removeClass("active");

                  if (
                    sideTabCont[i].text.length !== 0 &&
                    $(select2.attr("href")).length !== 0
                  ) {
                    $(".board-wrap.tab .link-select")
                      .find(".current")
                      .text(
                        $(select2.attr("href"))
                          .find(".title-wrap2:first-child")
                          .text()
                      );
                  }
                }
              }
            });

            if (window.innerWidth >= 1025) {
              //pc
              console.log("pc");
              $(lThiz.quick).removeClass("active");

              TweenMax.set($(lThiz.quick).find("ul li"), {
                y: "0%",
                opacity: "1",
              });

              $(lThiz.quick)
                .find("ul")
                .hover(
                  function () {
                    $(this).parents(".quick-wrap").addClass("active");
                  },
                  function () {
                    $(this).parents(".quick-wrap").removeClass("active");
                  }
                );

              $(".board-wrap.tab .side-tab li a")
                .off("click")
                .on("click", function (e) {
                  e.preventDefault();
                  $(this)
                    .parents("li")
                    .addClass("active")
                    .siblings("li")
                    .removeClass("active")
                    .find("li")
                    .removeClass("active");
                  if ($(this).attr("href") !== "#") {
                    $("html, body").animate(
                      {
                        scrollTop:
                          $($(this).attr("href")).offset().top - 130 + "px",
                      },
                      300
                    );
                  }
                });

              $(".sns-box .btn-close")
                .off("click")
                .on("click", function () {
                  $(".sns-box").removeClass("active");
                });
            } else {
              //mo
              console.log("moblie");

              $(lThiz.nav).find(".list-depth1>li").eq(0).addClass("active");

              $(lThiz.nav)
                .find(".list-depth1>li>a")
                .off("click")
                .on("click", function (e) {
                  e.preventDefault();
                  $(this)
                    .parents("li")
                    .addClass("active")
                    .siblings("li")
                    .removeClass("active");
                });

              $(lThiz.sitemap)
                .find(".list-depth1>li>a")
                .off("click")
                .on("click", function (e) {
                  e.preventDefault();
                  if ($(this).parent("li").hasClass("active")) {
                    $(this).next(".list-depth2").hide();
                    $(this).parent("li").removeClass("active");
                  } else {
                    $(this)
                      .next(".list-depth2")
                      .show()
                      .parent("li")
                      .siblings("li")
                      .find(".list-depth2")
                      .hide();
                    $(this)
                      .parent("li")
                      .addClass("active")
                      .siblings("li")
                      .removeClass("active");
                  }
                });

              $(lThiz.quick)
                .find(".dim")
                .off("touchstart click")
                .on("touchstart click", function (e) {
                  e.preventDefault();
                  $(lThiz.quick).find(".dim").hide();
                  $(lThiz.quick).removeClass("active");
                  $("html,body").css({ overflow: "visible" });
                });

              $(".board-wrap.tab .link-select li a")
                .off("click")
                .on("click", function (e) {
                  e.preventDefault();
                  $(this)
                    .parents("li")
                    .addClass("active")
                    .siblings("li")
                    .removeClass("active");
                  if ($(this).attr("href") !== "#") {
                    $("html, body").animate(
                      {
                        scrollTop:
                          $($(this).attr("href")).offset().top - 155 + "px",
                      },
                      300
                    );
                    $(this).parents(".link-select").removeClass("active");
                  }
                });

              $(".scroll-wrap").scroll(function () {
                var scrollValue = $(this).scrollLeft();
                if (scrollValue > 0) {
                  $(this).addClass("shadow-none");
                } else {
                  $(this).removeClass("shadow-none");
                }
              });
            }
          }, 300);
        })
        .resize();
    },
    layerPopUp: function (pOption) {
      /*   pOption
       *  {
       *  	 state : 'open'  OR  'close'
       *  	 selId : Layer Selector
       *  }
       */
      var lLayer = $(pOption.selId);
      var dim = $(pOption.selId).find(".dim");

      if (pOption.st !== "close") {
        lLayer.css("display", "flex");
        dim.show();
        $("html,body").css({ overflow: "hidden" });
      } else {
        lLayer.css("display", "none");
        dim.hide();
        $("html,body").css({ overflow: "visible" });
      }

      lLayer.find(".pop-close, .pop-btn-close").on("click", function (e) {
        e.preventDefault();
        lLayer.css("display", "none");
        dim.hide();
        $("html,body").css({ overflow: "visible" });
      });
    },
    eventOnce: function() {
      $('[data-role="form-active-btn"]').on("click", function (e) {
        e.preventDefault();

        if (
          !$(this).parents('[data-role="form-active-box"]').hasClass("active")
        ) {
          $(this).parents('[data-role="form-active-box"]').addClass("active");
          $(this).parents('[data-role="form-active-box"]').removeClass("save");
        }
      });

      $("[data-role='form-save-btn']").on("click", function (e) {
        e.preventDefault();

        if (
          !$(this).parents('[data-role="form-active-box"]').hasClass("save")
        ) {
          $(this).parents('[data-role="form-active-box"]').addClass("save");
          $(this)
            .parents('[data-role="form-active-box"]')
            .removeClass("active");
        }
      });

      $(".more-btn").on("click", function (e) {
        // e.preventDefault();
        var $target = $(this)
          .parents(".content-inner")
          .find(".inner-group")
          .eq(1);
        if (!$target.hasClass("hide")) {
          $target.addClass("hide");
        } else {
          $target.removeClass("hide");
        }
      });

      if ($(".datepickerRange-input").length > 0) {
        //datepickerRange Single
        $(".datepickerRange-input").daterangepicker(
          {
            linkedCalendars: false,
            autoApply: true,
            autoUpdateInput: false,
            showOtherMonths: false,
            alwaysShowCalendars: false,
            singleDatePicker: true,
            locale: {
              format: "YYYY.MM.DD",
              weekLabel: "W",
              daysOfWeek: ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"],
              monthNames: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
            startDate: new Date(),
            endDate: new Date(),
            drops: "auto",
          },
          function (start, end, label) {
            const $target = $(this.element)
              .closest(".datepickerRange-wrap")
              .find(".datepickerRange-box");
            $target.addClass("active");
            $target.find(".date span").text(start.format("YYYY.MM.DD"));
          }
        );
      }

      if ($("#datepickerRangeMulti").length > 0) {
        //datepickerRange Multi
        $("#datepickerRangeMulti").daterangepicker(
          {
            linkedCalendars: false,
            autoApply: true,
            autoUpdateInput: false,
            showOtherMonths: false,
            alwaysShowCalendars: false,
            locale: {
              format: "MM/DD",
              weekLabel: "W",
              daysOfWeek: ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"],
              monthNames: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
            startDate: new Date(),
            endDate: new Date(),
            drops: "auto",
          },
          function (start, end, label) {
            const $target = $(this.element)
              .closest(".datepickerRange-wrap")
              .find(".datepickerRange-box");
            $target.addClass("active");
            $target
              .find(".date.start span")
              .text("SUN " + start.format("MM/DD"));
            $target.find(".date.end span").text("THU " + end.format("MM/DD"));

            if ($target.hasClass("active")) {
              $target.find(".ico-calendar").removeClass("gray");
            }
          }
        );
      }

      $(".btn-slide").on("click", function () {
        var contWrap = $(this).parents(".content-wrap");
        if (contWrap.hasClass("active")) {
          contWrap.removeClass("active");
        } else {
          contWrap.addClass("active");
        }
      });
    },
  };
})();

$(document).ready(function () {
  UI.init();
});
