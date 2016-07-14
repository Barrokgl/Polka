var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Polka.ru - рекомендательный книжный сервис' });
});
/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login or Sign up' });
});
module.exports = router;
