const express = require('express');
const router = express.Router();
const tester = require('./puppeteerTest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

console.log('aa');
router.post('/start-test', function(req, res, next) {
  const data = req.body;
  const { timestamp } = data;
  if (!timestamp) {
    res.send({
      success: false,
      message: '缺少 timestamp'
    })
    res.end();
    return;
  }
  tester.puppeteerTest(data, timestamp)
    .then(response=> {
      console.log('/start-test success', response);
      res.send(response)
      res.end();
    }).catch(err => {
      console.log('/start-test fail', err);
      res.send(err);
      res.end();
  })
});

router.post('/multi-start', function(req, res, next) {
  const data = req.body;
  const { timestamp, works } = data;
  tester.multiplePuppeteerTest(works, timestamp)
    .then(response=> {
      console.log('/start-test success', response);
      res.send(response)
      res.end();
    }).catch(err => {
    console.log('/start-test fail', err);
    res.send(err);
    res.end();
  })
})

module.exports = router;
