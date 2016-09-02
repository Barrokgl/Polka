var express = require('express');
var router = express.Router();
var HttpError = require('../libs/error').HttpError;

/* GET home page. */
router.get('/', require('./homepage').get);

/* GET login page. */
router.get('/login', require('./login').get);

/* Post login handler*/
router.post('/login', require('./login').post);

/* Post logout handler */
router.get('/logout', require('./logout').get);

/* Post Registration handler */
router.post('/registration', require('./registration').post);

/* GET addbook page */
router.get('/addbook', require('./addbook').get);

/* Post addbook handler*/
router.post('/addbook', require('./addbook').post);

/* Get profile handler */
router.get('/profile', require('./profile').get);

/* get book */
router.get('/book/:bookname', require('./book').get);

/* admin panel */
router.get('/admin', require('./admin').get);
/* get books */
router.get('/admin/books', require('./admin').book);

module.exports = router;

