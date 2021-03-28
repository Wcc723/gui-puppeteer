// import { createOrder } from './createOrder';
// require
const worker = require('./worker');

async function puppeteerTest(data) {
  console.log('=== 開始前台 金流測試 ===');
  try {
    return await worker(data);
  } catch (err) {
    return err;
  }
  // console.log('=== 開始前台 金流測試結束 ===');
}

module.exports = puppeteerTest;
