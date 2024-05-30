const kvCarouselBreak = async (page) =>{
    // select할 요소들이 나타날 때 까지 대기
    // await page.waitForSelector('.indicator__controls')
    // await page.waitForSelector('.home-kv-carousel__background-media-wrap .image-v2__main')
    await page.waitForSelector('.swiper-slide');

    await page.evaluate (async() => {

        const links = document.querySelectorAll('a');

        links?.forEach(link => {
            // href 속성을 #로 설정하여 비활성화
            link.setAttribute('href', 'javascript:void(0);');
        });

        //KV Autoplay stop button
        const playButtons = document.querySelectorAll('.indicator__controls')
        if(playButtons){
            for(let i=0; i<playButtons.length; i++){
                playButtons[i].click();
            }
        }

        const kvtextshow = document.querySelector('.home-kv-carousel__text-wrap--hide')
        if(kvtextshow) kvtextshow.style.opacity = '1';

        const kvCarouselHoG = document.querySelector('.ho-g-home-kv-carousel')

        if(kvCarouselHoG){ // 1. offer kv가 home kv와 동일한 경우
            if(kvCarouselHoG){
                kvCarouselHoG.style.width = '1440px';
                kvCarouselHoG.style.margin ='0 auto';
            }

            const swiperContainer = document.querySelector(".ho-g-home-kv-carousel .swiper-container")
            if(swiperContainer) swiperContainer.style.overflow = 'visible';

            const kvCarousel = document.querySelector('.ho-g-home-kv-carousel .home-kv-carousel')
            if(kvCarousel) {
                // kvCarousel.style.overflow = 'visible';
                kvCarousel.setAttribute('style', 'overflow: visible !important');
            }

            const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')
            if(kvWraps && kvWraps.length>0){
                for (let cnt = 0; cnt < kvWraps.length-2; cnt++ ) {
                    const kvWrap = kvWraps[cnt]
                    let getId = kvWrap.getAttribute('id')

                    kvWrap.setAttribute('id',getId+"-broken")
                    kvWrap.style.opacity = '1'
                    kvWrap.style.transform = 'translate3d(0, 0, 0)'
                    kvWrap.style.opacity = '1'
                    kvWrap.style.width = '1440px'
                    kvWrap.style.overflow = 'visible'
                    console.log("*****kv", kvWrap);
                }

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
                                vid.style.width = 'calc(100% - 14px)';
                                vid.style.border = '7px solid red';
                            }
                        }
                    }
                });
            }

        }
        // 2. offer kv가 독자적인 경우
        const offerKvHeader = document.querySelector(".of-g-offers-kv")
        if(offerKvHeader){
                offerKvHeader.style.width = '1440px';
                offerKvHeader.style.margin ='0 auto';
            

            const swiperContainer = document.querySelector(".offer-header__container")
            if(swiperContainer) swiperContainer.style.overflow = 'visible';

            const kvCarousel = document.querySelector('.offer-header')
            if(kvCarousel) {
                kvCarousel.setAttribute('style', 'overflow: visible !important');
            }

            const offerWrapper = document.querySelector('.offer-header__wrapper');
            if(offerWrapper){
                offerWrapper.setAttribute('style', 'overflow: visible !important');
            }

            const kvWraps = document.querySelectorAll('.offer-header__slide')
            if(kvWraps && kvWraps.length>0){
                // for (let cnt = 0; cnt < kvWraps.length; cnt++ ) { // length - 2 해야하는 경우도 있음
                const countBtn = document.querySelectorAll('.offer-header__indicator-wrap .indicator__item');
                for(let cnt=0; cnt< countBtn.length; cnt++) {
                    const kvWrap = kvWraps[cnt]
                    let getId = kvWrap.getAttribute('id')

                    kvWrap.setAttribute('id',getId+"-broken")
                    kvWrap.style.transform = 'translate3d(0, 0, 0)'
                    kvWrap.style.opacity = '1'
                    kvWrap.style.width = '1440px'
                    kvWrap.style.overflow = 'visible'
                    console.log("*****kv", kvWrap);
                }
                
                let imgArea = document.querySelector('.offer-header__background-media-wrap')
                let img = imgArea?.querySelector('.image__main');
                if(img){
                    const pcSrc = img.getAttribute('data-desktop-src');
                    img.setAttribute('src', pcSrc);
                    img.style.visibility = 'visible';
                    img.style.opacity = '1';
                    imgArea.style.visibility = 'visible';
                    imgArea.style.opacity = '1';
                    imgArea.style.zIndex = '10';
                }
            }
        }
    });
    
}

