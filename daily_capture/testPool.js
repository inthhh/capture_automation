const region = require("./region")
const mobile = require("./mobile")
const desktop = require("./desktop")

const goScreenshot = async () => {
  // const site_code = region.site_code;
  const site_code = ['za']; // list

  const batchSize = 5;
  const totalBatches = Math.ceil(site_code.length / batchSize);

  const results = [];
  for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, site_code.length);
      const batch = site_code.slice(start, end);
      const promises = batch.map(site => mobile.takeScreenshot(site));
      const batchResult = await Promise.all(promises);
      results.push(...batchResult);
  }

  return results;
};


goScreenshot()
  .then(result => console.log(result))
  .catch(error => console.log(error));