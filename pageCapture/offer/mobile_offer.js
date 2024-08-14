// const puppeteer = require('puppeteer');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const moment = require('moment');
const carouselBreak_offer = require('../capture-utils/carouselBreak_offer');
const failChecker = require("../capture-utils/failChecker");
const getRawData = require("../capture-utils/getRawData")
const popupBreak = require("../capture-utils/popupBreak")
const fs = require('node:fs');
const path = require('node:path');
const { getWeekNumber } = require('../result-utils/getWeekNumber');
const sharp = require('sharp');
const mergeImg = require('merge-img');

const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
/**
 * Offer 페이지를 캡쳐합니다. (Mobile ver)
 * @param {string} siteCode 
 * @param {date} dataDate 
 */
const takeScreenshot = async (siteCode, dataDate) => {

    console.log("---", siteCode, ": offer ---");

    const url = `https://www.samsung.com/${siteCode}/offer`;

    let mainWidth = 360;
    let mainHeight = 20000;

    // 브라우저 옵션 설정
    let mobileEmulation = {
        deviceMetrics: {
            width: 360,
            height: 20000,
            pixelRatio: 1
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };

    let options = new chrome.Options();
    // options.addArguments('--start-maximized'); // 창을 최대화하여 시작
    options.setMobileEmulation(mobileEmulation);
    options.addArguments('headless');
    options.addArguments('disable-gpu');
    options.addArguments('disable-dev-shm-usage');
    // options.addArguments('--remote-debugging-port=9222'); // 원격 디버깅 활성화
    options.addArguments('--ignore-certificate-errors'); // SSL 인증서 오류 무시
    options.addArguments('--allow-insecure-localhost'); // 비보안(HTTP) 요청 허용

    // 드라이버 빌드
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // 화면 크기 설정
        await driver.get(url);
        await delay(1000)

        await popupBreak.cookiePopupBreaker(driver, false)
        await delay(2000)
        await popupBreak.removeIframe(driver)
        await carouselBreak_offer.kvMobileCarouselBreak(driver)
        await delay(2000)
        await carouselBreak_offer.viewmoreBreak(driver)
        await carouselBreak_offer.cardCarouselBreak(driver)
        await delay(5000)

        await popupBreak.accessibilityPopupBreaker(driver)
        await carouselBreak_offer.eventListenerBreak(driver, false)

        // const failedData = await getRawData(dataDate, siteCode, "N", "Mobile")
        // if(failedData && failedData.length>0){
        //     for (let i = 0; i < failedData.length; i++){
        //         await failChecker.checkFailData(page,failedData[i])
        //     }
        // }

        const dateNow = moment().format("YYMMDD")
        const date = new Date()
        const weekNumber = getWeekNumber(date);
        const pathName = `result/${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}/mobile_offer`
        const fileNameOrg = `W${weekNumber}_Screenshot_mobile_offer_${dateNow}(${siteCode})_original.jpeg`
        fs.mkdirSync(pathName, { recursive: true });

        let totalWidth = await driver.executeScript(`
            return Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
            );
        `);

        let footer = await driver.findElement(By.css('footer'));
        let footerLocation = await footer.getRect();  // 요소의 위치와 크기 가져오기

        // 가로 스크롤 및 스크린샷
        console.log("total : ", totalWidth)
        let remainingWidth = 0;
        let screenshots = [];
        let screenshotFiles = [];

        // 1. RTL 국가일 경우
        if (siteCode == 'ae_ar' || siteCode == 'il' || siteCode == 'ps' || siteCode == 'sa' || siteCode == 'iran' || siteCode == 'levant_ar' || siteCode == 'iq_ar' || siteCode == 'eg' || siteCode == 'iq_ku') {
            for (let scrollLeft = totalWidth - mainWidth; scrollLeft > -mainWidth; scrollLeft -= mainWidth) {
                console.log(scrollLeft);
                if (scrollLeft < 0) {
                    console.log(scrollLeft);
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
        else { // 2. RTL 외의 모든 국가
            for (let scrollLeft = 0; scrollLeft < totalWidth; scrollLeft += mainWidth) {
                console.log(scrollLeft);
                if (totalWidth - scrollLeft < mainWidth) {
                    console.log(totalWidth - scrollLeft);
                    remainingWidth = totalWidth - scrollLeft;
                }
                await driver.executeScript(`window.scrollTo(${scrollLeft}, 0);`);
                await driver.sleep(2000);  // 페이지가 스크롤될 시간
                let screenshot = await driver.takeScreenshot();
                screenshots.push(Buffer.from(screenshot, 'base64'));
            }

            // 각 스크린샷을 파일로 저장
            for (let i = 0; i < screenshots.length; i++) {
                let tempPath = path.join(pathName, `temp_screenshot_part_${i}.png`);
                fs.writeFileSync(tempPath, screenshots[i]);

                let finalPath = path.join(pathName, `screenshot_part_${i}.png`);

                if (i === screenshots.length - 1 && (totalWidth % mainWidth !== 0)) {
                    // 마지막 스크린샷을 자름
                    await sharp(tempPath)
                        .extract({ left: mainWidth - remainingWidth, top: 0, width: remainingWidth, height: mainHeight })
                        .toFile(finalPath);
                } else {
                    fs.renameSync(tempPath, finalPath);
                }

                screenshotFiles.push(finalPath);
            }
        }
        const fileName = `W${weekNumber}_Screenshot_mobile_offer_${dateNow}(${siteCode}).jpeg`
        // 수평 병합 - mergeImg를 사용하여 병합
        mergeImg(screenshotFiles, { direction: false })
            .then(async (image) => {
                const width = image.bitmap.width; // 기존 이미지의 너비
                const height = footerLocation.y;  // 자를 높이 (footer 윗부분까지)

                image.crop(0, 0, width, height)
                    .write(path.join(pathName, `${fileName}`), (err) => {
                        if (err) {
                            console.error('Error cropping image:', err);
                        } else {
                            console.log('Cropped screenshot saved.');
                        }
                    });

                // image.write(path.join(pathName, `${fileNameOrg}`), () => {
                //     console.log('Full page screenshot saved.');
                // });
            })
            .catch((err) => {
                console.error('Error merging images:', err);
            });

        // await driver2.quit();
    } finally {
        await driver.quit();
    }

}

module.exports = {
    takeScreenshot
}