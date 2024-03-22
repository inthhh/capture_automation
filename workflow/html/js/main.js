$(document).ready(function () {
	//product
	//var prdPos = [];

	//영상작동:영상로드시 바로 작동
	window.addEventListener('loadedmetadata', function (e) {
		if ($(e.target).parents('.swiper-slide')) {
			visualSwiper.autoplay.stop();
			$(e.target).parents('.swiper-slide').attr('data-swiper-autoplay', parseInt(e.srcElement.duration * 1000));

			visualSwiper.autoplay.start();
			$('.main-swiper-button .swiper-pagination-bullet-active .progress-bar .progress-inner').css({ 'animation-duration': +visualSwiper.slides.eq(visualSwiper.realIndex).attr('data-swiper-autoplay') / 1000 + 's' }).addClass('active');
		}
	}, true);

	var visualSwiper = new Swiper(".visual-swiper", {
		slidesPerView: 1,
		spaceBetween: 0,
		effect: 'fade',
		autoplay: {
			delay: 7000,//animation과 시간 맞춰줘야함
		},
		autoplay: {
			disableOnInteraction: false
		},
		pagination: {
			el: ".main-swiper-button .swiper-pagination",
			clickable: true,
			renderBullet: function (index, className) {
				return '<span class="' + className + '">' + '0' + (index + 1) + "<span class='progress-bar'><span class='progress-inner'></span></span></span>";
			},
		},
		on: {
			init: function () {
				$('.swiper-slide').eq(0).find('video')[0].play();

			},
			slideChange: function () {
				var swiper = this;
				var activeIndex = swiper.activeIndex;
				var activeSlide = $('.swiper-slide').eq(activeIndex);
				var activeSlideVideo = activeSlide.find('video')[0];
				var progress = $('.main-swiper-button .swiper-pagination-bullet-active .progress-bar .progress-inner');

				if (activeSlideVideo) {
					$('.swiper-slide').eq(activeIndex).find('video')[0].load();
					$('.swiper-slide').find('video')[0].pause();
					$('.swiper-slide').eq(activeIndex).find('video')[0].play();
					autoplay = activeSlideVideo.duration;
					progress.css({ 'animation-duration': autoplay + 's' });
				} else {
					visualSwiper.params.autoplay.delay = 7000;
				}

				$('.main-swiper-button .swiper-player-button').removeClass('active');
				progress.css({ 'animation-play-state': 'running' });
			},
		}
	});

	$('.main-swiper-button .swiper-player-button').on('click', function () {
		var activeSlideVideo = $('.swiper-slide').eq(visualSwiper.activeIndex).find('video')[0];
		var progress = $('.main-swiper-button .swiper-pagination-bullet-active .progress-bar .progress-inner');

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			progress.css({ 'animation-play-state': 'running' });
			if (activeSlideVideo) {
				activeSlideVideo.play();
				visualSwiper.autoplay.start();
				/* activeSlideVideo.addEventListener('ended', function (e) {
					visualSwiper.slideNext();
				}); */
				activeSlideVideo.onended = function (e) {
					visualSwiper.slideNext();
				};
			} else {
				progress.on("animationend", function () {
					visualSwiper.slideNext();
					if (visualSwiper.activeIndex === visualSwiper.slides.length - 1) {
						visualSwiper.slideTo(0);
					}
				});
			}
		} else {
			$(this).addClass('active');
			progress.css({ 'animation-play-state': 'paused' });
			visualSwiper.autoplay.stop();
			if (activeSlideVideo) {
				activeSlideVideo.pause();
			}
		}
		/* if (activeSlideVideo) {
			activeSlideVideo.onended = function (e) {
				visualSwiper.slideNext();
			};
		} else {
			progress.on("animationend", function (e) {
				visualSwiper.slideNext();
				if (visualSwiper.activeIndex === visualSwiper.slides.length - 1) {
					visualSwiper.slideTo(0);
				}
			});
		}

		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			visualSwiper.autoplay.start();
			activeSlideVideo.play();
			progress.css({ 'animation-play-state': 'running' });

		} else {
			$(this).addClass('active');
			visualSwiper.autoplay.stop();
			activeSlideVideo.pause();
			progress.css({ 'animation-play-state': 'paused' });
		} */
	})

	new Swiper(".story-swiper", {
		slidesPerView: 3,
		spaceBetween: 40,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		breakpoints: {
			1024: {
				slidesPerView: 1,
				spaceBetween: 15,
				pagination: {
					el: ".swiper-button-box .fraction-pagination",
					type: "fraction",
				},
				navigation: {
					nextEl: ".swiper-button-box .button-next",
					prevEl: ".swiper-button-box .button-prev",
				},
			},
		},
	});

	$('.global-wrap .map-box').scroll(function (e) {
		if ($(this).scrollLeft() >= 100) {
			$('.global-wrap .main-title .title-motion').fadeOut();
		} else {
			$('.global-wrap .main-title .title-motion').fadeIn();
		}
	});
	$(document).scroll(function () {
		if ($('.global-wrap .main-title').hasClass('started')) {
			$('.global-wrap').addClass('active started');
		} else if (!$('.global-wrap .main-title').hasClass('started')) {
			$('.global-wrap').removeClass('active started');
		}

		if ($('.esg-wrap .main-title').hasClass('started')) {
			$('.global-wrap').removeClass('active');
		}
		if ($('.vision-wrap .bg-box').hasClass('ended')) {
			$('.vision-wrap .bg-box').addClass('active')
		}
		if (!$('.vision-wrap').hasClass('started')) {
			$('.vision-wrap .bg-box').removeClass('active')
		}
	});

	//responsive
	var timer = null;
	$(window).resize(function () {
		clearTimeout(timer);
		timer = setTimeout(function () {


			if (window.innerWidth >= 1025) {
				//pc
				$(document).scroll(function () {
					var st = $(window).scrollTop();

					var doorWrap = $('.door-inner'),
						leftDoor = doorWrap.find('.door.is-left'),
						rightDoor = doorWrap.find('.door.is-right'),
						targetPos = doorWrap.offset().top - st,
						evtStartPoint = (st + targetPos) - window.innerHeight,
						evtEndPoint = (st + targetPos) + doorWrap.height(),
						stRatio = (st - evtStartPoint) / (evtEndPoint - evtStartPoint);

					if (stRatio < 0) {
						stRatio = 0;
						doorWrap.attr('class', 'door-inner ready');
					} else if (stRatio > .35) {
						stRatio = 1;
						doorWrap.attr('class', 'door-inner complete');
						leftDoor.removeAttr('style');
						rightDoor.removeAttr('style');

					} else {
						doorWrap.attr('class', 'door-inner ing');
						leftDoor.css({
							'transform': 'translate3d(' + -(100 * (stRatio * 2.5)) + '%, 0, 0)'
						});
						rightDoor.css({
							'transform': 'translate3d(' + 100 * (stRatio * 2.5) + '%, 0, 0)'
						});
					}

					//productActive($('.product-wrap .list-product li.started').last().index());

					/* if ($('.vision-wrap .bg-box').hasClass('started')) {
						$('.product-wrap .list-product li').each(function (index, item) {
							prdPos[index] = parseInt($(this).offset().top - 800);
						})
					} */


				});

				/* $('.product-wrap .list-tab li a').on('click', function (e) {
					e.preventDefault();
					var idx = $(this).parent('li').index() - 1;
					if (idx < 0) {
						$("html, body").animate({ scrollTop: $('.product-wrap').offset().top + 300 }, 500);
					} else {
						$("html, body").animate({ scrollTop: $('.product-wrap .list-product li').eq(idx).offset().top + 250 }, 500);
					}
	
					$('.product-wrap .list-product li').eq($(this).parent('li').index()).next('li').removeClass('started');
				}) */
			} else {
				//mo
				$('.product-wrap .list-tab li a').off('click').on('click', function (e) {
					e.preventDefault();
					$(this).parent('li').addClass('active').siblings('li').removeClass('active');
					$('.list-product li').eq($(this).parents('li').index()).addClass('active').siblings('li').removeClass('active');
				})
			}
		});
	}).resize();


	//jquery
	window.onload = function () {
		$(function () {
			var map = $('object.map-img')[0].contentDocument;

			TweenMax.to($(map).find('.map').find('circle.st5,circle.st8').parent('g'), 1, {
				opacity: 1,
				ease: Power4.easeOut,
			});
			$('.global-wrap .area-box').hover(function (e) {
				e.preventDefault();
				
				TweenMax.to($('.global-wrap .area-box'), 1, {
					opacity: 0.5,
					ease: Power4.easeOut,
				});
				TweenMax.to($(this), 1, {
					opacity: 1,
					ease: Power4.easeOut,
				});
				TweenMax.to($(map).find('circle.st5,circle.st8').parent('g'), 1, {
					opacity: 0.5,
					ease: Power4.easeOut,
				});
				TweenMax.to($(map).find('.' + e.target.classList[1] + '').find('circle.st5,circle.st8').parent('g'), 1, {
					opacity: 1,
					ease: Power4.easeOut,
				});
			}, function () {
				TweenMax.to($('.global-wrap .area-box'), 1, {
					opacity: 1,
					ease: Power4.easeOut,
				});
				TweenMax.to($(map).find('circle.st5,circle.st8').parent('g'), 1, {
					opacity: 1,
					ease: Power4.easeOut,
				});
			});
		});
	}
});