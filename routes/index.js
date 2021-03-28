var express = require('express');
var router = express.Router();
const puppeteerTest = require('./puppeteerTest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

console.log('aa');
router.post('/start-test', function(req, res, next) {
  const data = req.body;
  console.log('puppeteerTest', data);
  puppeteerTest(data);
  res.send();
})

module.exports = router;
