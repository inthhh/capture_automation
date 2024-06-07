
// Desktop ver - KV 케로쉘을 펼치는 함수
const kvCarouselBreak = async (page) =>{
    // select할 요소들이 나타날 때 까지 대기
    console.log('------ kv break')
    await page.waitForSelector('.visual.slick-slide')
    await page.waitForSelector('.slide-btn.slide-pause')

    await page.evaluate (async() => {
        const floating = document.querySelector('#floatingSticky')
        if(floating) floating.remove();
        //KV Autoplay stop button
        const playButton = document.querySelector('.slide-btn.slide-pause')
        playButton?.click()

        const kvbtns = document.querySelector('.slider-controls.ready.paused');
        const prebtn = document.querySelector('.slick-prev.slick-arrow');
        const nextbtn = document.querySelector('.slick-next.slick-arrow');
        kvbtns?.remove();
        prebtn?.remove();
        nextbtn?.remove();

        const kvCarouselHoG = document.querySelector('.wrap-component.carousel-container') // ?
        if(kvCarouselHoG){
            kvCarouselHoG.style.width = '1440px'
            // kvCarouselHoG.style.margin ='0 auto'
            kvCarouselHoG.style.overflow = 'visible'
        }

        const cont = document.querySelector('#container')
        if(cont) {
            cont.style.overflow = 'visible'
        }
        const kvCarouselwrap = document.querySelector('.wrap-component .type-video')
        if(kvCarouselwrap) kvCarouselwrap.style.overflow = 'visible'
        const kvarea = document.querySelector('.wrap-component .slick-list.draggable')
        if(kvarea) kvarea.style.overflow = 'visible'
        const kvarea2 = document.querySelector('.component-contents.pt-none')
        if(kvarea2) kvarea2.style.overflow = 'visible'
        const track = document.querySelector('.slick-track')
        if(track) {
            track.style.overflow = 'visible'
        }
        const slide = document.querySelector('.slider-carousel-visual')
        if(slide) slide.style.overflow = 'visible'

        const headerInner = document.querySelector('.header__inner')
        const kvw = document.querySelector('.wrap-component.carousel-container.pt-none')
        const foot = document.querySelector('#footer')
        if(headerInner) headerInner.style.margin = '0'
        if(kvw) kvw.style.margin = '0'
        if(foot) foot.style.margin = '0'

        const contents = document.querySelectorAll('.content')
        if(contents && contents.length  > 0){
            for(let c = 0; c<contents.length; c++){
                const content = contents[c];
                content.style.margin = '0'
            }
        }

        const kvWraps = document.querySelectorAll('.visual.slick-slide')

        if(kvWraps && kvWraps.length>0){
            for (let cnt = 0; cnt < kvWraps.length; cnt++ ) {
                const kvWrap = kvWraps[cnt]
                let getId = kvWrap.getAttribute('id')
                kvWrap.setAttribute('id',getId+"-broken")
                kvWrap.style.opacity = '1'
                kvWrap.style.width = '1440px'
                kvWrap.style.left = '0'
            }
        }

    
        const kvCarouselMediaWraps = document.querySelectorAll('.home-kv-carousel__background-media-wrap')

        // if(kvCarouselMediaWraps){
        //     kvCarouselMediaWraps.forEach((kvCarouselMediaWrap) => {
        //         const kvCarouselMediaImage = document.querySelector('.home-kv-carousel__background-media-wrap .image')
        //         const kvCarouselMediaImageV2 = document.querySelector('.home-kv-carousel__background-media-wrap .image-v2')
        //         const kvCarouselMediaImageFirstImage = document.querySelector('.home-kv-carousel__background-media-wrap .first-image')
        //         const kvCarouselMediaImageFirstVideo = document.querySelector('.home-kv-carousel__background-media-wrap .video')

        //         if (kvCarouselMediaImage != null) {
        //             kvCarouselMediaImage.style.height = '100% !important';
        //         }
        //         if (kvCarouselMediaImageV2 != null) {
        //             kvCarouselMediaImageV2.style.height = '100% !important';
        //         }
        //         if (kvCarouselMediaImageFirstImage != null) {
        //             kvCarouselMediaImageFirstImage.style.height = '100% !important';
        //         }
        //         if (kvCarouselMediaImageFirstVideo != null) {
        //             kvCarouselMediaImageFirstVideo.style.height = '100% !important';
        //         }
        //     })
        // }

        // 각 kv 슬라이드의 대표 이미지를 찾는 로직
        // const kvCarouselSlides = document.querySelectorAll('.home-kv-carousel__wrapper .home-kv-carousel__slide')

        // if(kvCarouselSlides){
        //     kvCarouselSlides.forEach((slide) => {
        //         console.log("slide",slide);
        //         let imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image-v2__main');
        //         if (imgArea != null) {
        //             imgArea.style.visibility = 'visible'
        //             imgArea.style.opacity = '1'
        //             let getSrc = imgArea?.getAttribute('data-1366w2x-src');
        //             if (getSrc) {
        //                 imgArea.setAttribute('src', getSrc);
        //                 console.log("*** img src", getSrc);
        //             }
        //         }
        //         else{
        //             console.log("slide else - ",slide);
        //             imgArea = slide.querySelector('.home-kv-carousel__background-media-wrap .image');
        //             let img = imgArea?.querySelector('.image__main');
        //             if(imgArea && img){
        //                 const pcSrc = img.getAttribute('data-desktop-src');
        //                 img.setAttribute('src', pcSrc);
        //                 img.style.visibility = 'visible';
        //                 img.style.opacity = '1';
        //                 imgArea.style.visibility = 'visible';
        //                 imgArea.style.opacity = '1';
        //                 imgArea.style.zIndex = '10';
        //             } 
        //             else if(slide.querySelector('.home-kv-carousel__background-media-wrap picture')){
        //                 // 대표이미지 다른 형식으로 존재
        //             }
        //             else {
        //                 const vid = slide.querySelector('.video');
        //                 if(vid){
        //                     // video preview 이미지 없을 시 border 처리
        //                     // vid.style.width = 'calc(100% - 14px)';
        //                     // vid.style.border = '7px solid red';
        //                 }
        //             }
        //         }
        //     });
        // }
    });
}

// co05 케로쉘을 펼치는 함수
const showcaseCardBreak = async (page) => {
    await page.evaluate (() => {

        const showCaseCardTabInner = document.querySelector(".tablist-prd-container")
        const showCaseCardTabCardWrap = document.querySelector(".slider-tabtype-list.swiper-container-initialized")
        const swiperContainer = document.querySelector(".swiper-wrapper")

        if(showCaseCardTabInner) showCaseCardTabInner.style.overflow = 'visible'
        if(showCaseCardTabCardWrap) showCaseCardTabCardWrap.style.overflow = 'visible'
        if(swiperContainer) swiperContainer.style.overflow = 'visible'
    })
}

module.exports = {
    kvCarouselBreak,
    showcaseCardBreak
}