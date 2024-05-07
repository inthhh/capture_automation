const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');
const failChecker = require("./failChecker");
const getRawData = require("./api")

const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const takeScreenshot = async (siteCode) => {
    const browser = await puppeteer.launch({
        headless: true,
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
    // await page.click('.cookie-bar__close')
    // console.log("bodyHandel", bodyHandle)
    // console.log("body", body)
    const failedData = await getRawData("2024-04-29", siteCode = "cz", "N")
    await carouselBreak.carouselBreakMobile(page)

    await delay(40000)

    await carouselBreak.eventListenerBreak(page)

    // const failedData = await getRawData("2024-04-29", siteCode = "cz", "N")

    // const failedImage= ["images.samsung.com/is/image/samsung/assets/uk/homepage/LT_DT_684x684_TV-PreOrder-S242.jpg"]
    // failedImage -> failedData
    for (let i = 0; i < failedData.length; i++){
        console.log("failChecker")
        await failChecker.checkFailData(page, failedData[i])
    }

    const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")

    const fileName = `.\\result\\test\\${siteCode}-${dateNow}-mobile-screenshot.png`

    await page.screenshot({ path: fileName, fullPage: true,type:'jpeg', quality:10});
    browser.close();

}

// takeScreenshot('lb');

module.exports = {
    takeScreenshot
}