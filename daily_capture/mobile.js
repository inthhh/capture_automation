const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');

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
    await page.setViewport({ width: 360, height: 10000 });
    await page.goto(url, {waitUntil: 'load'});

    // Get the height of the rendered page
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    //Click Cookie popup accept
    await page.click('.cookie-bar__close')

    await carouselBreak.carouselBreakMobile(page)

    await delay(30000)

    await carouselBreak.eventListenerBreak(page)

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")

    const fileName = `C:\\Users\\PTK\\Desktop\\CODE\\weekly_capture_v0.0.2\\result\\${siteCode}-${dateNow}-screenshot.png`

    await page.screenshot({ path: fileName, fullPage: true});
    browser.close();

}

takeScreenshot('us');