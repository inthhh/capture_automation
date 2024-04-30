const checkFailImage = async (page, src) =>{
    // console.log("failChecker", src)
    // img src를 포함한 요소의 부모 요소 선택
    const imageHandle = await page.$(`img[src*="${src}"]`);
    // console.log(imageHandle);
    if(imageHandle) {
        const siblingHandle = await imageHandle.evaluateHandle(element => element.nextSibling);
        await siblingHandle.evaluateHandle(element => {
            const newDiv = document.createElement('div');
            newDiv.style.backgroundColor = 'red';
            newDiv.style.opacity = 0.3;
            newDiv.style.position = 'absolute';
            newDiv.style.top = 0;
            newDiv.style.width = '100%';
            newDiv.style.height = '100%';
            newDiv.style.zIndex = 9999;
            element.parentNode.insertBefore(newDiv, element.nextSibling);
          });
    } 
    else {
        console.error("Image element is null")
    }
}



module.exports = {
    checkFailImage
}