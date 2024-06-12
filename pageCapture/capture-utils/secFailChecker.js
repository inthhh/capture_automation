
// 페이지 내에서 API 데이터와 동일한 요소를 찾고 border 표시하는 함수
const checkFailData = async (page, obj, isMobile) =>{

    // co05의 모든 버튼을 저장
    const buttons = await page.$$eval('.swiper-wrapper button', buttons => {
        const result = [];
        buttons.forEach(button => {
            if (button.getAttribute('data-omni').includes('merchandising')) { 
                const title = button.getAttribute('title')
                result.push(title);
                console.log(title)
            }
        });
        return result;
    });
    let area = obj.area.replace('&amp;', '&');
    const buttonIndex = buttons.findIndex((text, index) => {
        return area.includes(text)
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
        const swiperWrapper = await page.$('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized')
        const swiperChildren = await swiperWrapper.$$('.showcase-card-tab__card-items.swiper-slide');

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        const selectedElement = await swiperChildren[buttonIndex];

        if (await selectedElement) {  
            console.log(`merchandising select`);
            await selectedElement.evaluate(element => {
                element.style.border = '7px solid red';
                return;
            });
        } else {
            console.log(`merchandising select : failed`, obj.area);
        }
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
        // none
    }
    
}


module.exports = {
    checkFailData
}