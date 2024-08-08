// const puppeteer = require('puppeteer');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const moment = require('moment');
const carouselBreak = require('../capture-utils/carouselBreak');
const secFailChecker = require("../capture-utils/secFailChecker");
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData");
const popupBreak = require("../capture-utils/popupBreak");
const secBreak = require("../capture-utils/secBreak");
const fs = require('node:fs');
const path = require('node:path')
const { getWeekNumber } = require('../result-utils/getWeekNumber')
const Jimp = require('jimp');

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
/**
 * Home 페이지를 캡쳐합니다. (Desktop ver)
 * @param {string} siteCode 
 * @param {date} dataDate 
 */
const takeScreenshot = async (siteCode, dataDate) => {

    console.log("-----", siteCode, "-----");

    // const page = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}`;

    // 브라우저 옵션 설정
    let options = new chrome.Options();
    options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.addArguments('headless');

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(url);
        // 화면 크기 설정
        await driver.manage().window().setRect({ width: 1440, height: 10000 });
        await delay(2000)
        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        await driver.get(url); // 
        await delay(1000);
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
                document.body.scrollHeight
            );
        `);

        if (siteCode === "sec") {
            await driver.manage().window().setRect({ width: 1440 * 7, height: 6500 });
            await delay(10000)
            await popupBreak.cookiePopupBreaker(driver, false)
            await carouselBreak.eventListenerBreak(driver)
            await secBreak.buttonBreak(driver)
            console.log('is sec')
            await delay(5000)
            await secBreak.kvCarouselBreak(driver, true)
            await delay(5000)
            await secBreak.contentsToLeft(driver)
            await delay(10000)
            await secBreak.showcaseCardBreak(driver)

            const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(driver, failedData[i], false) // secFailChecker 내부 함수 - 수정 필요
                }
            }
            await delay(10000)
            console.log('out sec')
        }
        else { // 글로벌 캡쳐
            // await driver.set_window_size({ width: Math.floor(width_), height: Math.floor(height_) });
            await driver.manage().window().setRect({ width: width_, height: height_ });
            await delay(4000)
            await popupBreak.cookiePopupBreaker(driver, true)
            // // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
            await delay(2000)

            await popupBreak.clickEveryMerchan(driver)
            await popupBreak.clickFirstMerchan(driver)

            await popupBreak.removeIframe(driver)
            await carouselBreak.kvCarouselBreak(driver)
            await delay(5000)
            await carouselBreak.showcaseCardBreak(driver)
            await delay(10000)
            await popupBreak.accessibilityPopupBreaker(driver)
            await carouselBreak.eventListenerBreak(driver)

            await delay(1000)

            const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await failChecker.checkFailData(driver, failedData[i], false)
                }
            }

        }

        const dateNow = moment().format("YYMMDD")
        const date = new Date()
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/desktop`
        const fileName = `W${weekNumber}_Screenshot_desktop_${dateNow}(${siteCode}).jpeg`
        fs.mkdirSync(pathName, { recursive: true });

        width_ = await driver.executeScript(`
            return Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth
            );
        `);
        await driver.manage().window().setRect({ width: width_, height: height_ });
        let screenshot = await driver.takeScreenshot();
        let captureImage = await Jimp.read(Buffer.from(screenshot, 'base64'));
        await captureImage.quality(50); // 화질 50% (0-100 사이의 값)
        await captureImage.getBufferAsync(Jimp.MIME_JPEG).then(buffer => {
            fs.writeFileSync(`${pathName}/${fileName}`, buffer);
        });
        // fs.writeFileSync(`${pathName}/${fileName}`, captureImage, 'base64');

    } finally {
        await driver.quit();
    }
}

module.exports = {
    takeScreenshot
}