const cookiePopupBreaker = async (page) =>{
  await page.evaluate(()=>{
      //Popup wrap
      const popupWrap = document.querySelector('#truste-consent-track')
      if(popupWrap) popupWrap.style.display = 'none'

      const grayoverlay = document.querySelector('#insider-opt-in-native-dialog')
      if(grayoverlay) grayoverlay.style.display = 'none'
      const overlay = document.getElementById('insider-opt-in-native-dialog')
      if(overlay) overlay.style.display = 'none'

      const surveyIframe = document.getElementById('QSIFeedbackButton-survey-iframe');
      if (surveyIframe) {
          surveyIframe.remove();
      }
      const feedbackcontainer = document.querySelector('#QSIFeedbackButton-target-container')
      if(feedbackcontainer) feedbackcontainer.style.display = 'none'

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

const accessibilityPopupBreaker = async (page) =>{
  await page.evaluate(()=>{
      const accessibilityPopup = document.querySelector('.ht-skip')
      if (accessibilityPopup) accessibilityPopup.remove()
  })
}

module.exports = {
  cookiePopupBreaker,
  lazyLoadingBreaker,
  accessibilityPopupBreaker
}