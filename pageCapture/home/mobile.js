const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('../capture-utils/carouselBreak');
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData")
const breaker = require("../capture-utils/breaker")
const fs = require('fs');
const path = require('node:path');
const sharp = require('sharp');
const { getWeekNumber } = require('../result-utils/getWeekNumber')

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
    await page.setViewport({ width: 360, height: 10000 });

    await delay(1000)
    await page.setDefaultTimeout(200000);
    await page.goto(url,{ waitUntil: 'load', timeout: 200000 });
    await delay(2000)
    
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});

    await breaker.cookiePopupBreaker(page, false)
    // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
    await delay(2000)
    
    await breaker.clickEveryMerchan(page)
    await breaker.clickFirstMerchan(page)

    await breaker.removeIframe(page)
    await carouselBreak.carouselBreakMobile(page, siteCode)
    await delay(10000)
    await carouselBreak.eventListenerBreak(page)
    await delay(8000)

    const failedData = await getRawData(dataDate, siteCode, "N", "Mobile")
    if(failedData && failedData.length>0){
        for (let i = 0; i < failedData.length; i++){
            await failChecker.checkFailData(page, failedData[i], true)
        }
    }

    await breaker.accessibilityPopupBreaker(page)
    // await carouselBreak.eventListenerBreak(page)
    const dateNow = moment().format("YYMMDD")
    const date = new Date()
    const weekNumber = getWeekNumber(date);
    const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile`
    const fileName =`W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode}).jpeg`
    const fullPath = `${pathName}/${fileName}`;
    fs.mkdirSync(pathName, { recursive: true });
    await page.screenshot({ path: fullPath, fullPage: true, type: 'jpeg', quality: 20});
    const fileName2 =`W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode})_cutting.jpeg`
    const fullPath2 = `${pathName}/${fileName2}`;
    
    if (siteCode == 'it') {
        try {
            const maxHeight = 12000;
            const sharp = require('sharp');
            const metadata = await sharp(fullPath).metadata();
            const height = metadata.height;
    
            if (height > maxHeight) {
                await sharp(fullPath)
                    .extract({ left: 0, top: 0, width: metadata.width, height: maxHeight })
                    .toFile(fullPath2);
            } else return;
        } catch (err) {
            console.error('이미지 자르기 중 오류가 발생했습니다:', err);
        }
    }
    
    browser.close();

}

module.exports = {
    takeScreenshot
}