const kvMobileCarouselBreak = async (page) =>{
    // select할 요소들이 나타날 때 까지 대기
    // await page.waitForSelector('.indicator__controls')
    // await page.waitForSelector('.home-kv-carousel__background-media-wrap .image-v2__main')
    await page.waitForSelector('.swiper-slide');

    await page.evaluate (async() => {

        const links = document.querySelectorAll('a');

        links?.forEach(link => {
            // href 속성을 #로 설정하여 비활성화
            link.setAttribute('href', 'javascript:void(0);');
        });

        //KV Autoplay stop button
        const playButtons = document.querySelectorAll('.indicator__controls')
        if(playButtons){
            for(let i=0; i<playButtons.length; i++){
                playButtons[i].click();
            }
        }

        const kvtextshow = document.querySelector('.home-kv-carousel__text-wrap--hide')
        if(kvtextshow) kvtextshow.style.opacity = '1';

        const kvCarouselHoG = document.querySelector('.ho-g-home-kv-carousel')

        if(kvCarouselHoG){ // 1. offer kv가 home kv와 동일한 경우
            if(kvCarouselHoG){
                kvCarouselHoG.style.width = '360px';
                kvCarouselHoG.style.margin ='0 auto';
            }

            const swiperContainer = document.querySelector(".ho-g-home-kv-carousel .swiper-container")
            if(swiperContainer) swiperContainer.style.overflow = 'visible';

            const kvCarousel = document.querySelector('.ho-g-home-kv-carousel .home-kv-carousel')
            if(kvCarousel) {
                // kvCarousel.style.overflow = 'visible';
                kvCarousel.setAttribute('style', 'overflow: visible !important');
            }

            const kvWraps = document.querySelectorAll('.swiper-container-fade .swiper-slide')
            if(kvWraps && kvWraps.length>0){
                for (let cnt = 0; cnt < kvWraps.length-2; cnt++ ) {
                    const kvWrap = kvWraps[cnt]
                    let getId = kvWrap.getAttribute('id')

                    kvWrap.setAttribute('id',getId+"-broken")
                    kvWrap.style.opacity = '1'
                    kvWrap.style.transform = 'translate3d(0, 0, 0)'
                    kvWrap.style.opacity = '1'
                    kvWrap.style.width = '360px'
                    kvWrap.style.overflow = 'visible'
                    console.log("*****kv", kvWrap);
                }

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
                        let getSrc = imgArea?.getAttribute('data-360w1x-src');
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
                            const pcSrc = img.getAttribute('data-mobile-src');
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
                                vid.style.width = 'calc(100% - 14px)';
                                vid.style.border = '7px solid red';
                            }
                        }
                    }
                });
            }

        }
        // 2. offer kv가 독자적인 경우
            const offerKvHeader = document.querySelector(".of-g-offers-kv")

        if(offerKvHeader){
                offerKvHeader.style.width = '360px';
                offerKvHeader.style.margin ='0 auto';
            

            const swiperContainer = document.querySelector(".offer-header__container")
            if(swiperContainer) swiperContainer.style.overflow = 'visible';

            const kvCarousel = document.querySelector('.offer-header')
            if(kvCarousel) {
                kvCarousel.setAttribute('style', 'overflow: visible !important');
            }

            const offerWrapper = document.querySelector('.offer-header__wrapper');
            if(offerWrapper){
                offerWrapper.setAttribute('style', 'overflow: visible !important');
            }

            const kvWraps = document.querySelectorAll('.offer-header__slide')
            if(kvWraps && kvWraps.length>0){
                // for (let cnt = 0; cnt < kvWraps.length; cnt++ ) { // length - 2 해야하는 경우도 있음
                const countBtn = document.querySelectorAll('.offer-header__indicator-wrap .indicator__item');
                for(let cnt=0; cnt< countBtn.length; cnt++) {
                    const kvWrap = kvWraps[cnt]
                    let getId = kvWrap.getAttribute('id')

                    kvWrap.setAttribute('id',getId+"-broken")
                    kvWrap.style.transform = 'translate3d(0, 0, 0)'
                    kvWrap.style.opacity = '1'
                    kvWrap.style.width = '360px'
                    kvWrap.style.overflow = 'visible'
                    console.log("*****kv", kvWrap);
                }
                
                let imgArea = document.querySelector('.offer-header__background-media-wrap')
                let img = imgArea?.querySelector('.image__main');
                if(img){
                    const pcSrc = img.getAttribute('data-desktop-src');
                    img.setAttribute('src', pcSrc);
                    img.style.visibility = 'visible';
                    img.style.opacity = '1';
                    imgArea.style.visibility = 'visible';
                    imgArea.style.opacity = '1';
                    imgArea.style.zIndex = '10';
                }
            }
        
        }
    });
    
}

