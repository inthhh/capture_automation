const { Builder, By, until } = require('selenium-webdriver'); // until 포함

/**
 * KV 케로쉘을 펼칩니다. (sec Home ver)
 * @param {*} driver 
 * @param {*} isDesktop 
 */
const kvCarouselBreak = async (driver, isDesktop) =>{
    // select할 요소들이 나타날 때 까지 대기
    console.log('------ kv break')
    await driver.wait(until.elementLocated(By.css('.visual.slick-slide')), 10000);
    await driver.wait(until.elementLocated(By.css('.slide-btn.slide-pause')), 10000);

    await driver.executeScript (async(isDesktop) => {
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

        // const kvCarouselHoG = document.querySelector('.wrap-component.carousel-container') // ?
        // if(kvCarouselHoG){
        //     if(isDesktop){
        //         kvCarouselHoG.style.width = '1440px'
        //     }
        //     else kvCarouselHoG.style.width = '360px'
        //     kvCarouselHoG.style.margin ='0 auto'
        //     kvCarouselHoG.style.overflow = 'visible'
        // }

        const cont = document.querySelector('#container')
        if(cont) cont.style.overflow = 'visible'
        const kvCarouselwrap = document.querySelector('.wrap-component .type-video')
        if(kvCarouselwrap) kvCarouselwrap.style.overflow = 'visible'
        const kvarea = document.querySelector('.wrap-component .slick-list.draggable')
        if(kvarea) kvarea.style.overflow = 'visible'
        // const mainKV = document.querySelector('.b2c__main-kv')
        // if(mainKV) mainKV.style.overflow = 'visible'
        
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

/**
 * 모든 콘텐츠를 좌측정렬합니다. (sec Home ver)
 * @param {*} driver 
 */
const contentsToLeft = async (driver) => {
    await driver.wait(until.elementLocated(By.css('#footer')), 10000);
    console.log("--- to left")
    await driver.executeScript  (async() => {
        const headerInner = document.querySelector('.header__inner')
        const kvw = document.querySelector('.wrap-component.carousel-container.pt-none')
        const foot = document.querySelector('#footer')
        if(headerInner) {
            headerInner.style.margin = '0'
            // headerInner.style.setProperty('max-width', '2520px', 'important');
        }if(kvw) kvw.style.margin = '0'
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
                content.style.overflow = 'visible';
                // content.style.setProperty('max-width', '2520px', 'important');
            }
        }
    })
}

/**
 * CO05 케로쉘을 펼칩니다. (sec Home ver)
 * @param {*} driver 
 */
const showcaseCardBreak = async (driver) => {
    console.log("--- open co05")
    await driver.executeScript (() => {
        const conbox = document.querySelector(".conbox.conbox-b2c-main")
        const wrapcontainer = conbox.querySelector(".component-contents.pt-none.pb-none")
        const container = document.querySelector(".tablist-prd-container")
        if(conbox) conbox.style.overflow = 'visible'
        if(wrapcontainer) wrapcontainer.style.overflow = 'visible'
        if(container) container.style.overflow = 'visible'
        
        // const slickList = document.querySelectorAll('.common-marketing-content');
        // if(slickList) slickList.forEach((s)=>{s.style.overflow = 'hidden';})
    })
}

/**
 * 메뉴바 등 불필요한 요소를 제거합니다. (sec Home ver)
 * @param {*} driver 
 */
const buttonBreak = async(driver)=>{
    await driver.executeScript(()=>{

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const menuwrap = document.querySelector('.menu__wrap');
                if (menuwrap) menuwrap.remove();
                const bottom__navi = document.querySelector('#bottom__navi');
                if(bottom__navi) bottom__navi.remove();
                const innermask = document.querySelector('.inner__mask');
                if(innermask) innermask.remove();
                const marketingPop = document.querySelector('#marketingPop');
                if(marketingPop) marketingPop.remove();
                const mask = document.querySelector('#mask');
                if(mask) mask.remove();
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