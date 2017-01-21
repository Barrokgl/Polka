var express = require('express');
var router = express.Router();

//homepage

/* GET home page. */
router.get('/', require('./homepage').get);

//auth

/* GET login page. */
router.get('/login', require('./login').get);

/* Post login handler*/
router.post('/login', require('./login').post);

/* Post logout handler */
router.get('/logout', require('./logout').get);

/* Post Registration handler */
router.post('/registration', require('./registration').post);

//books

/* get book */
router.get('/book/:bookid/', require('./book').get);

/* edit book GET handler*/
router.get('/edit_book/:bookid', require('./book').edit);

/* edit book POST handler*/
router.post('/edit_book/:bookid', require('./book').editBook);

/* upload bookcover */
router.post('/upload_bookcover/:bookid', require('./book').uploadBookCover);

/* GET addbook page */
router.get('/addbook', require('./addbook').get);

/* Post addbook handler*/
router.post('/addbook', require('./addbook').post);

//user

/* Get profile handler */
router.get('/profile', require('./profile').get);

/* add book to polka */
router.post('/add_to_polka', require('./profile').addToPolka);

/* remove book from polka */
router.post('/remove_book', require('./profile').removeBook);

/* edit user's profile */
router.get('/edit_profile', require('./profile').edit);

router.post('/edit_profile', require('./profile').editProfile);

/* upload profile icon */
router.post('/upload_img', require('./profile').uploadImg);

/* get other user's page */
router.get('/user/:userid', require('./user').get);

/* subscript on %user% page */
router.post('/add_subscription', require('./profile').addSubscription);

/* unsubscript on %user% page */
router.post('/remove_subscription', require('./profile').removeSubscription);

/* set book on shelf status */
router.post('/set_book_status', require('./profile').setBookStatus);

//admin

/* admin panel */
router.get('/admin', require('./admin').get);

/* get all books */
router.get('/admin/books', require('./admin').book);

/* sitemap page*/
router.get('/sitemap', require('./admin').sitemap);

/* about page */
router.get('/about', (req, res, next) => {
    res.render('about');
});

/* library page */
router.get('/library', (req, res, next) => {
    res.render('library');
});

// chats

/* chats mainpage */
router.get('/chats', require('./chat').get);

module.exports = router;

