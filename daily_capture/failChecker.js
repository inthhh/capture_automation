
const checkFailImage = async (page, src) =>{

    const imageHandle = await page.$(`img[src*="${src}"]`).parentElement;
    // const imgsrc = await page.evaluate(image => image.src, imageHandle);
    if (imageHandle) {
        const imgsrc = await page.evaluate(image => image.src, imageHandle);
        console.log(src);
        console.log(imageHandle);
        console.log(imgsrc)
        await page.evaluate((element) => {
            element.style.border = '20px solid red';
        }, imageHandle);
    } else {
        console.log("이미지를 찾을 수 없습니다.");
    }
    
}


module.exports = {
    checkFailImage
}