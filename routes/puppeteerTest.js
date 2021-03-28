// import { createOrder } from './createOrder';
// require
const createOrder = require('./createOrder');

async function puppeteerTest(data) {
  console.log('=== 開始前台 金流測試 ===');
  let result = await createOrder(data);
  console.log(result);
  console.log('=== 完成 ===')
}

module.exports = puppeteerTest;