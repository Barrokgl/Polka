var express = require('express');
var router = express.Router();

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
router.get('/book/:bookid', require('./book').get);

/* add book to polka */
router.post('/add_to_polka', require('./profile').addToPolka);

/* remove book from polka */
router.post('/remove_book', require('./profile').removeBook);

/* admin panel */
router.get('/admin', require('./admin').get);

/* get all books */
router.get('/admin/books', require('./admin').book);

module.exports = router;

