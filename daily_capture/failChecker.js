const checkFailImage = async (page, src) =>{
    const imageHandle = await page.$(`img[data-desktop-src^="${src}"], img[data-desktop-src^="${src}?"], img[src^="${src}"], img[src^="${src}?"]`);
    if (imageHandle) {
        // Apply border to the image
        await page.evaluate((element) => {
            element.style.border = '10px solid red';
        }, imageHandle);
    } else {
        console.error('Image not found!');
    }
}


module.exports = {
    checkFailImage
}