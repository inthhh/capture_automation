const { Builder, By, until } = require('selenium-webdriver'); // until 포함
/**
 * KV 케로쉘을 펼칩니다. (Desktop/Home ver)
 * @param {*} driver 
 */
const kvCarouselBreak = async (driver) =>{
    // select할 요소들이 나타날 때 까지 대기
    await driver.wait(until.elementLocated(By.css('.home-kv-carousel')), 10000);
    await driver.wait(until.elementLocated(By.css('.home-kv-carousel__background-media-wrap .image-v2__main')), 10000);

    await driver.executeScript (async() => {
        //KV Autoplay stop button
        const playButton = document.querySelector('.indicator__controls')
        playButton?.click()

        const kvCarouselHoG = document.querySelector('.ho-g-home-kv-carousel')
        if(kvCarouselHoG){
            kvCarouselHoG.style.width = '1440px'
            kvCarouselHoG.style.margin ='0 auto'
        }
        const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')

        if(kvWraps && kvWraps.length>0){
            for (let cnt =0; cnt < kvWraps.length-2; cnt++ ) {

                const kvWrap = kvWraps[cnt]
                let getId = kvWrap.getAttribute('id')

                kvWrap.setAttribute('id',getId+"-broken")
                kvWrap.style.opacity = '1'
                kvWrap.style.transform = 'translate3d(0, 0, 0)'
                kvWrap.style.opacity = '1'
                kvWrap.style.width = '1440px'
            }

        }

        const kvCarousel = document.querySelector('.home-kv-carousel')
        if(kvCarousel) {
            kvCarousel.style.overflow = 'visible'
        }

        const kvCarouselMediaWraps = document.querySelectorAll('.home-kv-carousel__background-media-wrap')

        if(kvCarouselMediaWraps){
            kvCarouselMediaWraps.forEach((kvCarouselMediaWrap) => {
                const kvCarouselMediaImage = document.querySelector('.home-kv-carousel__background-media-wrap .image')
                const kvCarouselMediaImageV2 = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2')
                const kvCarouselMediaImageFirstImage = document.querySelector('.home-kv-carousel__background-media-wrap .first-image')
                const kvCarouselMediaImageFirstVideo = document.querySelector('.home-kv-carousel__background-media-wrap .video')

                if (kvCarouselMediaImage != null) {
                    kvCarouselMediaImage.style.height = '100% !important';
                }
                if (kvCarouselMediaImageV2 != null) {
                    kvCarouselMediaImageV2.style.height = '100% !important';
                }
                if (kvCarouselMediaImageFirstImage != null) {
                    kvCarouselMediaImageFirstImage.style.height = '100% !important';
                }
                if (kvCarouselMediaImageFirstVideo != null) {
                    kvCarouselMediaImageFirstVideo.style.height = '100% !important';
                }
            })
        }

        // 각 kv 슬라이드의 대표 이미지를 찾는 로직
        const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')

        if(kvCarouselSlides){
            kvCarouselSlides.forEach((slide) => {
                // console.log("slide",slide);
                let imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2__main');
                if (imgArea != null) {
                    imgArea.style.visibility = 'visible'
                    imgArea.style.opacity = '1'
                    let getSrc = imgArea?.getAttribute('data-1366w2x-src');
                    if (getSrc) {
                        imgArea.setAttribute('src', getSrc);
                        // console.log("*** img src", getSrc);
                    }
                }
                else{
                    // console.log("slide else - ",slide);
                    imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image');
                    let img = imgArea?.querySelector('.image__main');
                    if(imgArea && img){
                        const pcSrc = img.getAttribute('data-desktop-src');
                        img.setAttribute('src', pcSrc);
                        img.style.visibility = 'visible';
                        img.style.opacity = '1';
                        imgArea.style.visibility = 'visible';
                        imgArea.style.opacity = '1';
                        imgArea.style.zIndex = '10';
                    } 
                    else if(slide.querySelector('.home-kv-carousel__background-media-wrap picture')){
                        // 대표이미지 다른 형식으로 존재
                    }
                    else {
                        const vid = slide.querySelector('.video');
                        if(vid){
                            // video preview 이미지 없을 시 border 처리
                            // vid.style.width = 'calc(100% - 14px)';
                            // vid.style.border = '7px solid red';
                        }
                    }
                }
            });
        }
    });
}

