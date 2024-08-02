// const puppeteer = require('puppeteer');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const moment = require('moment');
const carouselBreak = require('../capture-utils/carouselBreak');
const secFailChecker = require("../capture-utils/secFailChecker");
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData")
const popupBreak = require("../capture-utils/popupBreak")
const secBreak = require("../capture-utils/secBreak");
const getSecRawData = require("../capture-utils/secRawData");
const fs = require('fs');
const path = require('node:path');
const sharp = require('sharp');
const { getWeekNumber } = require('../result-utils/getWeekNumber')
const mergeImg = require('merge-img');

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
/**
 * Home 페이지를 캡쳐합니다. (Mobile ver)
 * @param {string} siteCode 
 * @param {date} dataDate 
 * @returns 
 */
const takeScreenshot = async (siteCode, dataDate) => {

    console.log("-----", siteCode, "-----");

    const url = `https://www.samsung.com/${siteCode}`;

    // 브라우저 옵션 설정
    // let mobileEmulation = { deviceName: 'iPhone X' };
    let mobileEmulation = {
        deviceMetrics: {
            width: 360,
            height: 3000, // Custom height
            pixelRatio: 3
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    let options = new chrome.Options();
    // options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.setMobileEmulation(mobileEmulation);
    // options.addArguments('headless');
    // options.addArguments('disable-gpu');
    // options.addArguments('disable-dev-shm-usage');

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(url);
        // 화면 크기 설정
        await driver.manage().window().setRect({ width: 360, height: 3000 });

        // await driver.manage().window().setRect({ width: 1200, height: 800 });
        await delay(2000)
        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        await driver.get(url); // 
        await delay(1000);
        await driver.get(url);

        await delay(1000)
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

        if (siteCode === "sec") { // selenium 적용하지 않음
            await page.setViewport({ width: 360, height: 6000 });

            await delay(10000)
            await carouselBreak.eventListenerBreak(page)
            await secBreak.buttonBreak(page)
            await delay(10000)
            // await popupBreak.cookiePopupBreaker(page, false)
            // await popupBreak.removeIframe(page)
            console.log('is sec')
            await secBreak.kvCarouselBreak(page, false)
            await delay(5000)
            await secBreak.contentsToLeft(page)
            await delay(5000)
            await secBreak.showcaseCardBreak(page)

            await delay(5000)

            const badgeData = await getSecRawData(dataDate, siteCode);

            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile");

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(page, failedData[i], true, badgeData)
                }
            }
            await delay(5000)
            console.log('out sec')
        }
        else { // global
            // await driver.manage().window().setRect({ width: width_, height: height_ });
            await delay(4000)
            await popupBreak.cookiePopupBreaker(driver, false)
            // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
            await delay(2000)

            await popupBreak.clickEveryMerchan(driver)
            await popupBreak.clickFirstMerchan(driver)

            await popupBreak.removeIframe(driver)
            await delay(5000)
            await carouselBreak.carouselBreakMobile(driver)
            await delay(10000)
            await popupBreak.accessibilityPopupBreaker(driver)
            await carouselBreak.eventListenerBreakMobile(driver)

            await delay(1000)

            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile")
            
            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await failChecker.checkFailData(driver, failedData[i], true)
                }
            }
        }

        // width_ = await driver.executeScript(`
        //     return Math.max(
        //         document.body.scrollWidth,
        //         document.body.offsetWidth
        //     );
        // `);

        const dateNow = moment().format("YYMMDD")
        const date = new Date()
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile`
        const fileName = `W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode}).jpeg`
        fs.mkdirSync(pathName, { recursive: true });

        let bodyHandle = await driver.findElement(By.tagName('body'));
        let bodyRect = await bodyHandle.getRect();
        let viewportHeight = 800;  // 원하는 높이로 조정
        let viewportWidth = 360;
        let totalWidth = bodyRect.width;
        let totalHeight = bodyRect.height;

        // 이동하면서 분할 캡쳐
        // await driver.manage().window().setRect({ width: 360, height: 3000 });
        // let screenshots = [];
        // for (let scrollLeft = 0; scrollLeft < 2000; scrollLeft += 360) {
        //     await driver.executeScript(`window.scrollTo(${scrollLeft}, 0);`);
        //     await driver.sleep(5000);  // 페이지가 스크롤될 시간
        //     let screenshot = await driver.takeScreenshot();
        //     screenshots.push(Buffer.from(screenshot, 'base64'));
        // }

        // 각 스크린샷을 파일로 저장
        // let screenshotFiles = [];
        // for (let i = 0; i < screenshots.length; i++) {
        //     let screenshotPath = path.join(`${pathName}`, `screenshot_part_${i}.png`);
        //     fs.writeFileSync(screenshotPath, screenshots[i]);
        //     screenshotFiles.push(screenshotPath);
        // }
        // 수평 병합 - 아직 안됨
        // mergeImg(screenshotFiles, { direction: false }, (err, image) => {
        //     if (err) {
        //         console.error('Error merging images:', err);
        //         return;
        //     }
        //     image.write(path.join(`${pathName}`, 'fullpage_screenshot.png'), () => {
        //         console.log('Full page screenshot saved.');
        //     });
        // });

        let screenshot = await driver.takeScreenshot();
        fs.writeFileSync(`${pathName}/${fileName}`, screenshot, 'base64');
        
        const fileName2 = `W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode})_cutting.jpeg`
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

    } finally {
        await driver.quit();
    }

}

module.exports = {
    takeScreenshot
}