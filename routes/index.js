var express = require('express');
var router = express.Router();
var users = require('../dao');
var formidable = require('formidable');

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
            res.json({
                success: true,
                answer: 'Пользователь добавлен!',
                done: true
            });

        }
        else {
            res.json({
                success: true,
                answer: 'Пользователь с таким именем или логином уже существует!'
            });
        }
    });

});

/* Post login handler*/

router.post('/login', function(req, res) {
    res.json({
        success: true,
        answer: 'personal accounts almost work',
        done: true
    });
});

/* GET addbook page */

router.get('/addbook', function(req, res) {
    res.status(200).render('addbook', { title: 'Add your own book' });
});

router.post('/addbook', function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'C:/Users/Barrokgl/Desktop/Polka/public/uploads';
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        console.log(fields);
        console.log(files.bookimg.File);
        res.status(200).json({success: true, answer: 'Uploaded'})
    });
});

module.exports = router;