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
    console.log("---", siteCode,": offer ---");
    const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}/offer`;
    await page.setViewport({ width: 360, height: 10000 });

    await delay(1000)
    await page.setDefaultTimeout(500000);
    await page.goto(url,{ waitUntil: 'load', timeout: 200000 });
    
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    const footerHandle = await page.$('footer');
    const footerBox = await footerHandle.boundingBox();
    const screenshotHeight = footerBox.y;

    // await page.setViewport({ width: Math.floor(body.width), height: Math.min(body.height, screenshotHeight) });
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    await breaker.cookiePopupBreaker(page, false)
    await delay(12000)
    await breaker.removeIframe(page)
    await carouselBreak_offer.kvMobileCarouselBreak(page)
    await delay(12000)
    await carouselBreak_offer.viewmoreBreak(page)
    await carouselBreak_offer.cardCarouselBreak(page)

    await delay(12000)

    // const failedData = await getRawData(dataDate, siteCode, "N", "Mobile")
    // if(failedData && failedData.length>0){
    //     for (let i = 0; i < failedData.length; i++){
    //         await failChecker.checkFailData(page,failedData[i])
    //     }
    // }




    await breaker.accessibilityPopupBreaker(page)
    await carouselBreak_offer.eventListenerBreak(page)
    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")
    const date = new Date()
    const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile_offer`
    const fileName =`${siteCode}-${dateNow}-mobile-offer.jpeg`
    fs.mkdirSync(pathName, { recursive: true });
    await page.screenshot({ path: `${pathName}/${fileName}`, fullPage: true, type: 'jpeg', quality: 20});
    // await page.screenshot({ path: fileName, fullPage: false, type: 'jpeg', quality: 20 });
    
    // const sharp = require('sharp');
    // const maxHeight = 10000;
    // const outputImagePath = `.\\result\\test\\mobile\\${siteCode}-${dateNow}-mobile-cutting.jpeg`
    
    // await sharp(fileName)
    // .metadata()
    // .then(metadata => {
    //     const height = metadata.height;
    //     if (height > maxHeight) {
    //         return sharp(fileName)
    //             .extract({ left: 0, top: 0, width: metadata.width, height: maxHeight })
    //             .toFile(outputImagePath);
    //     } else return;
    // })
    // .catch(err => {
    //     console.error('이미지 자르기 중 오류가 발생했습니다:', err);
    // });
    
    browser.close();

}

module.exports = {
    takeScreenshot
}