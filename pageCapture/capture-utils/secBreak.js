
// Desktop ver - KV 케로쉘을 펼치는 함수
const kvCarouselBreak = async (page, isDesktop) =>{
    // select할 요소들이 나타날 때 까지 대기
    console.log('------ kv break')
    await page.waitForSelector('.visual.slick-slide')
    await page.waitForSelector('.slide-btn.slide-pause')

    await page.evaluate (async(isDesktop) => {
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
            if(isDesktop){
                kvCarouselHoG.style.width = '1440px'
            }
            else kvCarouselHoG.style.width = '360px'
            kvCarouselHoG.style.margin ='0 auto'
            kvCarouselHoG.style.overflow = 'visible'
        }

        const cont = document.querySelector('#container')
        if(cont) cont.style.overflow = 'visible'
        const kvCarouselwrap = document.querySelector('.wrap-component .type-video')
        if(kvCarouselwrap) kvCarouselwrap.style.overflow = 'visible'
        const kvarea = document.querySelector('.wrap-component .slick-list.draggable')
        if(kvarea) kvarea.style.overflow = 'visible'
        const kvarea2 = document.querySelector('.component-contents.pt-none')
        if(kvarea2) kvarea2.style.overflow = 'visible'
        const track = document.querySelector('.slick-track')
        if(track) track.style.overflow = 'visible'
        const slide = document.querySelector('.slider-carousel-visual')
        if(slide) slide.style.overflow = 'visible'

        const kvWraps = document.querySelectorAll('.visual.slick-slide')

        if(kvWraps && kvWraps.length>0){
            for (let cnt = 0; cnt < kvWraps.length; cnt++ ) {
                const kvWrap = kvWraps[cnt]
                let getId = kvWrap.getAttribute('id')
                kvWrap.setAttribute('id',getId+"-broken")
                kvWrap.style.opacity = '1'
                kvWrap.style.left = '0'
                if(isDesktop){
                    kvWrap.style.width = '1440px'
                }
                else kvWrap.style.width = '360px'
            }
        }

    },isDesktop);
}

const contentsToLeft = async (page) => {
    await page.waitForSelector('#footer')
    console.log("--- to left")
    await page.evaluate (async() => {
        const headerInner = document.querySelector('.header__inner')
        const kvw = document.querySelector('.wrap-component.carousel-container.pt-none')
        const foot = document.querySelector('#footer')
        if(headerInner) headerInner.style.margin = '0'
        if(kvw) kvw.style.margin = '0'
        if(foot) {
            foot.style.display = 'grid'
            foot.style.justifyItems = 'start'
            foot.style.marginBottom = '0'
        }

        const contents = document.querySelectorAll('.content')
        if(contents && contents.length  > 0){
            for(let c = 0; c<contents.length; c++){
                const content = contents[c];
                content.style.margin = '0'
            }
        }
    })
}

// co05 케로쉘을 펼치는 함수
const showcaseCardBreak = async (page) => {
    console.log("--- open co05")
    await page.evaluate (() => {

        // const wrapper = document.querySelector(".wrap-component.tabtype-container.pt-nrw.pb-nrw.w1440px")
        const conbox = document.querySelector(".conbox.conbox-b2c-main")
        const wrapcontainer = conbox.querySelector(".component-contents.pt-none.pb-none")
        const container = document.querySelector(".tablist-prd-container")
        if(conbox) conbox.style.overflow = 'visible'
        if(wrapcontainer) wrapcontainer.style.overflow = 'visible'
        if(container) container.style.overflow = 'visible'
    })
}

const buttonBreak = async(page)=>{
    await page.evaluate(()=>{

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const menuwrap = document.querySelector('.menu__wrap');
                if (menuwrap) menuwrap.remove();

                const innermask = document.querySelector('.inner__mask');
                if(innermask) innermask.remove();

                const story = document.querySelector(".b2c-box.box-story")
                if(story) {
                    story.style.overflow = 'hidden';
                    story.style.width = '360px';
                }
                // observer1.disconnect();  // 요소를 찾으면 더 이상 감시하지 않음
            });
          });
          observer.observe(document.body, { childList: true, subtree: true });
    })
}

module.exports = {
    kvCarouselBreak,
    showcaseCardBreak,
    contentsToLeft,
    buttonBreak
}