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
const Jimp = require('jimp');

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

    let mainWidth = 360;
    let mainHeight = 8000;

    // 브라우저 옵션 설정
    let mobileEmulation = {
        deviceMetrics: {
            width: 360,
            height: 8000,
            pixelRatio: 1
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };

    let options = new chrome.Options();
    // options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    if(process.env.CHROME_BINARY_PATH) {options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);}
    options.setMobileEmulation(mobileEmulation);
    options.addArguments('headless');
    options.addArguments('disable-gpu');
    options.addArguments('--no-sandbox')
    options.addArguments('disable-dev-shm-usage');
    options.addArguments('--disable-extensions');  // 확장 프로그램 비활성화
    options.addArguments('--disable-logging');  // 로그 레벨 조정
    options.addArguments('--force-device-scale-factor=1'); // 배율 100%로 고정
    

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    if(process.env.CHROME_DRIVER_PATH){
        const service = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);
        driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .setChromeOptions(options)
        .build();
    }

    try {
        await driver.get(url);
        await delay(5000);
        await driver.manage().window().setRect({ width: mainWidth, height: mainHeight });

        // 페이지 이동 (= puppeteer goto, 타임아웃 설정 포함), 여기서 waitUntil: 'load'는 기본적으로 수행됨
        await driver.get(url);
        await delay(1000);

        if (siteCode === "sec") {

            await delay(2000)
            await secBreak.buttonBreak(driver)
            await delay(2000)
            await popupBreak.cookiePopupBreaker(driver, false)
            // await popupBreak.removeIframe(page) // 당분간 사용 X
            await secBreak.kvCarouselBreak(driver, false)
            await delay(2000)
            await secBreak.contentsToLeft(driver)
            await delay(5000)
            await secBreak.showcaseCardBreak(driver)
            // await carouselBreak.eventListenerBreak(driver)
            await delay(2000)

            const badgeData = await getSecRawData(dataDate, siteCode);

            const failedData = await getRawData(dataDate, siteCode, "N", "Mobile");

            if (failedData && failedData.length > 0) {
                for (let i = 0; i < failedData.length; i++) {
                    await secFailChecker.checkFailData(driver, failedData[i], true, badgeData)
                }
            }
            await delay(2000)
        }
        else { // global
            await delay(2000)
            await popupBreak.cookiePopupBreaker(driver, false)
            // 사이트가 새로고침되며 팝업이 다시 뜨는 경우, popupBreaker 한번 더 실행 필요
            await delay(2000)

            await popupBreak.clickEveryMerchan(driver)
            await popupBreak.clickFirstMerchan(driver)

            await popupBreak.removeIframe(driver)
            await delay(2000)
            await carouselBreak.carouselBreakMobile(driver)
            await delay(2000)
            await popupBreak.accessibilityPopupBreaker(driver)
            await carouselBreak.eventListenerBreakMobile(driver)

            await delay(2000)

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

        await driver.manage().window().setRect({ width: mainWidth, height: totalHeight });

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
        let footer = await driver.findElement(By.css('footer'));
        let footerLocation = await footer.getRect();
        let remainingWidth = 0;
        let screenshots = [];
        let screenshotFiles = [];

        // 1. RTL 국가일 경우
        if (siteCode == 'ae_ar' || siteCode == 'il' || siteCode == 'ps' || siteCode == 'sa' || siteCode == 'iran' || siteCode == 'levant_ar' || siteCode == 'iq_ar' || siteCode == 'eg' || siteCode == 'iq_ku') {
            for (let scrollLeft = totalWidth - mainWidth; scrollLeft > -mainWidth; scrollLeft -= mainWidth) {
                
                if (scrollLeft < 0) {
                    remainingWidth = (-1) * scrollLeft;
                    scrollLeft = 0;
                }
                await driver.executeScript(`window.scrollTo(-${scrollLeft}, 0);`); // RTL 음수값 스크롤
                await driver.sleep(2000);  // 페이지가 스크롤될 시간
                let screenshot = await driver.takeScreenshot();
                screenshots.push(Buffer.from(screenshot, 'base64'));
                if (scrollLeft == 0) break;
            }
            // 각 스크린샷을 파일로 저장
            for (let i = 0; i < screenshots.length; i++) {
                let tempPath = path.join(pathName, `temp_screenshot_part_${i}.png`);
                fs.writeFileSync(tempPath, screenshots[i]);

                let finalPath = path.join(pathName, `screenshot_part_${i}.png`);

                if (i === screenshots.length - 1 && (totalWidth % mainWidth !== 0)) {
                    // 마지막 스크린샷을 자름
                    let remainingWidth = totalWidth % mainWidth;
                    await sharp(tempPath)
                        .extract({ left: mainWidth - remainingWidth, top: 0, width: remainingWidth, height: mainHeight })
                        .toFile(finalPath);
                } else {
                    fs.renameSync(tempPath, finalPath);
                }

                screenshotFiles.push(finalPath);
            }

        }
        else if (siteCode == "sec") {
            await driver.executeScript(`
                document.body.style.transform = 'translateX(0px)';
                document.body.style.transition = 'transform 0.5s ease';
            `);

            // Scroll to the right
            for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += mainWidth) {
                await driver.executeScript(`
                    document.body.style.transform = 'translateX(-${scrollLeft}px)';
                `);
                await driver.sleep(3000); // Wait for the scroll effect to complete
                let screenshot = await driver.takeScreenshot();
                let viewportWidth = await driver.executeScript('return window.innerWidth;');
                let pageWidth = await driver.executeScript('return document.documentElement.scrollWidth;');
                screenshots.push(Buffer.from(screenshot, 'base64'));
            }
            for (let i = 0; i < screenshots.length; i++) {
                let tempPath = path.join(pathName, `temp_screenshot_part_${i}.png`);
                fs.writeFileSync(tempPath, screenshots[i]);

                let finalPath = path.join(pathName, `screenshot_part_${i}.png`);

                fs.renameSync(tempPath, finalPath);

                screenshotFiles.push(finalPath);
            }
        }
        else { // 2. RTL 외의 모든 국가

            for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += mainWidth) {
                if (totalWidth - scrollLeft < mainWidth) {
                    remainingWidth = totalWidth - scrollLeft;
                }
                await driver.executeScript(`
                    const scrollableElement = document.querySelector('html');
                    if (scrollableElement) {
                        scrollableElement.scrollTo({
                            left: ${scrollLeft},
                            top: 0,
                            behavior: 'smooth'
                        });
                    }`)
                await driver.sleep(3000);  // 페이지가 스크롤될 시간
                let screenshot = await driver.takeScreenshot();
                screenshots.push(Buffer.from(screenshot, 'base64'));
            }
            await delay(2000);
            // 각 스크린샷을 파일로 저장
            for (let i = 0; i < screenshots.length; i++) {
                let tempPath = path.join(pathName, `temp_screenshot_part_${i}.png`);
                fs.writeFileSync(tempPath, screenshots[i]);

                let finalPath = path.join(pathName, `screenshot_part_${i}.png`);

                if (i === screenshots.length - 1 && (totalWidth % mainWidth !== 0)) {
                    await sharp(tempPath)
                        .extract({ left: mainWidth - remainingWidth, top: 0, width: remainingWidth, height: mainHeight })
                        .toFile(finalPath);
                } else {
                    fs.renameSync(tempPath, finalPath);
                }

                screenshotFiles.push(finalPath);
            }
        }


        // 수평 병합 - mergeImg를 사용하여 병합
        mergeImg(screenshotFiles, { direction: false })
            .then((image) => {
                // 병합된 이미지를 임시 파일로 저장
                let tempMergedPath = path.join(pathName, `${siteCode}_temp_merged.png`);
                image.write(tempMergedPath, async () => {
                    console.log('Temporary merged image saved.');

                    // Jimp로 임시 파일을 읽고 품질을 조절한 후 최종 파일로 저장
                    let captureImage = await Jimp.read(tempMergedPath);

                    const width = captureImage.getWidth();
                    const height = footerLocation.y;
                    captureImage.crop(0, 0, width, height);
                    captureImage.quality(60); // 화질 60% (0-100 사이의 값)
                    await captureImage.writeAsync(path.join(pathName, fileName));

                    // 임시 파일 삭제
                    fs.unlinkSync(tempMergedPath);
                    console.log(siteCode, ': Full page screenshot saved');
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