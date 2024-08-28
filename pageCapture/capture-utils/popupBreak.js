const { Builder, By, until } = require('selenium-webdriver'); // until 포함

/**
 * 쿠키 설정 등 다양한 팝업을 제거합니다.
 * @param {*} driver 
 * @param {boolean(Desktop/Home ver일 경우에만 true)} isDesktop 
 */
const cookiePopupBreaker = async (driver, isDesktop) =>{
  if(isDesktop) await driver.wait(until.elementLocated(By.css('.tab__item-title')), 10000);
  await driver.executeScript(()=>{
    //Popup wrap
    const popupWrap = document.querySelector('#truste-consent-track')
    if(popupWrap) popupWrap.style.display = 'none'

    const tablist = document.querySelector('.showcase-card-tab__inner .tab')
    if(tablist) tablist.style.overflow = 'visible'

    const observer1 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          const grayOverlay = document.querySelector(".insider-opt-in-overlay");
          if (grayOverlay) {
              // console.log("overlay remove");
              grayOverlay.remove();
              observer1.disconnect();  // 요소를 찾으면 더 이상 감시하지 않음
          }
      });
    });
    observer1.observe(document.body, { childList: true, subtree: true });

    // Big popup
    document.querySelector('#truste-consent-button')?.click()
    // Footer popup
    document.querySelector('.cta.cta--contained.cta--emphasis')?.click()
    // Dialog popup
    document.querySelector('.cookie-bar__close')?.click()

  })
  
}

/**
 * CO05 버튼 목록의 순차적인 클릭을 통해 모든 이미지를 preload합니다.
 * @param {*} driver 
 */
const clickEveryMerchan = async (driver) =>{
  await driver.wait(until.elementLocated(By.css('.tab__item-title')), 10000);
  await driver.executeScript(()=>{
    
    const buttons = document.querySelectorAll('.tab__item-title')

    buttons?.forEach(async (button, index) => {
      if (button.getAttribute('an-ac') === 'merchandising') {
        // 1초 간격으로 클릭
        await new Promise(resolve => setTimeout(resolve, 1000 * index));
        button.click();
      }
    });
  })
}

/**
 * CO05의 첫번째 케로쉘로 다시 돌아갑니다.
 * @param {*} driver 
 */
const clickFirstMerchan = async (driver) =>{
  await driver.executeScript(async()=>{
    const buttons = document.querySelectorAll('.tab__item-title')
    await new Promise(resolve => setTimeout(resolve, 10000));
    // console.log("btn : ", buttons);
    // 버튼 리스트에서 머천다이징의 첫 버튼을 찾아서 클릭 후 종료
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('an-ac') === 'merchandising') {
        buttons[i].click();
        break;
      }
      else continue;
    }
  })
}

/**
 * 동적으로 나타나는 모든 iframe을 제거합니다.
 * @param {*} driver 
 */
const removeIframe = async (driver) =>{
  // await page.waitForSelector('.tab__item-title')
  await driver.executeScript(async()=>{
    const surveyIframe = document.getElementById('QSIFeedbackButton-survey-iframe');
    if (surveyIframe) surveyIframe.remove();

    const feedbackcontainer = document.querySelector('#QSIFeedbackButton-target-container')
    if(feedbackcontainer) feedbackcontainer.style.display = 'none'

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {

        const surveyiframe = document.querySelector(".surveyIframe");
        if (surveyiframe) surveyiframe.remove();

        const surveyiframe2 = document.querySelector(".surveyIframe.showSurvey");
        if (surveyiframe2) surveyiframe2.remove();
        
        const previewWrapper = document.querySelector(".ins-preview-wrapper");
        if (previewWrapper) previewWrapper.remove();
    
        const formIframe = document.querySelector("#MDigitalAnimationWrapper");
        if (formIframe) formIframe.remove();

        const chatIframe = document.querySelector("#zc__sdk__container");
        if (chatIframe) chatIframe.remove();

        const serveyimg = document.querySelector("img.surveyImg");
        if(serveyimg) serveyimg.remove();

        const whatsAppPopup = document.querySelector('.ins-preview-wrapper')
        if(whatsAppPopup) whatsAppPopup.remove()

        const divbtn = document.querySelector('#nebula_div_btn')
        if(divbtn) divbtn.remove();

        const feedbackbtn = document.querySelector('#QSIFeedbackButton-btn')
        if(feedbackbtn) feedbackbtn.remove();

        const cnBtn = document.querySelector('img.surveyImg')
        if(cnBtn) cnBtn.remove();

        const deVideo = document.querySelector('.cy-player')
        if (deVideo) deVideo.remove();

      });
    });
    
    // 관찰 시작
    observer.observe(document.body, { childList: true, subtree: true });
    
  })
}

/**
 * 접근성 팝업을 제거합니다.
 * @param {*} driver 
 */
const accessibilityPopupBreaker = async (driver) =>{
  await driver.wait(until.elementLocated(By.css('.nv00-gnb')), 10000);
  await driver.executeScript(()=>{
      const accessibilityPopup = document.querySelector('.ht-skip')
      if (accessibilityPopup) accessibilityPopup.remove()
  })
}

module.exports = {
  cookiePopupBreaker,
  accessibilityPopupBreaker,
  clickEveryMerchan,
  clickFirstMerchan,
  removeIframe,
  // whatsAppPopupBreaker
}