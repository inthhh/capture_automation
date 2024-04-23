

const carouselBreakMobile = async (page) =>{
    await page.evaluate (() => {
        const playButton = document.querySelector('.indicator__controls')
        playButton.click()

//ChatBot close button
// const popupClosButton = document.querySelector('.pop_up_close_btn')
// popupClosButton.click()

//Cookie bar button
// const cookieBarCloseButton = document.querySelector('.indicator__controls')
// cookieBarCloseButton.click()

        const w = window.innerWidth;  //PC일떈 1440px
        const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')
        kvWraps.forEach((kvWrap) => {
            kvWrap.style.opacity = '1'
            kvWrap.style.transform = 'translate3d(0, 0, 0)'
            kvWrap.style.opacity = '1'
            kvWrap.style.width = w
        })

        const kvCarousel = document.querySelector('.home-kv-carousel')
        kvCarousel.style.overflow = 'visible'

        const kvCarouselMediaWraps = document.querySelectorAll('.home-kv-carousel__background-media-wrap')
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
// const kvCarouselMediaImageV2 = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2')
// const kvCarouselMediaImageFirstImage = document.querySelector('.home-kv-carousel__background-media-wrap .first-image')
// const kvCarouselMediaImageFirstVideo = document.querySelector('.home-kv-carousel__background-media-wrap .video')


        const kvCarouselMediaImagePreview = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2__preview+.image-v2__main')
        kvCarouselMediaImagePreview.style.visibility = 'visible'
        kvCarouselMediaImagePreview.style.opacity = '1'

        const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')

        kvCarouselSlides.forEach((slide) => {
            slide.style.opacity = '1'
            slide.style.transform = 'translate3d(0, 0, 0)'


            const imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2 .image-v2__main');
            console.log('imgArea');
            console.log(imgArea);
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
                    imgArea.setAttribute('src', getSrc2);
                }
            }
        });

        const showCaseCardTabInner = document.querySelector(".showcase-card-tab__inner")
        const showCaseCardTabCardWrap = document.querySelector(".showcase-card-tab__card-wrap")
        const swiperContainer = document.querySelector(".swiper-container")

        showCaseCardTabInner.style.overflow = 'visible'
        showCaseCardTabCardWrap.style.overflow = 'visible'
        swiperContainer.style.overflow = 'visible'

        /*모바일 */

        const mobileCarousel = document.querySelectorAll(".swiper-container");

        mobileCarousel.forEach((slide) => {
            slide.style.overflow = 'visible';
        })


        /*
        co69-trending-now__card-image
        get data-mobile-src
        set src data-mobile-src
        */
        const trendingCard = document.querySelectorAll('.co69-trending-now__card .co69-trending-now__card-list');

        trendingCard.forEach((card) => {
            const imgArea = card.querySelector('.co69-trending-now__card-image');
            if (imgArea != null) {
                const listImg = imgArea.querySelector('.responsive-img')
                const isLoad = listImg.classList.contains('image--loaded');
                // cnt -= 1
                if (!isLoad) {
                    const img = imgArea.querySelector('.image')
                    const getSrc = img.getAttribute('data-mobile-src');
                    img.setAttribute('src', getSrc);
                }
            }

        });


        /*
        .half-teaser-list
        .style.overflow = 'visible'
        */
        const halfArea = document.querySelector(".half-teaser-list");
        halfArea.style.overflow = 'visible';
    });
}

module.exports = {
    'kvCarouselBreak': kvCarouselBreak,
    'showcaseCardBreak': showcaseCardBreak
}