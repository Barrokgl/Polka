var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Polka.ru - рекомендательный книжный сервис' });
// });
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('imgIndexInfo');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render('index', {
            docs : docs,
            title: "Polka.ru"
        });
    });
});
/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'login or Sign up' });
});
/* Post Registration handler */
router.post('/login', function (req, res) {
    res.send('Succes!');
})

module.exports = router;
