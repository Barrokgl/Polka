var express = require('express');
var router = express.Router();
var users = require('../dao');

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
router.post('/registration', function (req, res) {
    users.checkExist(req.body, function (exist) {
        if (!exist) {
            users.addUser(req.body);
            res.json({success: true, answer: 'Пользователь добавлен!'});
            //res.redirect('back');
        }
        if (exist){res.json({success: true, answer: 'Пользователь с таким именем или логином уже существует!'});}
    });
    // res.json({success: true});
    // res.redirect('back');
});

module.exports = router;
