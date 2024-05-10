const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');
const failChecker = require("./failChecker");
const getRawData = require("./api")
const breaker = require("./breaker")

const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const takeScreenshot = async (siteCode) => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    console.log("-----", siteCode,"-----");
    
    const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}`;
    await page.setViewport({ width: 1440, height: 10000 });
    await page.goto(url, {waitUntil: 'load'});
    breaker.cookiePopupBreaker(page)

    // Get the height of the rendered page
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    await carouselBreak.carouselBreakMobile(page)

    await delay(40000)

    await carouselBreak.eventListenerBreak(page)

    const failedData = await getRawData("2024-05-09", siteCode, "N", "Desktop")

    for (let i = 0; i < failedData.length; i++){
        // console.log(failedImage[i])
        await failChecker.checkFailData(page,failedData[i])
    }

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")

    const fileName = `.\\result\\test\\desktop\\${siteCode}-${dateNow}-desktop-screenshot.jpeg`

    await breaker.accessibilityPopupBreaker(page)
    await page.screenshot({ path: fileName, fullPage: true, type: 'jpeg', quality: 20});

    browser.close();

}

// takeScreenshot('lb');

module.exports = {
    takeScreenshot
}