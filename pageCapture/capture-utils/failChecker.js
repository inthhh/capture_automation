// const { Page } = require("../../puppeteer");

// 페이지 내에서 API 데이터와 동일한 요소를 찾고 border 표시하는 함수
const checkFailData = async (page, obj) =>{
    // 1. 내용이 없을 경우 return
    if(!obj.contents){
        console.log("obj.contents is null");
        return;
    }
    // 2. 이미지 오류의 경우
    if(obj.area.includes("KV") && obj.contents.includes("images.samsung")){
        // kv 이미지
        console.log("finding KV image")
        const src = obj.contents;
            const kvCarouselSlides = await page.$(`div[class*="home-kv-carousel__wrapper"]`);
            if(kvCarouselSlides){
                const kvElements = await page.evaluate((kvCarouselSlides, src)=>{
                    const elements = kvCarouselSlides.querySelectorAll('img');
                    
                    elements.forEach(element => {
                        if(element.src.includes(src)){
                            // element.style.width = 'calc(100% - 14px)';
                            element.style.border = '7px solid red';
                            return;
                        }
                        else if(element.getAttribute('data-360w2x-src')){
                            if(element.getAttribute('data-360w2x-src').includes(src)) {
                                // element.style.width = 'calc(100% - 14px)';
                                element.style.border = '7px solid red';
                            }
                            return;
                        }
                        else if(element.getAttribute('data-1366w2x-src')){
                            if(element.getAttribute('data-1366w2x-src').includes(src)) {
                                // element.style.width = 'calc(100% - 14px)';
                                element.style.border = '14px solid red';
                            }
                            return;
                        }
                        else if(kvCarouselSlides.querySelector('source'))
                        {
                            const els = kvCarouselSlides.querySelectorAll('source');
                            els.forEach(el => {
                                if(el.getAttribute('srcset')){
                                    if(el.getAttribute('srcset').includes(src)) {
                                        const parentEl = el.parentElement;

                                        const imgEl = parentEl.querySelector('img');
                                        if (imgEl) {
                                            imgEl.style.border = '7px solid red';
                                        }}
                                    return;
                                }
                            })
                        }
                    
                    });
                }, kvCarouselSlides, src);
            }
        
    }
    else if(obj.contents.includes("images.samsung")){
        const src = obj.contents;

        // co05 이미지
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
        
    // 3. co05 타일 레이아웃 오류의 경우
    else if (obj.desc == "Tile Layout") {
        // 해당 레이아웃의 제목(area)를 저장
        const area = obj.area;
        // co05의 모든 버튼을 저장
        const buttons = await page.$$eval('.tab__item-title', buttons => {
            const result = [];
            buttons.forEach(button => {
                if (button.getAttribute('an-ac') == 'merchandising') {
                    result.push(button.innerText);
                    console.log(button.innerText)
                }
            });
            return result;
        });
        // area에 해당하는 버튼의 인덱스를 저장
        const buttonIndex = buttons.findIndex((text, index) => {
            console.log(text, area);
            return text === area;
        });
        
        // co05의 모든 슬라이드를 저장
        const swiperWrapper = await page.$('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized')
        const swiperChildren = await swiperWrapper.$$('.showcase-card-tab__card-items.swiper-slide');

        console.log("swiperWrapper : ", swiperWrapper);
        console.log("swiperChildren : ",swiperChildren);

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        const selectedElement = await swiperChildren[buttonIndex];

        if (await selectedElement) {  
            console.log(`merchandising select`);
            await selectedElement.evaluate(element => {
                element.style.border = '7px solid blue';
            });
        } else {
            console.log(`merchandising select : failed`);
        }
    } 
    // 4. co05 뱃지 개수 오류의 경우
    else if (obj.contents && obj.contents.length === 1 && obj.contents < 7) {
        // 3번과 동일하게 버튼의 인덱스를 찾은 후 해당 슬라이드 영역 상단에 표시
        console.log(obj.contents)
        const area = obj.area;
        const buttons = await page.$$eval('.tab__item-title', buttons => {
            const result = [];
            buttons.forEach(button => {
                if (button.getAttribute('an-ac') == 'merchandising') {
                    result.push(button.innerText);
                    console.log(button.innerText)
                }
            });
            return result;
        });

        const buttonIndex = buttons.findIndex((text, index) => {
            console.log(text, area);
            return text === area;
        });
        
        const swiperWrapper = await page.$('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized')
        const swiperChildren = await swiperWrapper.$$('.showcase-card-tab__card-items.swiper-slide');

        const selectedElement = await swiperChildren[buttonIndex];

        if (await selectedElement) {  
            const Handle = await selectedElement.evaluateHandle(element => element);
            console.log(`badge count select`);
            await selectedElement.evaluate((element) => {
                const newDiv = document.createElement('div');
                newDiv.textContent = 'Badge Count Issue';
                newDiv.style.backgroundColor = 'yellow';
                newDiv.style.color = 'red';
                newDiv.style.fontSize = '24px';
        
                if (element.firstChild) {
                    console.log("add badge-count newdiv")
                    element.insertBefore(newDiv, element.firstChild);
                } else {
                    element.appendChild(newDiv);
                }
            });
        } else {
            console.log(`badge count area select : failed`);
        }
    }
    // 5. 텍스트 오류의 경우
    else {
        let str = "";
        
        if(obj.key.includes("CO05")) str = "CO05";
        else if(obj.key.includes("CO07")) str = "CO07";
        else if(obj.key.includes("HD01")) str = "HD01";
        else if(obj.key.includes("FT03")) str = "FT03";
        else return 0;
        
        let selector = null;

        // 각 영역 별 셀렉터 저장
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

        if (selector) {
            
            const matchingElements = await page.evaluate((s, obj) => {
                const elements = s.querySelectorAll('*');
                
                elements.forEach(element => {
                    // 현재 요소가 자식이 없는 최하위 요소일 때
                    if (element.innerHTML.includes(obj.contents) && element.children.length === 0){
                        // 뱃지 텍스트의 경우
                        if(obj.description == "Badge"){
                            // 뱃지의 현재 스타일을 가져와서 편집
                            const computedStyle = window.getComputedStyle(element);
                            const width = parseInt(computedStyle.width);
                            const height = parseInt(computedStyle.height);
                            element.style.width = (width + 30) + 'vw';
                            element.style.height = (height + 30) + 'vw';
                            element.style.outline = '7px solid red';
                        }
                        // 일반 텍스트의 경우
                        else element.style.border = '7px solid red';
                    }
                });
            }, selector, obj);

        } else {
            console.log("-----not found area");
        }
    }
    
}

module.exports = {
    checkFailData
}