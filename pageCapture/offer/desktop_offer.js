const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak_offer = require ('../capture-utils/carouselBreak_offer');
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData")
const breaker = require("../capture-utils/breaker")
const fs = require('node:fs');
const path = require('node:path')

const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const takeScreenshot = async (siteCode, dataDate) => {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 500000,
        protocolTimeout: 500000
    });
    console.log("---", siteCode,":offer ---");
    
    const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}/offer`;
    await page.setViewport({ width: 1440, height: 1000 });
    await delay(1000)
    await page.setDefaultTimeout(500000);
    await page.goto(url, { waitUntil: 'load', timeout: 200000 });
    // await delay(1000)
    
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    // await breaker.cookiePopupBreaker(page, false)
    //
    // await delay(10000)
    // await breaker.removeIframe(page)
    // await carouselBreak_offer.kvCarouselBreak(page)
    // await delay(10000)
    // await carouselBreak_offer.viewmoreBreak(page)

    // await carouselBreak_offer.cardCarouselBreak(page)

    await delay(12000)

    // const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

    // if(failedData && failedData.length>0){
    //     for (let i = 0; i < failedData.length; i++){
    //         await failChecker.checkFailData(page,failedData[i])
    //     }
    // }



    // await breaker.accessibilityPopupBreaker(page)
    // await breaker.whatsAppPopupBreaker(page)
    // await carouselBreak_offer.eventListenerBreak(page)
    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")
    const date = new Date()
    const pathName = `result/${date.getFullYear()}${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(2, '0')}/desktop`
    const fileName =`${siteCode}-${dateNow}-desktop-offer.jpeg`
    fs.mkdirSync(pathName, { recursive: true });
    await page.screenshot({ path: `${pathName}/${fileName}`, fullPage: true, type: 'jpeg', quality: 10});

    // browser.close();

}

module.exports = {
    takeScreenshot
}