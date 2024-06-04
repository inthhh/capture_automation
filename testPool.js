const region = require("./region")
const mobile = require("./pageCapture/home/mobile")
const desktop = require("./pageCapture/home/desktop")
const mobile_offer = require("./pageCapture/offer/mobile_offer")
const desktop_offer = require("./pageCapture/offer/desktop_offer")

const goScreenshot = async () => {
  const site_code = ['sk'];

  // const site_code = region.site_code;
  const batchSize = 2; // batch 크기 변경 (병렬실행 갯수)
  const dataDate = "2024-06-04"; // api 날짜에 맞게 변경

  const totalBatches = Math.ceil(site_code.length / batchSize);
  const results = [];

  // batchSize에 따라 site_code 리스트를 병렬로 실행
  for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, site_code.length);
      const batch = site_code.slice(start, end);

      const promises = batch.map(async site => {
          try {
            // 주석처리 해제한 스크린샷 작업을 병렬로 실행
                const screenshots = await Promise.all([
                  desktop.takeScreenshot(site, dataDate), // Desktop home 실행 시
                  // desktop_offer.takeScreenshot(site, dataDate), // Desktop offer 실행 시
                  mobile.takeScreenshot(site, dataDate), // Mobile home 실행 시
                  // mobile_offer.takeScreenshot(site, dataDate) // Mobile offer 실행 시
              ]);
              return screenshots;
          } catch (error) {
              console.error(`Error taking screenshot for site ${site}:`, error);
              // 스크린샷 도중 오류가 발생한 경우 null을 반환
              return null;
          }
      });
      const batchResult = await Promise.all(promises);
      // null 값은 결과 배열에서 제거
      results.push(...batchResult.filter(result => result !== null));
  }

  return results;
};


goScreenshot()
  .then(result => console.log(result))
  .catch(error => console.log(error));