/**
 * CO05 케로쉘을 펼칩니다. (Desktop/Home ver)
 * @param {*} driver 
 */
const showcaseCardBreak = async (driver) => {
    await driver.executeScript (() => {

        const showCaseCardTabs = document.querySelectorAll(".showcase-card-tab__inner .tab__item-title")

        const showCaseCardTabInner = document.querySelector(".showcase-card-tab__inner")
        const showCaseCardTabCardWrap = document.querySelector(".showcase-card-tab__card-wrap")
        const swiperContainer = document.querySelector(".swiper-container")

        if(showCaseCardTabInner) showCaseCardTabInner.style.overflow = 'visible'
        if(showCaseCardTabCardWrap) showCaseCardTabCardWrap.style.overflow = 'visible'
        if(swiperContainer) swiperContainer.style.overflow = 'visible'
    })
}

/**
 * KV 및 CO05 케로쉘을 펼칩니다. (Mobile/Home ver)
 * @param {*} driver 
 * @param {*} site_code 
 */
const carouselBreakMobile = async (driver, site_code) =>{
    // select할 요소들이 나타날 때 까지 대기
    await driver.waitForSelector('.home-kv-carousel')
    await driver.executeScript ((site_code) => {
        
        const playButton = document.querySelector('.indicator__controls')
        playButton?.click()
        
        const w = window.innerWidth;
        const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')

        if(kvWraps && kvWraps.length > 0){
            for (let cnt =0; cnt < kvWraps.length-2; cnt++ ) {

                const kvWrap = kvWraps[cnt]
                if (kvWrap) {
                    let getId = kvWrap.getAttribute('id')
                    kvWrap.setAttribute('id',getId+"-broken")
                    kvWrap.style.opacity = '1'
                    kvWrap.style.transform = 'translate3d(0, 0, 0)'
                    kvWrap.style.opacity = '1'
                    kvWrap.style.width = w
                }

            }
        }

        const kvCarousel = document.querySelector('.home-kv-carousel')
        if(kvCarousel) kvCarousel.style.overflow = 'visible'

        const kvCarouselMediaWraps = document.querySelectorAll('.home-kv-carousel__background-media-wrap')
        
        if(kvCarouselMediaWraps){
            kvCarouselMediaWraps.forEach((kvCarouselMediaWrap) => {
                const kvCarouselMediaImage = document.querySelector('.home-kv-carousel__background-media-wrap .image')
                const kvCarouselMediaImageV2 = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2')
                const kvCarouselMediaImageFirstImage = document.querySelector('.home-kv-carousel__background-media-wrap .first-image')
                const kvCarouselMediaImageFirstVideo = document.querySelector('.home-kv-carousel__background-media-wrap .video')

                if (kvCarouselMediaImage != null) {
                    kvCarouselMediaImage.style.height = '100% !important';
                }
                if (kvCarouselMediaImageV2 != null) {
                    kvCarouselMediaImageV2.style.height = '100% !important';
                }
                if (kvCarouselMediaImageFirstImage != null) {
                    kvCarouselMediaImageFirstImage.style.height = '100% !important';
                }
                if (kvCarouselMediaImageFirstVideo != null) {
                    kvCarouselMediaImageFirstVideo.style.height = '100% !important';
                }
            })
        }

        // 각 kv 슬라이드의 대표 이미지를 찾는 로직
        const kvCarouselMediaImagePreview = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2__preview+.image-v2__main')
        if(kvCarouselMediaImagePreview){
            kvCarouselMediaImagePreview.style.visibility = 'visible'
            kvCarouselMediaImagePreview.style.opacity = '1'
        }
        const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')
        
        if(kvCarouselSlides && kvCarouselSlides.length>0){
            for(let i = 0; i < kvCarouselSlides.length-2; i++){
                const slide = kvCarouselSlides[i]
                let imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2 .image-v2__main');

                if (imgArea != null) {
                    const getSrc2 = imgArea.getAttribute('data-360w2x-src');
                    if(getSrc2) imgArea.setAttribute('src', getSrc2);
                }
                else{
                    imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image');
                    let img = imgArea?.querySelector('.image__main');
                    // console.log("**",slide.querySelector('.home-kv-carousel__background-media-wrap .image'))
                    if(imgArea && img){
                        const mobileSrc = img.getAttribute('data-mobile-src');
                        img.setAttribute('src', mobileSrc);
                        imgArea.style.visibility = 'visible';
                        imgArea.style.opacity = '1';
                        imgArea.style.zIndex = '10';
                        img.style.visibility = 'visible';
                        img.style.opacity = '1';
                    }
                    else if(slide.querySelector('.home-kv-carousel__background-media-wrap picture')){
                        // 대표이미지 다른 형식으로 존재
                    }
                    else {
                        const vid = slide.querySelector('.video');
                        if(vid){
                            // video preview 이미지 없을 시 border 처리
                            // vid.style.width = 'calc(100% - 14px)';
                            // vid.style.border = '7px solid red';
                        }
                    }
                }
            }
        }

        const swiperContainer = document.querySelector(".swiper-container")
        if(swiperContainer) swiperContainer.style.overflow = 'visible'

        const showCaseCardTabInner = document.querySelector(".showcase-card-tab__inner")
        const showCaseCardTabCardWrap = document.querySelector(".showcase-card-tab__card-wrap")
        const tablist = showCaseCardTabInner.querySelector(".tab__list")

        if(showCaseCardTabInner) showCaseCardTabInner.style.overflow = 'visible'
        if(showCaseCardTabCardWrap) showCaseCardTabCardWrap.style.overflow = 'visible'
        if(tablist) tablist.style.overflow = 'visible'

        
        // co07 모든 케로쉘 깨는 로직 (필요 시 사용)
        // const mobileCarousel = document.querySelectorAll(".swiper-container");

        // mobileCarousel?.forEach((slide) => {
        //     slide.style.overflow = 'visible';
        // })

        const trendingCard = document.querySelectorAll('.co69-trending-now__card .co69-trending-now__card-list');

        // if(trendingCard){
        //     trendingCard.forEach((card) => {
        //         const imgArea = card.querySelector('.co69-trending-now__card-image');
        //         if (imgArea != null) {
        //             const listImg = imgArea.querySelector('.responsive-img')
        //             if(!listImg) return;
        //             const isLoad = listImg.classList.contains('image--loaded');
        //             if (!isLoad) {
        //                 const img = imgArea.querySelector('.image')
        //                 const getSrc = img.getAttribute('data-mobile-src');
        //                 img?.setAttribute('src', getSrc);
        //             }
        //         }

        //     });
        // };

    });
}

/**
 * 이벤트리스너를 제거합니다. (Home ver)
 * @param {*} driver 
 */
const eventListenerBreak = async (driver) =>{
    await driver.executeScript(()=>{
        const elementsWithListeners = document.querySelectorAll('*');

        // 모든 요소를 반복하며 이벤트 리스너를 제거
        if(elementsWithListeners){
            elementsWithListeners.forEach(element => {
                element.style.display = 'grid'
                element.style.justifyItems = 'start'
                element.style.marginBottom = '0'
                element.style.left = 0;
                const clonedElement = element.cloneNode(true);
                if(element.parentNode) element.parentNode.replaceChild(clonedElement, element);
            });

        }
    })
}

module.exports = {
    'carouselBreakMobile': carouselBreakMobile,
    'eventListenerBreak' : eventListenerBreak,
    'showcaseCardBreak' : showcaseCardBreak,
    'kvCarouselBreak' : kvCarouselBreak
}