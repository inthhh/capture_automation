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
            height: 6000, // Custom height
            pixelRatio: 0.8
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    
    let options = new chrome.Options();
    // options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.setMobileEmulation(mobileEmulation);
    options.addArguments('headless');
    options.addArguments('disable-gpu');
    options.addArguments('disable-dev-shm-usage');

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(url);
        await delay(5000);
        await driver.manage().window().setRect({ width: 360, height: 6000 });

        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        // await driver.get(url);
        await delay(1000);

        if (siteCode === "sec") { // selenium 적용하지 않음

            await delay(10000)
            await carouselBreak.eventListenerBreak(driver)
            await secBreak.buttonBreak(driver)
            await delay(10000)
            // await popupBreak.cookiePopupBreaker(page, false)
            // await popupBreak.removeIframe(page)
            console.log('is sec')
            await secBreak.kvCarouselBreak(driver, false)
            await delay(5000)
            // await secBreak.contentsToLeft(driver)
            await delay(5000)
            await secBreak.showcaseCardBreak(driver)

            await delay(5000)

            const badgeData = await getSecRawData(dataDate, siteCode);

            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile");

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(driver, failedData[i], true, badgeData)
                }
            }
            await delay(5000)
            console.log('out sec')
        }
        else { // global
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

        const dateNow = moment().format("YYMMDD")
        const date = new Date()
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile`
        const fileName = `W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode}).jpeg`
        fs.mkdirSync(pathName, { recursive: true });

        let bodyHandle = await driver.findElement(By.css('body'));
        let bodyRect = await bodyHandle.getRect();

        let totalHeight = await driver.executeScript(`
            return Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
        `);
        
        await driver.manage().window().setRect({ width: 360, height: totalHeight });

        let totalWidth = await driver.executeScript(`
            return Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.body.clientWidth,
                document.documentElement.clientWidth
            );
        `);
        // await driver.manage().window().setRect({ width: 360, height: totalHeight });
        // 가로 스크롤 및 스크린샷
        let screenshots = [];
        for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += 360) {
            await driver.executeScript(`window.scrollTo(${scrollLeft}, 0);`);
            await driver.sleep(5000);  // 페이지가 스크롤될 시간
            let screenshot = await driver.takeScreenshot();
            screenshots.push(Buffer.from(screenshot, 'base64'));
        }

        // 각 스크린샷을 파일로 저장
        let screenshotFiles = [];
        for (let i = 0; i < screenshots.length; i++) {
            let screenshotPath = path.join(pathName, `screenshot_part_${i}.png`);
            fs.writeFileSync(screenshotPath, screenshots[i]);
            screenshotFiles.push(screenshotPath);
        }

        // 수평 병합 - mergeImg를 사용하여 병합
        mergeImg(screenshotFiles, { direction: false })
            .then((image) => {
                image.write(path.join(pathName, `${fileName}`), () => {
                    console.log('Full page screenshot saved.');
                });
            })
            .catch((err) => {
                console.error('Error merging images:', err);
            });

        // let screenshot = await driver.takeScreenshot();
        // fs.writeFileSync(`${pathName}/${fileName}`, screenshot, 'base64');
        
        const fileName2 = `W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode})_cutting.jpeg`
        const fullPath2 = `${pathName}/${fileName2}`;

        // if (siteCode == 'it') {
        //     try {
        //         const maxHeight = 12000;
        //         const sharp = require('sharp');
        //         const metadata = await sharp(`${pathName}/${fileName}`).metadata();
        //         const height = metadata.height;

        //         if (height > maxHeight) {
        //             await sharp(fullPath)
        //                 .extract({ left: 0, top: 0, width: metadata.width, height: maxHeight })
        //                 .toFile(fullPath2);
        //         } else return;
        //     } catch (err) {
        //         console.error('이미지 자르기 중 오류가 발생했습니다:', err);
        //     }
        // }

    } finally {
        await driver.quit();
    }

}

module.exports = {
    takeScreenshot
}