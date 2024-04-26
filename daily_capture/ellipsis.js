const puppeteer = require('puppeteer');
const moment = require('moment');
const carouselBreak = require ('./carouselBreak');
const failChecker = require('./failChecker')
const { ellipsisDetector } = require('./ellipsisDetector')
const utility = require("./src/utility");

const db = require("./db")
const {quiet} = require("nodemon/lib/utils");
const {Client} = require("pg");

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
    console.log(`${startTime} : Check line length and Ellipsis in ${siteCode}`)
    console.time("checkTextLineGuid")
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


    let elementsWithEllipsis = await page.evaluate((db) => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card--small .showcase-card-tab-card__product-name--mobile, .showcase-card-tab-card--product-small .showcase-card-tab-card__product-name--mobile`);
        const elementsWithEllipsis = [];

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            // const innerHtml = element.innerHTML
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            // element.webkitLineClamp = null
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;
            const isExceed2Lines = Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight
            // console.log(element.innerHTML)
            if (isExceed2Lines){

                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : Small tile headline text can not be exceeded 2 lines' ELSE
check_reason || ' \ Guide : Small tile headline text can not be exceeded 2 lines' end WHERE description ='Mobile' and site_code = '${siteCode}' and date = '2024-04-25' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerText}%' returning *; `

                elementsWithEllipsis.push(updateQuery)
            }

        });
        return elementsWithEllipsis;
    });
    elementsWithEllipsis.forEach((query)=>{
        console.log(query)
        const client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{

            console.log(dbRes.rows)
            client.end()
            return dbRes.rows

        }).catch((e)=>{

            console.log(e.stack)
            client.end()
            return e.stack

        })
    })
    let desktopElementsWithEllipsis = await desktopPage.evaluate(() => {
        const elements = document.querySelectorAll(`.showcase-card-tab-card__product-name showcase-card-tab-card__product-name--mobile`);
        const elementsWithEllipsis = [];

        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const defaultHeight = element.getBoundingClientRect().height
            element.style.webkitLineClamp = '9999'
            element.style.maxHeight = '99999px'
            const afterHeight = element.getBoundingClientRect().height
            const hasEllipsis = defaultHeight < afterHeight;
            const isExceed2Lines = Number(style.lineHeight.substring(0,style.lineHeight.length-2)) *1.5 <= defaultHeight

            if (isExceed2Lines){
                console.log(element.innerHTML)
                console.log(element.innerText)
                const updateQuery = `UPDATE qa_result SET check_result = 'N',  check_reason = CASE WHEN check_reason='Pass' then 'Guide : Small tile headline text can not be exceeded 2 lines' ELSE
check_reason || E'\n Guide : Small tile headline text can not be exceeded 2 lines' end WHERE description ='Desktop' and site_code = '${siteCode}' and date = '2024-04-25' and key like '%CO05%' and title ='Title'  and contents like '%${element.innerText}%'  returning *; `
                elementsWithEllipsis.push(updateQuery)
            }
        });
        return elementsWithEllipsis;
    });

    desktopElementsWithEllipsis.forEach((query)=>{
        console.log(query)
        const client = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: 'tmdqor4143',
            port: process.env.DB_PORT
        })

        client.connect(err =>{
            if (err) {
                console.log(err)
                return err

            }
        });

        client.query(query).then((dbRes)=>{

            console.log(dbRes.rows)
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
    console.log(`FINISH Checking line length and Ellipsis in ${siteCode} :  ${finishTime}`)
    console.timeEnd("checkTextLineGuid")
}
const siteCode = 'cz'

checkTextLineGuid(siteCode);