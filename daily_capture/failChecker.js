const { Page } = require("puppeteer");


const checkFailData = async (page, obj) =>{
    if(!obj.contents) return null;

    if(obj.contents.includes("images.samsung")){
        const src = obj.contents;

        let selector = await page.$(`div[class*="showcase-card-tab__inner"]`);
        if (selector) {
            const matchingElements = await page.evaluate((selector, src) => {
                const elements = selector.querySelectorAll('img');
                elements.forEach(element => {
                    if(element.src.includes(src)){
                        element.style.border = '7px solid red';
                        return;
                    }
                });
            }, selector, src);

        }
        
    }
    else if (obj.contents.includes("SSSSSSSS") || obj.contents.includes("LSSSSSS") ||
        obj.contents.includes("SSLSSSS") || obj.contents.includes("SSSSLSS") ||
        obj.contents.includes("SSSSSSL") || obj.contents.includes("SSSSSS") ||
        obj.contents.includes("SSSSL") || obj.contents.includes("SSLSS")) {
        // box check
        console.log("box : ", obj.contents);
    } 
    // badge count
    else if (obj.contents.length === 1 && obj.contents < 7) {
        
        console.log(obj.contents)
    }
    else { // key에 co05가 포함 ->(머천다이징 영역)\
        let str = "";
        if(obj.key.includes("CO05")) str = "CO05";
        else if(obj.key.includes("CO07")) str = "CO07";
        else if(obj.key.includes("HD01")) str = "HD01";
        else if(obj.key.includes("FT03")) str = "FT03";
        else return 0;
        
        // console.log("keyyyyyyyyyyyyyy", obj.key);
        let selector = null;

        if (str == "CO05"){
            selector = await page.$(`div[class*="ho-g-showcase-card-tab"]`);
        } else if (str == "HD01"){
            selector = await page.$(`div[class*="ho-g-home-kv-carousel"]`);
        } else if (str == "FT03"){
            selector = await page.$(`div[class*="pd-g-feature-benefit-full-bleed"]`);
        } else if (str == "CO07") {
            selector = await page.$(`div[class*="ho-g-key-feature-tab"]`);
        } else {
            //
        }

        // console.log(str, " / ",selector);
        if (selector) {

                // if(obj.contents=="Hot") console.log(obj.contents)
                const matchingElements = await page.evaluate((s, obj) => {
                    const elements = s.querySelectorAll('*');
                    // const matchingElements = [];
                    elements.forEach(element => {
                        if (element.innerHTML.includes(obj.contents) && element.children.length === 0){ // 최하위 요소일 때
                            if(obj.description == "Badge"){
                                const computedStyle = window.getComputedStyle(element); // 요소의 현재 스타일 가져오기
                                const width = parseInt(computedStyle.width); // 현재 너비 가져오기
                                const height = parseInt(computedStyle.height); // 현재 높이 가져오기
                                element.style.width = (width + 30) + 'vw';
                                element.style.height = (height + 30) + 'vw';
                                element.style.outline = '7px solid red';
                            }
                            else element.style.border = '7px solid red';
                                // matchingElements.push(element.innerHTML);
                        }
                    });
                    // return matchingElements;
                }, selector, obj);

                // console.log(matchingElements);

            } else {
                console.log("-----not found area");
            }
        }
    
}

module.exports = {
    checkFailData
}