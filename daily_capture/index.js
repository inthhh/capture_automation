const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');
const failChecker = require('./failChecker')

const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const takeScreenshot = async (siteCode) => {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 100000
    });

    const page = await browser.newPage();

    const url = `https://www.samsung.com/${siteCode}`;
    await page.setViewport({ width: 360, height: 1000 });
    await page.goto(url, {waitUntil: 'load'});

    // Get the height of the rendered page
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});


    //Click Cookie popup accept
    // await page.click('.cookie-bar__close')

    await carouselBreak.showcaseCardBreak(page)
    await carouselBreak.kvCarouselBreak(page)

    await delay(20000)

    // await carouselBreak.eventListenerBreak(page)

    const elementsWithEllipsis = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const elementsWithEllipsis = [];

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            // const innerHtml = element.innerHTML
            const hasEllipsis = style.overflow === 'hidden' && style.textOverflow === 'ellipsis';
            const renderedWidth = element.getBoundingClientRect().width;
            const scrollWidth = element.scrollWidth;

            if (scrollWidth > renderedWidth && hasEllipsis) {
                elementsWithEllipsis.push({
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    textContent: element.textContent.trim()
                });
            }
        });
        return elementsWithEllipsis;
    });
    console.table(elementsWithEllipsis);
    const failedImage= [""]
    for (let i = 0; i < failedImage.length; i++){
        await failChecker.checkFailImage(page,failedImage[i])
    }

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")
    const fileName = `C:\\Users\\PTK\\Desktop\\CODE\\weekly_capture_v0.0.2\\result\\${siteCode}-${dateNow}-screenshot.png`

    await page.screenshot({ path: fileName, fullPage:true});
    // browser.close();
}
const siteCode = 'cz'

takeScreenshot(siteCode);