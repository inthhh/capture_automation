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
    // options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.addArguments('headless');
    options.addArguments('disable-gpu');
    options.addArguments('disable-dev-shm-usage');
    options.addArguments('--no-sandbox')
    options.addArguments('--disable-extensions');  // 확장 프로그램 비활성화
    options.addArguments('--disable-logging');  // 로그 레벨 조정
    options.addArguments('--force-device-scale-factor=1'); // 배율 100%로 고정


    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 페이지 로드 타임아웃 설정 (30초)
        await driver.manage().setTimeouts({ pageLoad: 30000 });

        // 스크립트 실행 타임아웃 설정 (30초)
        await driver.manage().setTimeouts({ script: 30000 });

        await driver.get(url);
        // 화면 크기 설정
        await driver.executeScript(`
            document.querySelector('html').style.zoom = '100%';
        `);
        await driver.manage().window().setRect({ width: 1440, height: 10000 });
        await delay(1000)
        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        // await driver.get(url);

        let bodyElement = await driver.findElement(By.css('body'));
        let rect = await bodyElement.getRect();

        if (siteCode === "sec") {
            await delay(2000)
            await popupBreak.cookiePopupBreaker(driver, false)
            await carouselBreak.eventListenerBreak(driver)
            await secBreak.buttonBreak(driver)
            console.log('is sec')
            await delay(2000)
            await secBreak.kvCarouselBreak(driver, true)
            await delay(2000)
            await secBreak.contentsToLeft(driver)
            await delay(5000)
            await secBreak.showcaseCardBreak(driver)

            const failedData = await getRawData(dataDate, siteCode, "N", "Desktop")

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(driver, failedData[i], false) // secFailChecker 내부 함수 - 수정 필요
                }
            }
            await delay(2000)
            console.log('out sec')
        }
        else { // 글로벌 캡쳐
            await delay(2000)
            await popupBreak.cookiePopupBreaker(driver, true)
            // // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
            await delay(2000)

            await popupBreak.clickEveryMerchan(driver)
            await popupBreak.clickFirstMerchan(driver)

            await popupBreak.removeIframe(driver)
            await carouselBreak.kvCarouselBreak(driver)
            await delay(2000)
            await carouselBreak.showcaseCardBreak(driver)
            await delay(2000)
            await popupBreak.accessibilityPopupBreaker(driver)
            await carouselBreak.eventListenerBreak(driver)

            await delay(2000)

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

        let totalHeight = await driver.executeScript(`
            const zoomLevel = window.devicePixelRatio;
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            ) * zoomLevel;
        `);
        
        let totalWidth = await driver.executeScript(`
            const zoomLevel = window.devicePixelRatio;
            return Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.body.clientWidth,
                document.documentElement.clientWidth
            ) * zoomLevel;
        `);
        
        await driver.manage().window().setRect({ width: totalWidth, height: totalHeight });
        let footer = await driver.findElement(By.css('footer'));
        let footerLocation = await footer.getRect();
        const height = footerLocation.y;

        let screenshot = await driver.takeScreenshot();

        let captureImage = await Jimp.read(Buffer.from(screenshot, 'base64'));
        console.log("높이", totalHeight, captureImage.getHeight(), height,'\n너비', totalWidth, captureImage.getWidth())

        await captureImage.crop(0, 0, captureImage.getWidth(), height);
        await captureImage.quality(30); // 화질 (0-100 사이의 값)
        await captureImage.getBufferAsync(Jimp.MIME_JPEG).then(buffer => {
            fs.writeFileSync(`${pathName}/${fileName}`, buffer);
        });

    } finally {
        await driver.quit();
    }
}

module.exports = {
    takeScreenshot
}