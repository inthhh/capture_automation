const cookiePopupBreaker = async (page) =>{
  await page.evaluate(()=>{
      //Popup wrap
      const popupWrap = document.querySelector('#truste-consent-track')
      if(popupWrap) popupWrap.style.display = 'none'

      // Big popup
      document.querySelector('#truste-consent-button')?.click()

      // Footer popup
      document.querySelector('.cta.cta--contained.cta--emphasis')?.click()

      // Dialog popup
      document.querySelector('.cookie-bar__close')?.click()
  })
}



const lazyLoadingBreaker = async (page) =>{
  await page.evaluate(()=>{
      const lazyImages = document.querySelectorAll('img[data-desktop-src]');

      // Loop through each lazy image and set src attribute to data-desktop-src
      lazyImages.forEach(img => {
          img.src = img.getAttribute('data-desktop-src');
          img.removeAttribute('data-desktop-src');
      });

  })
}

module.exports = {
  cookiePopupBreaker,
  lazyLoadingBreaker
}