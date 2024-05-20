const region = require("./region")
const mobile = require("./mobile")
const desktop = require("./desktop")

const goScreenshot = async () => {
  const site_code = region.site_code;
  // const site_code = ['ca']; // list
  const batchSize = 3;
  const totalBatches = Math.ceil(site_code.length / batchSize);

  const results = [];
  for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, site_code.length);
      const batch = site_code.slice(start, end);
      const promises = batch.map(async site => {
        try {
          return await desktop.takeScreenshot(site);
        } catch (error) {
          console.error(`Error taking screenshot for site ${site}:`, error);
          return null; // 오류가 발생한 경우 null을 반환
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