const { Builder, By, until } = require('selenium-webdriver'); // until 포함
/**
 * 페이지 내에서 fail Data와 동일한 요소를 찾아, Border 표시로 시각화합니다. (global ver)
 * @param {*} driver 
 * @param {*} obj 
 * @param {bool} isMobile 
 * @returns 
 */
const checkFailData = async (driver, obj, isMobile) => {
    // co05의 모든 버튼을 저장
    const buttons = await driver.executeScript(function () {
        const result = [];
        const btns = document.querySelectorAll('.tab__item-title');
        btns.forEach((button) => {
            if (button.getAttribute('an-ac') == 'merchandising') {
                result.push(button.innerText);
            }
        });
        return result;
    })
    let area = obj.area.replace(/&amp;/g, '&');
    const buttonIndex = buttons.findIndex((text, index) => {
        return area.includes(text)
    });
    const desc = obj.desc;

    // 1. 내용이 없을 경우 return
    if (!obj.contents) {
        console.log("obj.contents is null");
        return;
    }
    // 2. KV 이미지 오류의 경우
    if (obj.area.includes("KV") && obj.contents.includes("images.samsung")) {
        // kv 이미지
        console.log("finding KV image")
        // const src = obj.contents;
        // const kvCarouselSlides = await driver.findElements(By.css(`div[class*="home-kv-carousel__wrapper"]`));
        // if (kvCarouselSlides) {
            // const kvElements = await driver.executeScript((kvCarouselSlides, src) => {
            //     const elements = kvCarouselSlides.querySelectorAll('img');

                // elements.forEach(element => {
                //     if (element.src.includes(src)) {
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
                    // else if (kvCarouselSlides.querySelector('source')) {
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
            //         }

            //     });
            // }, kvCarouselSlides, src);
        // }

    }
    // 2-1. KV 외의 이미지
    else if (obj.contents.includes("images.samsung")) {
        const src = obj.contents;
        const swiperWrapper = await driver.findElement(By.css('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized'))
        const swiperChildren = await swiperWrapper.findElements(By.css('.showcase-card-tab__card-items.swiper-slide'));

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        const selectedElement = await swiperChildren[buttonIndex];
        // co05 이미지
        // let selector = await page.$(`div[class*="showcase-card-tab__inner"]`);
        if (selectedElement) {
            const matchingElements = await driver.executeScript((selectedElement, src) => {
                const elements = selectedElement.querySelectorAll('img');
                elements.forEach(element => {
                    if (element.src.includes(src)) {
                        const parentEl1 = element.parentElement;
                        const parentEl2 = parentEl1.parentElement;
                        if (parentEl2) {
                            parentEl2.style.border = '7px solid red';
                            parentEl2.style.borderRadius = '20px';
                        }
                        return;
                    }
                });
            }, selectedElement, src);
        }

    }

    // 3. co05 타일 레이아웃 오류의 경우
    else if (obj.desc == "Tile Layout") {

        // co05의 모든 슬라이드를 저장
        const swiperWrapper = await driver.findElement(By.css('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized'));
        const swiperChildren = await swiperWrapper.findElements(By.css('.showcase-card-tab__card-items.swiper-slide'));

        // area에 해당하는 버튼의 인덱스를 활용하여, 몇 번째 슬라이드인지 검색 후 border 처리
        const selectedElement = await swiperChildren[buttonIndex];

        if (await selectedElement) {
            console.log(`merchandising select`);
            await selectedElement.executeScript
                (element => {
                    element.style.border = '7px solid red';
                    return;
                });
        } else {
            console.log(`merchandising select : failed`, obj.area);
        }
    }
    // 4. co05 뱃지 개수 오류의 경우
    // else if (obj.contents && obj.contents.length === 1 && obj.desc == "Badge Count") {
        // 3번과 동일하게 버튼의 인덱스를 찾은 후 해당 슬라이드 영역 상단에 표시
        // console.log(obj.contents)

        // const swiperWrapper = await page.findElement(By.css('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized'))
        // const swiperChildren = await swiperWrapper.findElements(By.css('.showcase-card-tab__card-items.swiper-slide'));

        // const selectedElement = await swiperChildren[buttonIndex];

        // if (await selectedElement) {  
        //     const Handle = await selectedElement.evaluateHandle(element => element);
        //     console.log(`badge count select`);
        //     await selectedElement.executeScript((element) => {
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
    // }
    // 5. 텍스트 오류의 경우
    else {
        let str = "";
        let merchanArea = "";
        let tileNumber = "";

        if (obj.key.includes("CO05")) {
            str = "CO05";
            const regex = /CO05_1_(.*?)_/;
            const match = obj.key.match(regex); // merchan 영역 찾기
            if (match && match[1]) {
                merchanArea = match[1];
                const numberRegex = new RegExp(`${merchanArea}_(\\d+)_`);
                let tilenum = obj.key.match(numberRegex);
                tileNumber = tilenum[1];
            } else {
                console.log('No match found');
            }
        }
        else if (obj.key.includes("CO07")) str = "CO07";
        else if (obj.key.includes("HD01")) str = "HD01";
        else if (obj.key.includes("FT03")) str = "FT03";
        else return 0;

        let selector = null;

        // 각 영역 별 셀렉터 저장
        if (str == "CO05") {
            selector = await driver.findElement(By.css(`div[class*="ho-g-showcase-card-tab"]`));
        } 
        // else if (str == "HD01") {
        //     selector = await driver.findElement(By.css(`div[class*="ho-g-home-kv-carousel"]`));
        // } else if (str == "FT03") {
        //     selector = await driver.findElement(By.css(`div[class*="pd-g-feature-benefit-full-bleed"]`));
        // } else if (str == "CO07") {
        //     selector = await driver.findElement(By.css(`div[class*="ho-g-key-feature-tab"]`));
        // } else {
        //     //
        // }

        if (str == "CO05") {

            const swiperWrapper = await driver.findElement(By.css('.showcase-card-tab__card-wrap.swiper-container.swiper-container-initialized'))
            const swiperChildren = await swiperWrapper.findElements(By.css('.showcase-card-tab__card-items.swiper-slide'));

            // 몇 번째 슬라이드인지 검색
            const selectedElement = await swiperChildren[buttonIndex];
            if (await selectedElement) {
                const cards = await selectedElement.findElements(By.css('.showcase-card-tab-card'))
                const card = await cards[tileNumber - 1]

                if (card) {
                    const els = await card.findElements(By.css(' * ')); // 모든 자식 요소 선택
                    for (let el of els) {
                        let innerhtml = await driver.executeScript(function(node){
                            return node.innerHTML.replace(/\s/g, '').replace(/"/g, '').replace(/&amp;/g, '&')
                            .replace(/<br>/g, '').replace(/<small>/g, '').replace(/<\/small>/g, '').replace(/&nbsp;/g, '').replace(/<sup>/g, '').replace(/<\/sup>/g, '')
                        }, el);
                        let outerhtml = await driver.executeScript(function(node){
                            return node.outerHTML.replace(/\s/g, '').replace(/"/g, '');
                        }, el);
                        let childrenLength = await driver.executeScript(node => {node.children.length}, el);
                        const isDisplayed = await driver.executeScript(node => {
                            const style = window.getComputedStyle(node);
                            return style.display !== 'none';
                        }, el);
                        let cleanedContents = obj.contents.replace(/<sup>/g, '').replace(/<\/sup>/g, '').replace(/<br\/>/g, '').replace(/\s/g, '').replace(/&nbsp;/g, '')
                            .replace(/"/g, '').replace(/<small>/g, '').replace(/<\/small>/g, '').replace(/&amp;/g, '&');

                        // 버그 확인 (콘솔에 내용 출력)
                        // if(cleanedContents.includes("$100")&&innerhtml.includes("$100")&&childrenLength<2) 
                        //     console.log(innerhtml, " /-----/ ",cleanedContents, childrenLength)

                        if (obj.title == "Description" && outerhtml.includes("showcase-card-tab-card__product-name")) {
                            // console.log("desc가 title이 됨\n", innerhtml, " \n*** ", cleanedContents);
                            continue;
                        }
                        else if (desc === "Badge" && childrenLength != 0) {
                            continue; // 뱃지일 때 뱃지 내용을 포함한 title,desc가 잡히는 버그 방지
                        }
                        else if (!isDisplayed) continue;
                        // else if (innerhtml.includes(cleanedContents) && childrenLength === 0) {
                        else if (innerhtml == cleanedContents && childrenLength === 1 && innerhtml.includes("span")) {
                            await driver.executeScript(node => {
                                let parent = node.parentElement;
                                parent.style.border = '4px solid red';
                                return;
                            }, el);
                        }
                        else if (innerhtml == cleanedContents && childrenLength === 0) {
                            if (isMobile && desc === "Badge") {
                                await driver.executeScript(node => {
                                    let parent = node.parentElement;
                                    let elWidth = window.getComputedStyle(node).width;
                                    let newWidth = (parseFloat(elWidth) + 20) + 'px';
                                    parent.style.width = newWidth;
                                    parent.style.padding = '2px'
                                    parent.style.border = '4px solid red';
                                    return;
                                }, el);
                            }
                            else if (desc === "Badge") {
                                await driver.executeScript(node => {
                                    let parent = node.parentElement;
                                    parent.style.padding = '2px'
                                    parent.style.border = '4px solid red';
                                    return;
                                }, el);
                            }
                            else {
                                await driver.executeScript(node => {
                                    let parent = node.parentElement;
                                    parent.style.border = '4px solid red';
                                    return;
                                }, el);
                            }
                        }
                        else if (outerhtml.includes('<br>') && !innerhtml.includes('span') && innerhtml.includes(cleanedContents) && childrenLength === 1) {
                            await driver.executeScript(node => {
                                let parent = node.parentElement;
                                parent.style.border = '4px solid red';
                                return;
                            }, el);
                        }
                        else if ((outerhtml.match(/<br>/g) || []).length >= 2 && !innerhtml.includes('span') && innerhtml.includes(cleanedContents) && childrenLength === 2) {
                            await driver.executeScript(node => {
                                let parent = node.parentElement;
                                parent.style.border = '4px solid red';
                                return;
                            }, el);
                        }
                        // else if(innerhtml.includes('sup') && !innerhtml.includes('span') && innerhtml.includes(cleanedContents) && childrenLength === 1){
                        //     // console.log(merchanArea, " - ", innerHTML, " / ", cleanedContents," ------ ")
                        //     await driver.executeScript(node => {
                        //         let parent = node.parentElement;
                        //         parent.style.border = '4px solid red';
                        //         return;
                        //     }, el);
                        // }
                        else if (outerhtml.includes('sup') && !innerhtml.includes('span') && innerhtml == cleanedContents && childrenLength <= 2) {
                            await driver.executeScript(node => {
                                let parent = node.parentElement;
                                parent.style.border = '4px solid red';
                                return;
                            }, el);
                        }
                    }
                }
            } else {
                console.log(`merchandising text select : failed `, obj.area);
            }
        }
        else if (selector) {

            const matchingElements = await driver.executeScript((s, obj) => {
                const elements = s.querySelectorAll('*');

                elements.forEach(element => {
                    // 현재 요소가 자식이 없는 최하위 요소일 때
                    if (element.innerHTML.includes(obj.contents) && element.children.length === 0) {
                        if (obj.area.includes("KV")) {
                            element.style.border = '4px solid red';
                            return;
                        }
                        else {
                            const parent = element.parentElement;
                            if (parent) parent.style.border = '4px solid red';
                            return;
                        }
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