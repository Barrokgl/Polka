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

module.exports = router;

