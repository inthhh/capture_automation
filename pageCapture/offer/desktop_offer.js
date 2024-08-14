// const puppeteer = require('puppeteer');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const moment = require('moment');
const carouselBreak_offer = require('../capture-utils/carouselBreak_offer');
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData")
const popupBreak = require("../capture-utils/popupBreak")
const fs = require('node:fs');
const path = require('node:path')
const { getWeekNumber } = require('../result-utils/getWeekNumber')

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
/**
 * Offer 페이지를 캡쳐합니다. (Desktop ver)
 * @param {string} siteCode 
 * @param {date} dataDate 
 */
const takeScreenshot = async (siteCode, dataDate) => {

    console.log("---", siteCode, ":offer ---");

    const url = `https://www.samsung.com/${siteCode}/offer`;

    // 브라우저 옵션 설정
    let options = new chrome.Options();
    options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.addArguments('headless');
    options.addArguments('disable-gpu');
    options.addArguments('disable-dev-shm-usage');
    options.addArguments('--remote-debugging-port=9222'); // 원격 디버깅 활성화
    options.addArguments('--ignore-certificate-errors'); // SSL 인증서 오류 무시
    options.addArguments('--allow-insecure-localhost'); // 비보안(HTTP) 요청 허용

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 화면 크기 설정
        await driver.manage().window().setRect({ width: 1440, height: 15000 });
        await delay(1000)
        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        await driver.get(url);
        await delay(1000)

        let bodyElement = await driver.findElement(By.css('body'));
        let rect = await bodyElement.getRect();
        let width_ = await driver.executeScript(`
            return Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth
            );
        `);
        let height_ = await driver.executeScript(`
            return Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight
            );
        `);
        await driver.manage().window().setRect({ width: width_, height: height_ });
        await delay(1000)
        await popupBreak.cookiePopupBreaker(driver, false)
        await delay(10000)
        await popupBreak.removeIframe(driver)
        await carouselBreak_offer.kvCarouselBreak(driver)
        await delay(10000)
        await carouselBreak_offer.viewmoreBreak(driver)
        await carouselBreak_offer.cardCarouselBreak(driver)

        await delay(10000)

        // const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

        // if(failedData && failedData.length>0){
        //     for (let i = 0; i < failedData.length; i++){
        //         await failChecker.checkFailData(driver,failedData[i])
        //     }
        // }

        await popupBreak.accessibilityPopupBreaker(driver)
        await carouselBreak_offer.eventListenerBreak(driver, true)

        const dateNow = moment().format("YYMMDD")
        const date = new Date()
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/desktop_offer`
        const fileName = `W${weekNumber}_Screenshot_desktop_offer_${dateNow}(${siteCode}).jpeg`
        fs.mkdirSync(pathName, { recursive: true });

        width_ = await driver.executeScript(`
            return Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth
            );
        `);
        let totalHeight = await driver.executeScript(`
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
            );
        `);
        await driver.manage().window().setRect({ width: width_, height: totalHeight });
        delay(1000);
        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync(`${pathName}/${fileName}`, screenshot, 'base64');

    } finally {
        await driver.quit();
    }

}

module.exports = {
    takeScreenshot
}