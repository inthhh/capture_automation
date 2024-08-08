const { Builder, By } = require('selenium-webdriver');
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
const Jimp = require('jimp');

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

/**
 * Home 페이지를 캡쳐합니다. (Mobile ver)
 * @param {string} siteCode 
 * @param {date} dataDate 
 * @returns 
 */
const takeScreenshot = async (siteCode, dataDate) => {
    console.log("-----", siteCode, "-----");

    const url = `https://www.samsung.com/${siteCode}`;

    let mainWidth = 360;
    let mainHeight = 6000;

    let mobileEmulation = {
        deviceMetrics: {
            width: 360,
            height: 6000,
            pixelRatio: 1
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };

    let options = new chrome.Options();
    options.setMobileEmulation(mobileEmulation);
    options.addArguments('disable-dev-shm-usage');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get(url);
        await delay(5000);
        await driver.manage().window().setRect({ width: mainWidth, height: mainHeight });

        if (siteCode === "sec") {
            await delay(5000);
            await secBreak.buttonBreak(driver);
            await delay(10000);
            await popupBreak.cookiePopupBreaker(driver, false);
            console.log('is sec');
            await secBreak.kvCarouselBreak(driver, false);
            await delay(5000);
            await secBreak.contentsToLeft(driver);
            await delay(5000);
            await secBreak.showcaseCardBreak(driver);
            await carouselBreak.eventListenerBreak(driver);
            await delay(5000);

            const badgeData = await getSecRawData(dataDate, siteCode);
            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile");

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(driver, failedData[i], true, badgeData);
                }
            }
            await delay(5000);
            console.log('out sec');
        } else {
            await delay(4000);
            await popupBreak.cookiePopupBreaker(driver, false);
            await delay(2000);
            await popupBreak.clickEveryMerchan(driver);
            await popupBreak.clickFirstMerchan(driver);
            await popupBreak.removeIframe(driver);
            await delay(5000);
            await carouselBreak.carouselBreakMobile(driver);
            await delay(10000);
            await popupBreak.accessibilityPopupBreaker(driver);
            await carouselBreak.eventListenerBreakMobile(driver);
            await delay(1000);

            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile");

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await failChecker.checkFailData(driver, failedData[i], true);
                }
            }
        }

        const dateNow = moment().format("YYMMDD");
        const date = new Date();
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile`;
        const fileName = `W${weekNumber}_Screenshot_mobile_${dateNow}(${siteCode}).jpeg`;
        fs.mkdirSync(pathName, { recursive: true });

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

        await driver.manage().window().setRect({ width: mainWidth, height: totalHeight });

        let screenshots = [];
        let screenshotFiles = [];

        if (['ae_ar', 'il', 'ps', 'sa', 'iran', 'levant_ar', 'iq_ar', 'eg', 'iq_ku'].includes(siteCode)) {
            for (let scrollLeft = totalWidth - mainWidth; scrollLeft > -mainWidth; scrollLeft -= mainWidth) {
                console.log(scrollLeft);
                if (scrollLeft < 0) {
                    scrollLeft = 0;
                }
                await driver.executeScript(`window.scrollTo(-${scrollLeft}, 0);`);
                await driver.sleep(2000);
                let screenshot = await driver.takeScreenshot();
                screenshots.push(Buffer.from(screenshot, 'base64'));
                if (scrollLeft === 0) break;
            }
        } else if(['sec'].includes(siteCode)){
            await driver.executeScript(`
                document.body.style.transform = 'translateX(0px)';
                document.body.style.transition = 'transform 0.5s ease';
            `);
        
            // Scroll to the right
            for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += mainWidth) {
                await driver.executeScript(`
                    document.body.style.transform = 'translateX(-${scrollLeft}px)';
                `);
                console.log(scrollLeft);
                await driver.sleep(3000); // Wait for the scroll effect to complete
                let screenshot = await driver.takeScreenshot();
                let viewportWidth = await driver.executeScript('return window.innerWidth;');
                console.log("Viewport Width: ", viewportWidth);
                console.log("total: ", totalWidth);
                console.log("main: ", mainWidth);
                console.log("scrollLeft: ", scrollLeft);
                let pageWidth = await driver.executeScript('return document.documentElement.scrollWidth;');
                console.log('Page Width:', pageWidth);
                screenshots.push(Buffer.from(screenshot, 'base64'));
            }
            await delay(2000);
        } else {
            for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += mainWidth) {
                console.log(scrollLeft);
                await driver.executeScript(`
                    const scrollableElement = document.querySelector('html');
                    if (scrollableElement) {
                        scrollableElement.scrollTo({
                            left: ${scrollLeft},
                            top: 0,
                            behavior: 'auto'
                        });
                    }
                `);
                await driver.sleep(3000);
                let screenshot = await driver.takeScreenshot();
                console.log('Page Width:', pageWidth);
                screenshots.push(Buffer.from(screenshot, 'base64'));
            }
            await delay(2000);
        }

        for (let i = 0; i < screenshots.length; i++) {
            let tempPath = path.join(pathName, `temp_screenshot_part_${i}.png`);
            fs.writeFileSync(tempPath, screenshots[i]);

            let finalPath = path.join(pathName, `screenshot_part_${i}.png`);

            if (i === screenshots.length - 1 && (totalWidth % mainWidth !== 0)) {
                let remainingWidth = totalWidth % mainWidth;
                await sharp(tempPath)
                    .extract({ left: mainWidth - remainingWidth, top: 0, width: remainingWidth, height: mainHeight })
                    .toFile(finalPath);
            } else {
                fs.renameSync(tempPath, finalPath);
            }

            screenshotFiles.push(finalPath);
        }

        mergeImg(screenshotFiles, { direction: false })
            .then((image) => {
                let tempMergedPath = path.join(pathName, 'temp_merged_image.png');
                image.write(tempMergedPath, async () => {
                    console.log('Temporary merged image saved.');

                    let captureImage = await Jimp.read(tempMergedPath);
                    captureImage.quality(60);
                    await captureImage.writeAsync(path.join(pathName, fileName));

                    fs.unlinkSync(tempMergedPath);
                    console.log('Full page screenshot saved');
                });
            })
            .catch((err) => {
                console.error('Error merging images:', err);
            });

    } finally {
        await driver.quit();
    }
}

module.exports = {
    takeScreenshot
}