// 카드 케로쉘을 펼치는 함수
const cardCarouselBreak = async (page) => {
    await page.evaluate (() => {

        //     // pd06 케로쉘 깨기
        //     const showCaseCardTab = document.querySelector(".swiper-container.basic-swiper")
        //     const showCaseCardTabWrapper = document.querySelector(".swiper-container.basic-swiper .swiper-wrapper")
            
        //     if(showCaseCardTab) showCaseCardTab.style.overflow = 'visible'
        //     if(showCaseCardTabWrapper) showCaseCardTabWrapper.style.overflow = 'visible'
        // });

        // co16 mobile 케로쉘
        const cardWrappers = document.querySelectorAll('.cm-g-discover-column-new')
        const cardTabs = document.querySelectorAll('.co16-discover-column-new')
        const co16Cards = document.querySelectorAll('.co16-discover-column-new__columns');

        if(cardWrappers) cardWrappers.forEach((cardWrapper)=>{cardWrapper.style.overflow = 'visible'})
        if(cardTabs) cardTabs.forEach((card)=>{card.style.overflow = 'visible'})
        if(co16Cards) co16Cards.forEach((card)=>{card.style.overflow = 'visible'})
    })
}

const viewmoreBreak = async (page) =>{
    await page.evaluate(()=>{
        
        function clickButton() {
            const viewmoreBtn = document.querySelector('.swiper-slide.all-offer-card__panel .cta.cta--outlined');
            if (viewmoreBtn) {
                viewmoreBtn.click();
                console.log("Clicked viewmore button");
            }
        }
        // 1초 간격으로 clickButton 함수를 실행
        const intervalId = setInterval(clickButton, 1000);
        
        // 10초 후에 인터벌 중지
        setTimeout(() => {
            clearInterval(intervalId);
            console.log("Stopped clicking viewmore button");
        }, 10000); // 10초 후에 중지
    }
)
}

const eventListenerBreak = async (page) =>{
    await page.evaluate(()=>{
        const elementsWithListeners = document.querySelectorAll('*');

        // 모든 요소를 반복하며 이벤트 리스너를 제거
        if(elementsWithListeners){
            elementsWithListeners.forEach(element => {
                const clonedElement = element.cloneNode(true);
                if(element.parentNode) element.parentNode.replaceChild(clonedElement, element);
            });
        }
    })
}

module.exports = {
    kvCarouselBreak,
    eventListenerBreak,
    cardCarouselBreak,
    viewmoreBreak,
    kvMobileCarouselBreak
}