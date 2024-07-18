const { text } = require("body-parser");

// 페이지 내에서 API 데이터와 동일한 요소를 찾고 border 표시하는 함수
const checkFailData = async (page, obj, isMobile) =>{

    let key = obj.key
    if(obj.contents.includes("에어컨")) key = "sec_Home_CO05_4_all-outlets_4_LSSSS_Title_Desktop";
    else if(obj.contents.includes("얼리버드")) key = "sec_Home_CO05_3_july-special-benefit_0_LLL_Title_Desktop";
    console.log(key, obj.contents)
    // co05의 모든 버튼을 저장
    const buttons = await page.$$eval('.swiper-wrapper button', buttons => {
        const result = [];
        buttons.forEach(button => {
            if (button.getAttribute('data-omni').includes('merchandising')) { 
                const title = button.getAttribute('data-omni')
                result.push(title.replace('merchandising:',''));
            }
        });
        return result;
    });
    // .replace('&amp;', '&')
    const buttonIndex = buttons.findIndex((text, index) => {
        let text_ = text.replace(/_/g,'-')
        console.log(text_)
        return key.includes(text_)
    });
    const desc = obj.desc;

    // 1. 내용이 없을 경우 return
    if(!obj.contents){
        console.log("obj.contents is null");
        return;
    }
    // 2. 이미지 오류의 경우
    if(obj.area.includes("KV") && obj.contents.includes("images.samsung")){
        // kv 이미지
        // console.log("finding KV image")
        // const src = obj.contents;
        //     const kvCarouselSlides = await page.$(`div[class*="home-kv-carousel__wrapper"]`);
        //     if(kvCarouselSlides){
        //         const kvElements = await page.evaluate((kvCarouselSlides, src)=>{
        //             const elements = kvCarouselSlides.querySelectorAll('img');
                    
        //             elements.forEach(element => {
        //                 if(element.src.includes(src)){
                            // const parentEl1 = element.parentElement;
                            // const parentEl2 = parentEl1.parentElement;
                            // const parentEl3 = parentEl2.parentElement;
                            // if(parentEl3){
                            //     parentEl3.style.width = 'calc(100% - 10px)';
                            //     parentEl3.style.border = '7px solid red';
                            //     parentEl3.style.transform = 'translate3d(0, 0, 0)'
                            // }
                        //     return;
                        // }
                        // else if(kvCarouselSlides.querySelector('source'))
                        // {
                        //     const els = kvCarouselSlides.querySelectorAll('source');
                            // els.forEach(el => {
                            //     if(el.getAttribute('srcset')){
                            //         if(el.getAttribute('srcset').includes(src)) {
                            //             const parentEl1 = el.parentElement;
                            //             const parentEl2 = parentEl1.parentElement;
                            //             const parentEl3 = parentEl2.parentElement;
                            //             // const imgEl = parentEl.querySelector('img');
                            //             if (parentEl3) {
                            //                 parentEl3.style.width = 'calc(100% - 10px)';
                            //                 parentEl3.style.border = '7px solid red';
                            //                 parentEl3.style.transform = 'translate3d(0, 0, 0)'
                            //             }}
                            //         return;
                            //     }
                            // })
            //             }
                    
            //         });
            //     }, kvCarouselSlides, src);
            // }
        
    }
    // KV 외의 이미지
    else if(obj.contents.includes("images.samsung")){
        console.log("image capture")
        const src = obj.contents;
        const swiperChildren = await page.$$('.swiper-slide.set-tab-prd.rounded');

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        const selectedElement = await swiperChildren[buttonIndex];
        // co05 이미지
        if (selectedElement) {
            const matchingElements = await page.evaluate((selectedElement, src) => {
                const elements = selectedElement.querySelectorAll('img');
                elements.forEach(element => {
                    if(element.src.includes(src)){
                        const parentEl1 = element.parentElement;
                        const parentEl2 = parentEl1.parentElement;
                        const parentEl3 = parentEl2.parentElement;
                        if(parentEl3) parentEl3.style.border = '7px solid red';
                        return;
                    }
                });
            }, selectedElement, src);
        }
        
    }
        
    // 3. co05 타일 레이아웃 오류의 경우
    else if (obj.desc == "Tile Layout") {
        
        // co05의 모든 슬라이드를 저장
        // const swiperWrapper = await page.$('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized')
        // const swiperChildren = await swiperWrapper.$$('.showcase-card-tab__card-items.swiper-slide');

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        // const selectedElement = await swiperChildren[buttonIndex];

        // if (await selectedElement) {  
        //     console.log(`merchandising select`);
        //     await selectedElement.evaluate(element => {
        //         element.style.border = '7px solid red';
        //         return;
        //     });
        // } else {
        //     console.log(`merchandising select : failed`, obj.area);
        // }
    } 
    // 4. co05 뱃지 개수 오류의 경우
    else if (obj.contents && obj.contents.length === 1 && obj.desc =="Badge Count") {
        // 3번과 동일하게 버튼의 인덱스를 찾은 후 해당 슬라이드 영역 상단에 표시
        // console.log(obj.contents)
        
        // const swiperWrapper = await page.$('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized')
        // const swiperChildren = await swiperWrapper.$$('.showcase-card-tab__card-items.swiper-slide');

        // const selectedElement = await swiperChildren[buttonIndex];

        // if (await selectedElement) {  
        //     const Handle = await selectedElement.evaluateHandle(element => element);
        //     console.log(`badge count select`);
        //     await selectedElement.evaluate((element) => {
        //         const newDiv = document.createElement('div');
        //         newDiv.textContent = 'Badge Count Issue';
        //         newDiv.style.backgroundColor = 'yellow';
        //         newDiv.style.color = 'red';
        //         newDiv.style.fontSize = '24px';
        
        //         if (element.firstChild) {
        //             console.log("add badge-count newdiv")
        //             element.insertBefore(newDiv, element.firstChild);
        //         } else {
        //             element.appendChild(newDiv);
        //         }
        //     });
        // } else {
        //     console.log(`badge count area select : failed`);
        // }
    }
    // 5. 텍스트 오류의 경우
    else {
        console.log("text capture")
        let str = "";
        let merchanArea = "";
        let isLLL = false;
        let tileNumber = "";
        
        if(key.includes("CO05")) {
            str = "CO05";
            const regex = /CO05_\d+_(.*?)_/;
            const match = key.match(regex); // merchan 영역 찾기
            if (match && match[1]) {
                merchanArea = match[1];
                const numberRegex = new RegExp(`${merchanArea}_(\\d+)_`);
                let tilenum = key.match(numberRegex);
                tileNumber = tilenum[1];
                console.log(merchanArea, tileNumber)
            } else {
                console.log('No match found');
            }
        }
        if(key.includes("LLL")){
            isLLL = true;
        }
        // else if(obj.key.includes("CO07")) str = "CO07";
        // else if(obj.key.includes("HD01")) str = "HD01";
        // else if(obj.key.includes("FT03")) str = "FT03";
        // else return 0;
        
        let selector = null;

        // 각 영역 별 셀렉터 저장
        // if (str == "CO05"){
            // selector = await page.$(`div[class*="slider-tabtype-list"]`);
        // } else if (str == "HD01"){
            // selector = await page.$(`div[class*="ho-g-home-kv-carousel"]`);
        // } else if (str == "FT03"){
            // selector = await page.$(`div[class*="pd-g-feature-benefit-full-bleed"]`);
        // } else if (str == "CO07") {
            // selector = await page.$(`div[class*="ho-g-key-feature-tab"]`);
        // } else {
            //
        // }

        // if(str == "CO05"){
            
            const swiperChildren = await page.$$('.swiper-slide.set-tab-prd.rounded');
            const selectedElement = await swiperChildren[buttonIndex];
            console.log("index :", buttonIndex, tileNumber, swiperChildren.length)
            // text 위치 확인 (title or desc)
            let textType = "";
            // 문자열에 대해 정규표현식을 사용하여 숫자 추출
            if (obj.title == "Description") {
                textType = "desc";
            } else if (obj.title == "Title"){
                textType = "title";
            }
            // co05 이미지
            if (selectedElement) {
                const matchingElements = await page.evaluate((textType, tileNumber, isMobile, isLLL,selectedElement, desc) => {
                    const tileChildren = selectedElement.querySelectorAll('.swiper-slide.set-tab-prd.rounded .prd-item');
                    // const tileChildren = document.querySelectorAll('.swiper-slide.set-tab-prd.rounded .prd-item');
                    const element = tileChildren[tileNumber]; // 타일 진입
                    // console.log(element)
                    // tileNumber = -1;
                    // tileChildren.forEach((element)=>{
                        // tileNumber++;
                        if(element){
                            // 이미지 위치와 크기 계산
                            const rect = element.getBoundingClientRect();
                            const imageHeight = rect.height;
                            const newWidthPc = rect.width - 40; // width를 40px 줄임
                            const newLeftPc = rect.left + (rect.width - newWidthPc) / 2 + window.scrollX;
                            const newWidthMobile = rect.width / 2 - 30;
                            const newLeftMobile = rect.left + (rect.width / 2 + 10) + window.scrollX;
                            
                            if(desc==="Badge" && !isMobile){
                            // if(!isMobile){
                                if(tileNumber == 0){
                                    const badgeRect = document.createElement('div');
                                    badgeRect.style.position = 'absolute';
                                    badgeRect.style.border = '2px solid red';
                                    badgeRect.style.backgroundColor = 'transparent';
                                    badgeRect.style.zIndex = '999';

                                    badgeRect.style.left = `${rect.left+30}px`;
                                    badgeRect.style.width = `70px`;
                                    badgeRect.style.top = `${rect.top + window.scrollY + 32}px`;
                                    badgeRect.style.height = `40px`;

                                    document.body.appendChild(badgeRect);
                                }
                                else{
                                    const badgeRect = document.createElement('div');
                                    badgeRect.style.position = 'absolute';
                                    badgeRect.style.border = '2px solid red';
                                    badgeRect.style.backgroundColor = 'transparent';
                                    badgeRect.style.zIndex = '999';

                                    badgeRect.style.left = `${rect.left+30}px`;
                                    badgeRect.style.width = `70px`;
                                    badgeRect.style.top = `${rect.top + window.scrollY + 32}px`;
                                    badgeRect.style.height = `40px`;

                                    document.body.appendChild(badgeRect);
                                }
                            }
                            if(desc==="Badge" && isMobile){
                            // if(isMobile){
                                if(tileNumber == 0){
                                    const badgeRect = document.createElement('div');
                                    badgeRect.style.position = 'absolute';
                                    badgeRect.style.border = '2px solid red';
                                    badgeRect.style.backgroundColor = 'transparent';
                                    badgeRect.style.zIndex = '999';

                                    badgeRect.style.left = `${newLeftMobile+5}px`;
                                    badgeRect.style.width = `50px`;
                                    badgeRect.style.top = `${rect.top + window.scrollY + 55}px`;
                                    badgeRect.style.height = `30px`;

                                    document.body.appendChild(badgeRect);
                                }
                                else{
                                    const badgeRect = document.createElement('div');
                                    badgeRect.style.position = 'absolute';
                                    badgeRect.style.border = '2px solid red';
                                    badgeRect.style.backgroundColor = 'transparent';
                                    badgeRect.style.zIndex = '999';

                                    badgeRect.style.left = `${rect.left+15}px`;
                                    badgeRect.style.width = `50px`;
                                    badgeRect.style.top = `${rect.top + window.scrollY + 15}px`;
                                    badgeRect.style.height = `30px`;

                                    document.body.appendChild(badgeRect);
                                }
                            }
                            if(textType === "title"){
                                const overlayRect = document.createElement('div');
                                overlayRect.style.position = 'absolute';
                                overlayRect.style.border = '2px solid red';
                                overlayRect.style.backgroundColor = 'transparent';
                                overlayRect.style.zIndex = '9999';
                                
                                if(!isMobile){ // PC ver
                                    overlayRect.style.left = `${newLeftPc}px`;
                                    overlayRect.style.width = `${newWidthPc}px`;
                                    if(isLLL) { // LLL 3개일때
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.8 * imageHeight}px`;
                                        overlayRect.style.height = `${0.1 * imageHeight}px`;
                                    }
                                    else if(tileNumber == 0){ // big tile
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.8 * imageHeight}px`;
                                        overlayRect.style.height = `${0.06 * imageHeight}px`;
                                    }
                                    else{ // small tile
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.73 * imageHeight}px`;
                                        overlayRect.style.height = `${0.11 * imageHeight}px`;
                                    }
                                }
                                else{ // Mobile ver
                                    if(isLLL) { // LLL 3개일때
                                        overlayRect.style.left = `${newLeftMobile - 10}px`;
                                        overlayRect.style.width = `${newWidthMobile + 20}px`;
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.35 * imageHeight}px`;
                                        overlayRect.style.height = `${0.3 * imageHeight}px`;
                                    }
                                    else if(tileNumber == 0){ // big tile
                                        overlayRect.style.left = `${newLeftMobile}px`;
                                        overlayRect.style.width = `${newWidthMobile}px`;
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.25 * imageHeight}px`;
                                        overlayRect.style.height = `${0.25 * imageHeight}px`;
                                    }
                                    else{ // small tile
                                        overlayRect.style.left = `${rect.left + 10 + window.scrollX}px`;
                                        overlayRect.style.width = `${rect.width - 20}px`;
                                        overlayRect.style.top = `${rect.top + window.scrollY + 0.68 * imageHeight}px`;
                                        overlayRect.style.height = `${0.2 * imageHeight}px`;
                                    }
                                }
                                document.body.appendChild(overlayRect);
                            }
                            else if(textType === "desc"){

                                const descRect = document.createElement('div');
                                descRect.style.position = 'absolute';
                                descRect.style.border = '2px solid red';
                                descRect.style.backgroundColor = 'transparent';
                                
                                if(tileNumber == 0){ // big tile
                                    descRect.style.top = `${rect.top + window.scrollY + 0.87 * imageHeight}px`;
                                    descRect.style.left = `${newLeftPc}px`;
                                    descRect.style.width = `${newWidthPc}px`;
                                    descRect.style.height = `${0.06 * imageHeight}px`;
                                    descRect.style.zIndex = '9999';
                                }
                                else{
                                    descRect.style.top = `${rect.top + window.scrollY + 0.85 * imageHeight}px`;
                                    descRect.style.left = `${newLeftPc}px`;
                                    descRect.style.width = `${newWidthPc}px`;
                                    descRect.style.height = `${0.1 * imageHeight}px`;
                                    descRect.style.zIndex = '9999';
                                }
                                document.body.appendChild(descRect);
                            }
                        }
                    // })
                    // console.log(matchingElements)
                }, textType, tileNumber, isMobile, isLLL, selectedElement, desc);
            }
        // }
    }
    
}


module.exports = {
    checkFailData
}