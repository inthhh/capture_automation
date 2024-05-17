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
        timeout: 100000
    });
    console.log("-----", siteCode,"-----");
    const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}`;
    await delay(1000)
    await page.setViewport({ width: 360, height: 10000 });
    await page.setDefaultTimeout(200000);
    await page.goto(url,{ waitUntil: 'load', timeout: 200000 });
    await delay(1000)
    

    // Get the height of the rendered page
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    await breaker.cookiePopupBreaker(page)

    if(siteCode != "tr"){
        await breaker.clickFirstMerchan(page)
    }
    if(siteCode=="tr"){
        await delay(1000)
        await breaker.cookiePopupBreaker(page)
        await breaker.clickFirstMerchan(page)
    }
    await delay(20000)
    await carouselBreak.carouselBreakMobile(page, siteCode)

    await delay(20000)


    const failedData = await getRawData("2024-05-13", siteCode, "N", "Mobile")
    if(failedData && failedData.length>0){
        for (let i = 0; i < failedData.length; i++){
            // console.log(failedImage[i])
            await failChecker.checkFailData(page,failedData[i])
        }
    }

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")

    const fileName = `.\\result\\test\\mobile\\${siteCode}-${dateNow}-mobile-screenshot.jpeg`


    await breaker.accessibilityPopupBreaker(page)
    await breaker.cookiePopupBreaker(page)
    await carouselBreak.eventListenerBreak(page)

    await page.screenshot({ path: fileName, fullPage: true, type: 'jpeg', quality: 20});
    
    const sharp = require('sharp');
    const maxHeight = 15000;
    const outputImagePath = `.\\result\\test\\mobile\\${siteCode}-${dateNow}-mobile-screenshot-cutting.jpeg`

    await sharp(fileName)
    .metadata()
    .then(metadata => {
        const height = metadata.height;
        if (height > maxHeight) {
            return sharp(fileName)
                .extract({ left: 0, top: 0, width: metadata.width, height: maxHeight })
                .toFile(outputImagePath);
        } else return;
    })
    .catch(err => {
        console.error('이미지 자르기 중 오류가 발생했습니다:', err);
    });
    
    browser.close();

}

// takeScreenshot('lb');

module.exports = {
    takeScreenshot
}