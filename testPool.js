const region = require("./region")
const mobile = require("./utils/mobile")
const desktop = require("./utils/desktop")

const goScreenshot = async () => {
  const site_code = region.site_code;
  const batchSize = 3;
  const totalBatches = Math.ceil(site_code.length / batchSize);
  const results = [];

  // batchSize에 따라 site_code 리스트를 병렬로 실행
  for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, site_code.length);
      const batch = site_code.slice(start, end);
      const promises = batch.map(async site => {
          try {
              // Desktop ver 실행 시
              return await desktop.takeScreenshot(site);
              // Mobile ver 실행 시
              // return await mobile.takeScreenshot(site);
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