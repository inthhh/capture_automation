const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');
const failChecker = require('./failChecker')
const { ellipsisDetector } = require('./unused/ellipsisDetector')
const utility = require("./src/utility");

const db = require("./db")

const {Client} = require("pg");

require("dotenv").config();
const delay = (time) => {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}

const getToday = () =>{
    const today = new Date();


    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
    const day = String(today.getDate()).padStart(2, '0');


    return `${year}-${month}-${day}`;

}

const checkTextLineGuid = async (siteCode) => {
    const startTime = new Date()
    // console.log(`${startTime} : Check line length and Ellipsis in ${siteCode}`)
    // console.time("checkTextLineGuid")
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 100000
    });

    const page = await browser.newPage();
    const desktopPage = await browser.newPage();
    const url = `https://www.samsung.com/${siteCode}`;
    await page.setViewport({ width: 360, height: 1000 });
    await page.goto(url, {waitUntil: 'load'});
    await desktopPage.setViewport({ width: 1440, height: 1000 });
    await desktopPage.goto(url, {waitUntil: 'load'});


    let elementsWith2Lines = await page.evaluate((db) => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card--small .showcase-card-tab-card__product-name--mobile, .showcase-card-tab-card--product-small .showcase-card-tab-card__product-name--mobile`);
        const elementsWith2Lines = [];

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;
            const isExceed2Lines = Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight
            // console.log(element.innerHTML)
            if (isExceed2Lines){
                const getToday = () =>{
                    const today = new Date();


                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
                    const day = String(today.getDate()).padStart(2, '0');


                    return `${year}-${month}-${day}`;

                }
                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : Small tile headline text can not be exceeded 2 lines.' ELSE
check_reason || E'\nGuide : Small tile headline text can not be exceeded 2 lines.' end WHERE description ='Mobile' and site_code = '${siteCode}' and date = '${getToday()}' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerHTML.trim().split('<br>')[0]}%' returning *; `

                elementsWith2Lines.push(updateQuery)
            }


        });
        return elementsWith2Lines;
    });
    elementsWith2Lines.forEach((query)=>{
        // console.log(query)
        const client = new Client({
            user: 'postgres',
            host: '121.252.183.23',
            database: 'postgres',
            password: 'tmdqor4143',
            port: 5432
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{


            dbRes.rows.forEach((row)=>{
                console.log(`{"description":"${row['description']}","contents":"${row['contents']}"}lob and jack`)

            })
            client.end()
            return dbRes.rows

        }).catch((e)=>{

            console.log(e.stack)
            client.end()
            return e.stack

        })
    })

    let desktopElementsWith2Lines = await desktopPage.evaluate(() => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card--small .showcase-card-tab-card__product-name--desktop, .showcase-card-tab-card--product-small .showcase-card-tab-card__product-name--desktop`);
        const elementsWith2Lines = [];
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;
            const isExceed2Lines = Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight

            if (isExceed2Lines){
                const getToday = () =>{
                    const today = new Date();


                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
                    const day = String(today.getDate()).padStart(2, '0');


                    return `${year}-${month}-${day}`;

                }
                // console.log(element.innerHTML)
                // console.log(element.innerText)
                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : Small tile headline text can not be exceeded 2 lines.' ELSE
check_reason || E'\nGuide : Small tile headline text can not be exceeded 2 lines.' end WHERE description ='Desktop' and site_code = '${siteCode}' and date = '${getToday()}' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerHTML.trim().split('<br>')[0]}%'  returning *; `
                elementsWith2Lines.push(updateQuery)
            }

        });


        return elementsWith2Lines;
    });
    desktopElementsWith2Lines.forEach((query)=>{
        // console.log(query)
        const client = new Client({
            user: 'postgres',
            host: '121.252.183.23',
            database: 'postgres',
            password: 'tmdqor4143',
            port: 5432
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{

            dbRes.rows.forEach((row)=>{
                console.log(`{"description":"${row['description']}","contents":"${row['contents']}"}lob and jack`)
            })

            client.end()
            return dbRes.rows

        }).catch((e)=>{

            console.log(e.stack)
            client.end()
            return e.stack

        })
    })

    let elementsWithEllipsis = await desktopPage.evaluate(() => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card__product-name showcase-card-tab-card__product-name--mobile, .showcase-card-tab-card__product-description--mobile, .key-feature-tab__headline, .key-feature-tab__disclaimer,  .home-kv-carousel__headline, .home-kv-carousel__desc`);
        const elementsWithEllipsis = [];
        // const kvElements = document.querySelectorAll(`.home-kv-carousel__headline`)
        // elements.push(kvElements.getAttribute('data-desktop-headline-text'))
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;

            if (hasEllipsis){
                const getToday = () =>{
                    const today = new Date();


                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
                    const day = String(today.getDate()).padStart(2, '0');


                    return `${year}-${month}-${day}`;

                }
                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : All text must not use ellipsis attribute.' ELSE
check_reason || E'\nGuide : All text must not use ellipsis attribute.' end WHERE description ='Mobile' and site_code = '${siteCode}' and date = '${getToday()}' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerHTML.trim().split('<br>')[0]}%'  returning *; `
                elementsWith2Lines.push(updateQuery)
            }
        });
        return elementsWithEllipsis;
    });
    elementsWithEllipsis.forEach((query)=>{
        // console.log(query)
        const client = new Client({
            user: 'postgres',
            host: '121.252.183.23',
            database: 'postgres',
            password: 'tmdqor4143',
            port: 5432
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{

            dbRes.rows.forEach((row)=>{
                console.log(`{"description":"${row['description']}","contents":"${row['contents']}"}lob and jack`)
            })

            client.end()
            return dbRes.rows

        }).catch((e)=>{

            console.log(e.stack)
            client.end()
            return e.stack

        })
    })

    let desktopElementsWithEllipsis = await desktopPage.evaluate(() => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card__product-name showcase-card-tab-card__product-name--desktop, .showcase-card-tab-card__product-description--desktop, .key-feature-tab__headline .key-feature-tab__disclaimer, .home-kv-carousel__headline, .home-kv-carousel__desc`);
        const elementsWithEllipsis = [];
        // const kvElements = document.querySelectorAll(`.home-kv-carousel__headline`)
        // elements.push(kvElements.getAttribute('data-desktop-headline-text'))
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;
            const isExceed2Lines = Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight

            if (hasEllipsis){
                const getToday = () =>{
                    const today = new Date();


                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
                    const day = String(today.getDate()).padStart(2, '0');


                    return `${year}-${month}-${day}`;

                }
                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : All text must not use ellipsis attribute.' ELSE
check_reason || E'\nGuide : All text must not use ellipsis attribute.' end WHERE description ='Desktop' and site_code = '${siteCode}' and date = '${getToday()}' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerHTML.trim().split('<br>')[0]}%'  returning *; `
                elementsWith2Lines.push(updateQuery)
            }

        });
        return elementsWithEllipsis;
    });
    desktopElementsWithEllipsis.forEach((query)=>{
        // console.log(query)
        const client = new Client({
            user: 'postgres',
            host: '121.252.183.23',
            database: 'postgres',
            password: 'tmdqor4143',
            port: 5432
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{

            dbRes.rows.forEach((row)=>{
                console.log(`{"description":"${row['description']}","contents":"${row['contents']}"}lob and jack`)
            })

            client.end()
            return dbRes.rows

        }).catch((e)=>{

            console.log(e.stack)
            client.end()
            return e.stack

        })
    })

    // await page.screenshot({ path: fileName, fullPage:true});
    browser.close();
    const finishTime = new Date()
    // console.log(`FINISH Checking line length and Ellipsis in ${siteCode} :  ${finishTime}`)
    // console.timeEnd("checkTextLineGuid")
}
const siteCode = process.argv[2]
// console.log(siteCode)
// const siteCode = 'cz'

checkTextLineGuid(siteCode);