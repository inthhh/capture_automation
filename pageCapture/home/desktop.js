const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('../capture-utils/carouselBreak');
const secFailChecker = require("../capture-utils/secFailChecker");
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData");
const popupBreak = require("../capture-utils/popupBreak");
const secBreak = require("../capture-utils/secBreak");
const fs = require('node:fs');
const path = require('node:path')
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
    await page.setViewport({ width: 1440, height: 10000 });
    await delay(2000)
    await page.setDefaultTimeout(200000);
    await page.goto(url, { waitUntil: 'load', timeout: 200000 });
    await delay(2000)
    
    let bodyHandle = await page.$('body');
    let body = await bodyHandle.boundingBox();
    
    if(siteCode === "sec"){
        await page.setViewport({ width: 1440*7, height: 6500});
        
        await delay(10000)
        // await popupBreak.cookiePopupBreaker(page, false)
        await carouselBreak.eventListenerBreak(page)
        await delay(5000)
        await popupBreak.removeIframe(page)
        console.log('is sec')
        await delay(10000)
        await secBreak.kvCarouselBreak(page, true)
        await delay(5000)
        await secBreak.contentsToLeft(page)
        await delay(10000)
        await secBreak.showcaseCardBreak(page)
        await delay(10000)

        const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

        if(failedData && failedData.length>0){
            for (let i = 0; i < failedData.length; i++){
                await secFailChecker.checkFailData(page, failedData[i], false)
            }
        }
        
        console.log('out sec')
    }
    else{
        await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});
        await delay(4000)
        await popupBreak.cookiePopupBreaker(page, true)
        // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
        await delay(2000)

        await popupBreak.clickEveryMerchan(page)
        await popupBreak.clickFirstMerchan(page)

        await popupBreak.removeIframe(page)
        await carouselBreak.kvCarouselBreak(page)
        await delay(5000)
        await carouselBreak.showcaseCardBreak(page)
        await delay(10000)
        await popupBreak.accessibilityPopupBreaker(page)
        await carouselBreak.eventListenerBreak(page)
    
    
        await delay(1000)

        const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

        if(failedData && failedData.length>0){
            for (let i = 0; i < failedData.length; i++){
                await failChecker.checkFailData(page, failedData[i], false)
            }
        }

    }
    
    const dateNow = moment().format("YYMMDD")
    const date = new Date()
    const weekNumber = getWeekNumber(date);
    const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/desktop`
    const fileName =`W${weekNumber}_Screenshot_desktop_${dateNow}(${siteCode}).jpeg`
    fs.mkdirSync(pathName, { recursive: true });
    await page.screenshot({ path: `${pathName}/${fileName}`, fullPage: true, type: 'jpeg', quality: 30});

    // browser.close();

}

module.exports = {
    takeScreenshot
}