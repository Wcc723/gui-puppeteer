const worker = require('./worker');
const firebaseAdmin = require('../helpers/firebaseInit');
const db = firebaseAdmin.database();
const logRef = db.ref('/logs');

async function puppeteerTest(data, timestamp) {
  console.log('=== 開始測試 ===');
  logRef.child(timestamp).set({
    title: data.title,
    host: data.host,
  });
  try {
    return await worker(data, timestamp);
  } catch (err) {
    console.log('puppeteerTest err:', err);
    throw err;
  }
  // console.log('=== 開始前台 金流測試結束 ===');
}

async function multiplePuppeteerTest(data, timestamp) {
  console.log('=== 序列測試 ===', timestamp);
  logRef.child(timestamp).set({
    title: '序列測試',
  });
  try {
    let result = {};
    console.log('try');
    for (let index = 0; index < data.length; index++) {
      const work = data[index];
      result = await worker(work, timestamp);
    }
    return result;
  } catch (err) {
    console.log('puppeteerTest err:', err);
    throw err;
  }
  // console.log('=== 開始前台 金流測試結束 ===');
}

module.exports = {
  puppeteerTest,
  multiplePuppeteerTest,
};
