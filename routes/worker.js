const puppeteer = require('puppeteer-core');
const firebaseAdmin = require('../helpers/firebaseInit');
const db = firebaseAdmin.database();
const logRef = db.ref('/logs');

function addNewLog(id, message = 'start testing', status = false) {
  const dbKey = logRef.child(`${id}/log`).push().key;
  logRef.child(`${id}/log/${dbKey}`).set({
    timestamp: new Date().getTime(),
    message: message,
    status,
  });
}

module.exports = async function (sample, id) {
  // 使用自訂的 Chrome
  const browser = await puppeteer.launch({
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false, // 無外殼的 Chrome，有更佳的效能
  });
  const page = await browser.newPage(); // 開啟新分頁

  console.log(sample, `${sample.host}${sample.query}`, id);
  await page.goto(`${sample.host}${sample.query}`);
  logRef.child(id).set({
    title: sample.title,
    host: sample.host,
  })

  let event = {}
  try {
    console.log('start testing');
    addNewLog(id, 'start testing', true);
    for (let index = 0; index < sample.flows.length; index++) {
      event = sample.flows[index];
      console.log(event.method, event.parameter, page[event.method]);
      addNewLog(id, `進行中 ${event.method}`, true);
      if (!Array.isArray(event.parameter)) {
        await page[event.method](event.parameter)
      } else {
        await page[event.method](...event.parameter)
      }
    }
  } catch (err) {
    const errorMessage = {
      success: false,
      message: err.toString(),
      userMessage: event.message,
    }
    addNewLog(id, err.toString(), false);
    console.log('Catch Error:', errorMessage);
    throw errorMessage;
  }

  await browser.close();
  return {
    success: true,
    message: `${sample.title} 完成`,
  };
};
