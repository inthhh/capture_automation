

const checkFailData = async (page, obj) =>{

            if(obj.contents.includes("images.samsung")){
                const src = obj.contents;
                const imageHandle = await page.$(`img[src*="${src}"]`);
                if(imageHandle) {
                    console.log("image found : ", src);
                    const siblingHandle = await imageHandle.evaluateHandle(element => element.nextSibling);
                    await siblingHandle.evaluateHandle(element => {
                        const newDiv = document.createElement('div');
                        newDiv.style.position = 'absolute';
                        newDiv.style.top = 0;
                        newDiv.style.width = '100%';
                        newDiv.style.height = '100%';
                        newDiv.style.zIndex = 9999;
                        newDiv.style.border = '7px solid red'
                        element.parentNode.insertBefore(newDiv, element.nextSibling);
                    });
                } 
                else {
                    // console.error("-----Image not found")
                }
            }
            else if (obj.contents.includes("SSSSSSSS") || obj.contents.includes("LSSSSSS") ||
                obj.contents.includes("SSLSSSS") || obj.contents.includes("SSSSLSS") ||
                obj.contents.includes("SSSSSSL") || obj.contents.includes("SSSSSS") ||
                obj.contents.includes("SSSSL") || obj.contents.includes("SSLSS")) {
                // box check
                console.log("box : ", obj.contents);
            } 
            else { // key에 co05가 포함 ->(머천다이징 영역)\
                let str = "";
                if(obj.key.includes("CO05")) str = "CO05";
                else if(obj.key.includes("CO07")) str = "CO07";
                else if(obj.key.includes("HD01")) str = "HD01";
                else if(obj.key.includes("FT03")) str = "FT03";
                else return 0;
                
                console.log("keyyyyyyyyyyyyyy", obj.key);
                let selector = null;

                if (str == "CO05"){
                    selector = await page.$(`div[class*="cm-g-text-block-container"]`);
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
                        console.log("area contents = ", obj.contents);

                        const matchingElements = await page.evaluate((s, contents) => {
                            const elements = s.querySelectorAll('*');
                            const matchingElements = [];
                            elements.forEach(element => {
                                // console.log("--------------",element)
                                if (element.innerHTML.includes(contents) && element.innerHTML.split('<').length - 1 === 2) {
                                    element.style.border = '7px solid red';
                                    matchingElements.push(element.innerHTML);
                                }
                            });
                            return matchingElements;
                        }, selector, obj.contents);

                        console.log(matchingElements);

                    } else {
                        console.log("-----not found area");
                    }
                }
            
        }

module.exports = {
    checkFailData
}