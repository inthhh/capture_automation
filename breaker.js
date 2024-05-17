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
    
    const buttons = document.querySelectorAll('.tab__item-title')

    buttons?.forEach(async (button, index) => {
      if (button.getAttribute('an-ac') === 'merchandising') {
        // 1초 간격으로 클릭
        await new Promise(resolve => setTimeout(resolve, 1000 * index));
        button.click();
        console.log("*************button click");
      }
    });
  })
  
}

const clickFirstMerchan = async (page) =>{
  await page.evaluate(async()=>{
    const buttons = document.querySelectorAll('.tab__item-title')
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("btn : ", buttons);
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('an-ac') === 'merchandising') {
        buttons[i].click();
        console.log("click first button-------------")
        break;
      }
    }
  })
}

const clickFirstKV = async (page) =>{
  await page.evaluate(async()=>{
    await new Promise(resolve => setTimeout(resolve, 18000));
    const kv = document.querySelector('.home-kv-carousel__indicator-wrap')
    const kvbtn = kv.querySelector('.indicator__item');
    if(kvbtn) kvbtn.click();
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
  accessibilityPopupBreaker,
  clickFirstMerchan,
  // clickFirstKV
}