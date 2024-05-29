
// isDesktop = desktop home ver일때만 true
const cookiePopupBreaker = async (page, isDesktop) =>{
  if(isDesktop) await page.waitForSelector('.tab__item-title')
  await page.evaluate((isDesktop)=>{
    //Popup wrap
    const popupWrap = document.querySelector('#truste-consent-track')
    if(popupWrap) popupWrap.style.display = 'none'

    // const overlay = document.getElementById("insider-opt-in-native-dialog");
    // if (overlay) {
    //   console.log("----------overlay remove")
    //   overlay.remove();
    // }
    // const uaOverlay = document.querySelector(".insider-opt-in-overlay");
    // if (uaOverlay) {
    //   console.log("overlay remove")
    //   uaOverlay.remove();
    // }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          const uaOverlay = document.querySelector(".insider-opt-in-overlay");
          if (uaOverlay) {
              console.log("overlay remove");
              uaOverlay.remove();
              observer.disconnect();  // 요소를 찾으면 더 이상 감시하지 않음
          }
      });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

    // Big popup
    document.querySelector('#truste-consent-button')?.click()
    // Footer popup
    document.querySelector('.cta.cta--contained.cta--emphasis')?.click()
    // Dialog popup
    document.querySelector('.cookie-bar__close')?.click()

    if(isDesktop){
      const kvarea = document.querySelectorAll('.home-kv-carousel--height-medium .home-kv-carousel__background-media-wrap');
      kvarea?.forEach((kv)=>{
        kv.style.paddingBottom = 'calc(46.444444%)';
      })
    }
  }, isDesktop)
  
}

// co05 버튼 리스트 순차 클릭
const clickEveryMerchan = async (page) =>{
  await page.waitForSelector('.tab__item-title')
  await page.evaluate(()=>{
    
    const buttons = document.querySelectorAll('.tab__item-title')

    buttons?.forEach(async (button, index) => {
      if (button.getAttribute('an-ac') === 'merchandising') {
        // 1초 간격으로 클릭
        await new Promise(resolve => setTimeout(resolve, 1000 * index));
        button.click();
        console.log("**button click");
      }
    });
  })
}

// co05 첫 버튼을 눌러서 첫 케로쉘로 다시 돌아오게 하기
const clickFirstMerchan = async (page) =>{
  // await page.waitForSelector('.tab__item-title')
  await page.evaluate(async()=>{
    const buttons = document.querySelectorAll('.tab__item-title')
    await new Promise(resolve => setTimeout(resolve, 20000));
    console.log("btn : ", buttons);
    // 버튼 리스트에서 머천다이징의 첫 버튼을 찾아서 클릭 후 종료
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute('an-ac') === 'merchandising') {
        buttons[i].click();
        console.log("**click first button",buttons[i])
        break;
      }
      else continue;
    }
  })
}

const removeIframe = async (page) =>{
  // await page.waitForSelector('.tab__item-title')
  await page.evaluate(async()=>{
    const surveyIframe = document.getElementById('QSIFeedbackButton-survey-iframe');
    if (surveyIframe) surveyIframe.remove();

    const feedbackcontainer = document.querySelector('#QSIFeedbackButton-target-container')
    if(feedbackcontainer) feedbackcontainer.style.display = 'none'
    const cnIframe = document.querySelector("surveyIframe")
    if (cnIframe) {
      cnIframe.style.display = 'none';
      cnIframe.remove();
    }
  })}

// 접근성 팝업 제거
const accessibilityPopupBreaker = async (page) =>{
  await page.evaluate(()=>{
      const accessibilityPopup = document.querySelector('.ht-skip')
      if (accessibilityPopup) accessibilityPopup.remove()
  })
}

module.exports = {
  cookiePopupBreaker,
  accessibilityPopupBreaker,
  clickEveryMerchan,
  clickFirstMerchan,
  removeIframe
}