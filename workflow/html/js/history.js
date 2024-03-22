/*$('.history-visual').on('mousewheel', function(e){
	if(e.originalEvent.wheelDelta < 0) {
		//scroll down
		$('html, body').stop().animate({
			scrollTop : '+=150px'
		},500);
	}else {
		//scroll up
		$('html, body').stop().animate({
			scrollTop : '-=150px'
		},500);
	}
	return false;
});*/


$(document).ready(function () {

    function deviceChk(){
        var $html = $('html'); 
        var w = $(window).width();
        if( w < 768 ) $html.addClass('mobile');
        else if( w < 1024 ) $html.addClass('tablet');
        else $html.addClass('desktop');
    }deviceChk()


    // init animate
    $('html, body').css({'overflow':'hidden','height':'100%'});

    // init animate, scrolltrigger refresh, scroll start
    $(function(){
        gsap.set(".history-visual .open-txt", { autoAlpha: 0, scale:1.4});
        gsap.to(".history-visual .open-txt", { autoAlpha: 1, scale:1, delay:0.5, duration:3});

        setTimeout(function() {
            $(".history-visual").addClass("init-animation");
        }, 1000);
        setTimeout(function() {
            //$(".sub").addClass("open");
        }, 3500);
        setTimeout(function() {
            ScrollTrigger.refresh();
            $('html, body').css({'overflow':'visible','height':'auto'});
        }, 2000); // scroll gap 주의

        /*
        setTimeout(function() { // 3초간 행동 없으면 자동 스크롤
            var scrollTopValue = $(window).scrollTop();
            var timer = setTimeout(function() {
                $('html, body').css({'overflow':'hidden','height':'100%'});
                $('html, body').animate({
                    scrollTop: window.innerHeight * 2.5
                }, 2000);
                $('html, body').animate({
                    scrollTop: window.innerHeight * 3.5
                }, 500);
                $('html, body').css({'overflow':'visible','height':'auto'});
            },0);
        
            if(scrollTopValue > 0) {
                clearTimeout(timer);
            }
        
            $(window).on('scroll',function(){
                var scrollValue = $(document).scrollTop();
                //console.log(scrollValue);
                if(scrollValue > 0) {
                    clearTimeout(timer);
                }
            }); 
        }, 5000);*/
    });

    // visual



    var visionBgScale = gsap.timeline()
    .set(".history-visual .cross-title", { autoAlpha: 0, yPercent:0, delay:10, duration:100})
    .set(".history-visual .cross-title .left", { autoAlpha: 0, xPercent:-100, delay:10, duration:100})
    .set(".history-visual .cross-title .right", { autoAlpha: 0, xPercent:100, delay:10, duration:100})


    
    .to(".history-visual .his-intro-txt", { autoAlpha: 1, yPercent:0, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 1, yPercent:0, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 1, yPercent:0, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 0.8, yPercent:-10, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 0.7, yPercent:-20, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 0.6, yPercent:-40, duration:100})
    .to(".history-visual .his-intro-txt", { autoAlpha: 0, yPercent:-50, duration:100})


    .set(".history-visual .text-box1 p", { autoAlpha:0, yPercent:80, delay:10, duration:100})
    .to(".history-visual .text-box1 p", { autoAlpha: 0.7, yPercent:50, delay:10, duration:200})
    .to(".history-visual .text-box1 p", { autoAlpha: 0.8, yPercent:10, delay:10, duration:200})
    .to(".history-visual .text-box1 p", { autoAlpha: 1, yPercent:0, delay:10, duration:200})
    .to(".history-visual .text-box1 p", { autoAlpha: 0.8, yPercent:-10, delay:10, duration:100})
    .to(".history-visual .text-box1 p", { autoAlpha: 0.7, yPercent:-20, delay:10, duration:100})
    .to(".history-visual .text-box1 p", { autoAlpha: 0.5, yPercent:-40, delay:10, duration:100})
    .to(".history-visual .text-box1 p", { autoAlpha: 0, yPercent:-50, delay:10, duration:100})


    .set(".history-visual .text-box2 p", { autoAlpha:0, yPercent:120, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 0.6, yPercent:80, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 0.7, yPercent:50, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 0.8, yPercent:20, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 1, yPercent:0, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 1, yPercent:0, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 1, yPercent:0, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 1, yPercent:0, delay:10, duration:100})
    .to(".history-visual .text-box2 p", { autoAlpha: 1, yPercent:0, delay:10, duration:100})

    
    .to(".history-visual .text-box2 p", { autoAlpha: 0.8, yPercent:-10, delay:10, duration:10})
    .to(".history-visual .text-box2 p", { autoAlpha: 0.5, yPercent:-20, delay:10, duration:10})
    .to(".history-visual .text-box2 p", { autoAlpha: 0.2, yPercent:-40, delay:10, duration:10})
    .to(".history-visual .text-box2 p", { autoAlpha: 0, yPercent:-50, delay:10, duration:10},
    ".history-visual .cross-title .left", { autoAlpha: 0.5, xPercent:-80, delay:10, duration:10},
    ".history-visual .cross-title .right", { autoAlpha: 0.5, xPercent:80, delay:10, duration:10})

    .to(".history-visual .cross-title", { autoAlpha: 1, yPercent:0, delay:10, duration:10})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:10})
    
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})
    .to(".history-visual .cross-title span", { autoAlpha: 1, xPercent:0, delay:10, duration:100})

    
  

    ScrollTrigger.create({
        trigger: ".history-visual",
        start: "top top",
        end: function(){
            return (($(window).innerHeight() * 3.5));
        },
        animation:visionBgScale,
        pin:true,
        scrub: true,
        onComplete: function() {
            console.log('onComplete');
            $('.history-visual .cross-title').addClass("started");
        },
        onLeave: function(){
            console.log('onLeave');
            $('body').removeClass('on-visual');
        },
        onEnterBack: function(){
            $('body').addClass('on-visual');
        },
        onEnter: function(){
            $('body').addClass('on-visual');
        }
    });

    // list bg width 조절
    var hisTitBg = gsap.utils.toArray('.history-list .list .bg .img');
    hisTitBg.forEach(function (item, i, items) {
        var hisTitBgTl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 50%',
                end: 'top top',
                scrub: true,
                toggleClass: 'active',
                //markers:true
            }
        });
        hisTitBgTl.fromTo(item, {width:'70%'},{ maxWidth:'none', width:'100%'});
    });

    var naviPos = $(".history-navi").offset().top;
    $(window).on('scroll',function(){
        var _navHeight = $(".history-navi").outerHeight();
        var nScrollTop = $(this).scrollTop();
        if( (nScrollTop >= $(".history-list").offset().top - _navHeight) && (nScrollTop <= $(".list2").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("active");
        }else if( (nScrollTop >= $(".list2").offset().top) && (nScrollTop <= $(".list3").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("end");
            $(".history-navi li").eq(1).addClass("active");
        }else if( (nScrollTop >= $(".list3").offset().top) && (nScrollTop <= $(".list4").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("end");
            $(".history-navi li").eq(1).addClass("end");
            $(".history-navi li").eq(2).addClass("active");
        }else if( (nScrollTop >= $(".list4").offset().top) && (nScrollTop <= $(".list5").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("end");
            $(".history-navi li").eq(1).addClass("end");
            $(".history-navi li").eq(2).addClass("end");
            $(".history-navi li").eq(3).addClass("active");
        }else if( (nScrollTop >= $(".list5").offset().top) && (nScrollTop <= $(".list6").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("end");
            $(".history-navi li").eq(1).addClass("end");
            $(".history-navi li").eq(2).addClass("end");
            $(".history-navi li").eq(3).addClass("end");
            $(".history-navi li").eq(4).addClass("active");
        }else if( (nScrollTop >= $(".list6").offset().top) && (nScrollTop <= $(".sitemap-wrap").offset().top - _navHeight)){
            $(".history-navi li").removeClass("active");
            $(".history-navi li").removeClass("end");
            $(".history-navi li").eq(0).addClass("end");
            $(".history-navi li").eq(1).addClass("end");
            $(".history-navi li").eq(2).addClass("end");
            $(".history-navi li").eq(3).addClass("end");
            $(".history-navi li").eq(4).addClass("end");
            $(".history-navi li").eq(5).addClass("active");
        }

        if(nScrollTop >= $(".history-list").offset().top - _navHeight){
            $(".history-navi").addClass('top');
        }else{
            $(".history-navi").removeClass('top');
        }
    });   
    
    
    $(document).on("click", '[data-role="btnAnchor"]', function(scroll) {
        scroll.preventDefault();
        var wW = $(this),
            target = wW.data("target"),
            speed = wW.data("speed") || 500,
            scroll = wW.data("scroll"),
            wW = $(window).outerWidth(),
            scroll = scroll ? wW < 769 ? Math.min(scroll, scroll / 720 * wW) : Math.min(scroll, scroll / 1440 * wW) : 1,
            terms = wW < 769 ? 50 : 300; 
        $("html, body").stop().animate({
            scrollTop: ($(target).offset().top + scroll - $(".history-navi").outerHeight() + 1) - terms
        }, speed)
    })
});









