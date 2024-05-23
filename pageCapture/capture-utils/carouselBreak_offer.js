const kvCarouselBreak = async (page) =>{
    // select할 요소들이 나타날 때 까지 대기
    await page.waitForSelector('.home-kv-carousel')
    await page.waitForSelector('.home-kv-carousel__background-media-wrap .image-v2__main')
    await page.waitForSelector('.swiper-container-fade .swiper-slide');

    await page.evaluate (async() => {
        //KV Autoplay stop button
        const playButton = document.querySelector('.indicator__controls')
        playButton?.click()

        const kvCarouselHoG = document.querySelector('.ho-g-home-kv-carousel')
        if(kvCarouselHoG){
            kvCarouselHoG.style.width = '1440px'
            kvCarouselHoG.style.margin ='0 auto'
        }
        // const kvWraps = document.querySelectorAll('.home-kv-carousel__slide')
        const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')

        if(kvWraps && kvWraps.length>0){
            for (let cnt =1; cnt < kvWraps.length-1; cnt++ ) {
                const kvWrap = kvWraps[cnt]
                let getId = kvWrap.getAttribute('id')

                // kvWrap.style.opacity = '1'
                kvWrap.setAttribute('id',getId+"-broken")
                kvWrap.style.transform = 'translate3d(0, 0, 0) !important'
                kvWrap.style.opacity = '1 !important'
                kvWrap.style.width = '1440px'
                console.log("*****kv", kvWrap);
            }

        }

        const kvCarousel = document.querySelector('.home-kv-carousel')
        if(kvCarousel) {
            kvCarousel.style.overflow = 'visible !important'
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
                console.log("slide",slide);
                let imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2__main');
                if (imgArea != null) {
                    imgArea.style.visibility = 'visible'
                    imgArea.style.opacity = '1'
                    let getSrc = imgArea?.getAttribute('data-1366w2x-src');
                    if (getSrc) {
                        imgArea.setAttribute('src', getSrc);
                        console.log("*** img src", getSrc);
                    }
                }
                else{
                    console.log("slide else - ",slide);
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
                            vid.style.paddingBottom = '0';
                            vid.style.width = 'calc(100% - 14px)';
                            vid.style.border = '7px solid red';
                        }
                    }
                }
            });
        }
    });
}

module.exports = {
    'kvCarouselBreak' : kvCarouselBreak
}