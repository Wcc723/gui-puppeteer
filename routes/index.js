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
  puppeteerTest(data)
    .then(response=> {
      console.log(response);
      res.send(response)
      res.end();
    }).catch(err => {
      console.log(err);
      res.send(err);
      res.end();
  })
})

module.exports = router;
