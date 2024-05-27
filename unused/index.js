// const puppeteer = require('puppeteer');
// const moment = require('moment');
// const carouselBreak = require ('./carouselBreak');
// const failChecker = require('./failChecker')

// const delay = (time) => {
//     return new Promise(function(resolve) {
//         setTimeout(resolve, time)
//     });
// }
// const takeScreenshot = async (siteCode) => {
//     const browser = await puppeteer.launch({
//         headless: true,
//         timeout: 100000
//     });

//     const page = await browser.newPage();

//     const url = `https://www.samsung.com/${siteCode}`;
//     await page.setViewport({ width: 360, height: 1000 });
//     await page.goto(url, {waitUntil: 'load'});

//     // Get the height of the rendered page
//     let bodyHandle = await page.$('body');
//     let body = await bodyHandle.boundingBox();
//     await page.setViewport({ width: Math.floor(body.width), height: Math.floor(body.height)});


//     //Click Cookie popup accept
//     // await page.click('.cookie-bar__close')

//     await carouselBreak.showcaseCardBreak(page)
//     await carouselBreak.kvCarouselBreak(page)



//     // await carouselBreak.eventListenerBreak(page)

//     const elementsWithEllipsis = await page.evaluate(() => {
//         const elements = document.querySelectorAll('.showcase-card-tab-card__product-name--mobile');
//         const elementsWithEllipsis = [];

//         elements.forEach(element => {
//             const style = window.getComputedStyle(element);
//             // const innerHtml = element.innerHTML
//             const defaultHeight = element.getBoundingClientRect().height
//             element.style.webkitLineClamp = '9999'
//             // element.webkitLineClamp = null
//             element.style.maxHeight = '99999px'
//             const afterHeight = element.getBoundingClientRect().height
//             const hasEllipsis = defaultHeight < afterHeight;


//             elementsWithEllipsis.push({
//                 tagName: element.tagName,
//                 className: element.className,
//                 id: element.id,
//                 textContent: element.textContent.trim(),
//                 lineHeight : style.lineHeight.substring(0,style.lineHeight.length-2),
//                 Height : element.getBoundingClientRect().height,
//                 '2 Lines' : Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight,
//                 'Ellipsis' : hasEllipsis

//             });

//         });
//         return elementsWithEllipsis;
//     });
//     console.table(elementsWithEllipsis);
//     const failedData= [""]
//     for (let i = 0; i < failedData.length; i++){
//         await failChecker.checkFailData(page,failedData[i])
//     }

//     const dateNow = moment().format("YYYY-MM-DD_HH-mm-ss")
//     const fileName = `C:\\Users\\PTK\\Desktop\\CODE\\weekly_capture_v0.0.2\\result\\${siteCode}-${dateNow}-screenshot.png`

//     // await page.screenshot({ path: fileName, fullPage:true});
//     browser.close();
// }
// const siteCode = 'cz'

// takeScreenshot(siteCode);