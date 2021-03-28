const puppeteer = require('puppeteer-core');
// const sample = require('./sample.json');

module.exports = async function (sample) {
  // 使用自訂的 Chrome
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false, // 無外殼的 Chrome，有更佳的效能
  });
  const page = await browser.newPage(); // 開啟新分頁

  console.log(sample);
  await page.goto(sample.url);
  for (let index = 0; index < sample.url.length; index++) {
    const event = sample.flow[index];
    console.log(event.method, event.parameter, page[event.method]);
    if (!Array.isArray(event.parameter)) {
      await page[event.method](event.parameter)
    } else {
      await page[event.method](...event.parameter)
    }
  }

  return `${sample.title} 完成`;
};
