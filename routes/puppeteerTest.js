const worker = require('./worker');

async function puppeteerTest(data) {
  console.log('=== 開始測試 ===');
  try {
    return await worker(data);
  } catch (err) {
    console.log('puppeteerTest err:', err);
    throw err;
  }
  // console.log('=== 開始前台 金流測試結束 ===');
}

async function multiplePuppeteerTest(data) {
  console.log('=== 序列測試 ===');
  try {
    let result = {};
    console.log('try');
    for (let index = 0; index < data.length; index++) {
      const work = data[index];
      result = await worker(work);
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
