const kvCarouselBreak = async (page) =>{
    // await page.waitForSelector('.indicator__controls');
    await page.waitForSelector('.home-kv-carousel')
    await page.evaluate (async() => {
        
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

        const kvVideos = document.querySelectorAll('.home-kv-carousel__background-media-wrap .video')
        if(kvVideos){
            kvVideos.forEach((v)=>{
                v.style.display = 'none';
            })
        }

        const kvCarouselMediaImagePreview = document.querySelectorAll('.home-kv-carousel__background-media-wrap .image-v2__preview+.image-v2__main')
        if(kvCarouselMediaImagePreview){
            console.log("*********select kvCarouselMediaImagePreview ", kvCarouselMediaImagePreview)
            kvCarouselMediaImagePreview.forEach((img, index) => {
                img.style.visibility = 'visible'
                img.style.opacity = '1'
            })
        }

        const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')

        if(kvCarouselSlides){
            kvCarouselSlides.forEach((slide) => {
                const imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2__main');
                if (imgArea != null) {
                    imgArea.style.visibility = 'visible'
                    imgArea.style.opacity = '1'
                    // const getSrc = imgArea.getAttribute('data-src');
                    const getSrc = imgArea.getAttribute('src'); // - 일부 해결
                    // const getSrc = imgArea.getAttribute('data-desktop-src');
                    imgArea.setAttribute('src', getSrc);
                }

            });
        }
    });
}


const showcaseCardBreak = async (page) => {
    await page.evaluate (() => {

        //Todo : click middle tab of showcase tabs

        const showCaseCardTabs = document.querySelectorAll(".showcase-card-tab__inner .tab__item-title")
        // showCaseCardTabs[Math.floor(showCaseCardTabs.length/2)].click()


        const showCaseCardTabInner = document.querySelector(".showcase-card-tab__inner")
        const showCaseCardTabCardWrap = document.querySelector(".showcase-card-tab__card-wrap")
        const swiperContainer = document.querySelector(".swiper-container")

        if(showCaseCardTabInner) showCaseCardTabInner.style.overflow = 'visible'
        if(showCaseCardTabCardWrap) showCaseCardTabCardWrap.style.overflow = 'visible'
        if(swiperContainer) swiperContainer.style.overflow = 'visible'
    })
}

const carouselBreakMobile = async (page, site_code) =>{
    await page.waitForSelector('.home-kv-carousel')
    await page.evaluate ((site_code) => {
        // const grayoverlay = document.querySelector('#insider-opt-in-native-dialog')
        // if(grayoverlay) grayoverlay.style.display = 'none'
        
        const playButton = document.querySelector('.indicator__controls')
            playButton?.click()
        
//ChatBot close button
// const popupClosButton = document.querySelector('.pop_up_close_btn')
// popupClosButton.click()

//Cookie bar button
// const cookieBarCloseButton = document.querySelector('.indicator__controls')
// cookieBarCloseButton.click()
        const w = window.innerWidth;  //PC일떈 1440px
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

// const kvCarouselMediaImageV2 = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2')
// const kvCarouselMediaImageFirstImage = document.querySelector('.home-kv-carousel__background-media-wrap .first-image')
// const kvCarouselMediaImageFirstVideo = document.querySelector('.home-kv-carousel__background-media-wrap .video')


        const kvCarouselMediaImagePreview = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2__preview+.image-v2__main')
        if(kvCarouselMediaImagePreview){
            kvCarouselMediaImagePreview.style.visibility = 'visible'
            kvCarouselMediaImagePreview.style.opacity = '1'
        }
        const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')
        // kvCarouselSlides.length
        if(kvCarouselSlides && kvCarouselSlides.length>0){
            for(let i = 0; i < kvCarouselSlides.length-2; i++){
                const slide = kvCarouselSlides[i]
                slide.style.opacity = '1'
                slide.style.transform = 'translate3d(0, 0, 0)'


                const imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2 .image-v2__main');

                if (imgArea != null) {
                    // cnt -= 1
                    const getSrc = imgArea.getAttribute('data-mobile-src');  // Todo !!! PC :  data-src Mobile : data-mobile-src

                    const isVideo = imgArea.querySelector('.image-v2__preview')
                    if (isVideo) {
                        isVideo.style.visibility = 'visible';
                        isVideo.style.opacity = '1'

                    }

                    if (getSrc != null) {
                        imgArea.setAttribute('src', getSrc);

                    } else {
                        const getSrc2 = imgArea.getAttribute('data-360w2x-src');
                        if(getSrc2) imgArea.setAttribute('src', getSrc2);
                    }
                }
            }
        }


        //  SAVE!
        const showCaseCardTabInner = document.querySelector(".showcase-card-tab__inner")
        const showCaseCardTabCardWrap = document.querySelector(".showcase-card-tab__card-wrap")
        const swiperContainer = document.querySelector(".swiper-container")

        if(showCaseCardTabInner) showCaseCardTabInner.style.overflow = 'visible'
        if(showCaseCardTabCardWrap) showCaseCardTabCardWrap.style.overflow = 'visible'
        if(swiperContainer) swiperContainer.style.overflow = 'visible'

        /*모바일 */

        const mobileCarousel = document.querySelectorAll(".swiper-container");

        mobileCarousel?.forEach((slide) => {
            slide.style.overflow = 'visible';
        })


        /*
        co69-trending-now__card-image
        get data-mobile-src
        set src data-mobile-src
        */
        const trendingCard = document.querySelectorAll('.co69-trending-now__card .co69-trending-now__card-list');

        if(trendingCard){
            trendingCard.forEach((card) => {
                const imgArea = card.querySelector('.co69-trending-now__card-image');
                if (imgArea != null) {
                    const listImg = imgArea.querySelector('.responsive-img')
                    const isLoad = listImg.classList.contains('image--loaded');
                    // cnt -= 1
                    if (!isLoad) {
                        const img = imgArea.querySelector('.image')
                        const getSrc = img.getAttribute('data-mobile-src');
                        img?.setAttribute('src', getSrc);
                    }
                }

            });
        };

        
        /*
        .half-teaser-list
        .style.overflow = 'visible'
        */
        // const halfArea = document.querySelector(".half-teaser-list");
        // halfArea.style.overflow = 'visible';

    });
}

const eventListenerBreak = async (page) =>{
    await page.evaluate(()=>{
        const elementsWithListeners = document.querySelectorAll('*');

        // Iterate over each element and remove all event listeners
        if(elementsWithListeners){
            elementsWithListeners.forEach(element => {
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