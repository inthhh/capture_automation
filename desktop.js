const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./utils/capture-utils/carouselBreak');
const failChecker = require("./utils/capture-utils/failChecker");
const getRawData = require("./utils/capture-utils/getRawData")
const breaker = require("./utils/capture-utils/breaker")

const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const takeScreenshot = async (siteCode, dataDate) => {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 100000
    });
    console.log("-----", siteCode,"-----");
    
    const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}`;
    await page.setViewport({ width: 1440, height: 10000 });
    await delay(1000)
    await page.setDefaultTimeout(200000);
    await page.goto(url, { waitUntil: 'load', timeout: 200000 });
    // await delay(1000)
    
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    await breaker.cookiePopupBreaker(page, true)
    await delay(2000)
    if(siteCode != "tr"){
        await breaker.clickFirstMerchan(page)
    }
    // 새로고침되는 경우 breaker를 한번 더 실행
    if(siteCode == "tr"){
        await delay(1000)
        await breaker.cookiePopupBreaker(page, true)
        await breaker.clickFirstMerchan(page)
    }
    await breaker.removeIframe(page)
    await carouselBreak.kvCarouselBreak(page)
    await delay(20000)
    await carouselBreak.showcaseCardBreak(page)

    await delay(20000)

    const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

    if(failedData && failedData.length>0){
        for (let i = 0; i < failedData.length; i++){
            await failChecker.checkFailData(page,failedData[i])
        }
    }

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")
    const fileName = `.\\result\\test\\desktop\\${siteCode}-${dateNow}-desktop-screenshot.jpeg`

    await breaker.accessibilityPopupBreaker(page)
    await carouselBreak.eventListenerBreak(page)
    await page.screenshot({ path: fileName, fullPage: true, type: 'jpeg', quality: 20});

    browser.close();

}

module.exports = {
    takeScreenshot
}