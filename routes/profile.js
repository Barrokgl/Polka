var dao = require('api/dao');
var config = require('config');


exports.get = function(req, res) {
    console.log('in');
    if (req.session.user) {
        console.log('in2');
        dao.getRequestedBook(config.get('dbs:bookstable'), req.user.books, function (books) {
            console.log(books);
            console.log(books[0]);
            res.render('profile', {
                title: 'Profile',
                polka: books
            });
        });
    } else {
        res.redirect('/login');
    }
};

// handle requests for edit user polka
exports.addToPolka = function(req, res, next) {
    var bookid = [parseInt(req.body.bookid)];
    dao.getRequestedBook(config.get('dbs:bookstable'), bookid, function (book) {
        if (book) {
            require('libs/logs')(module).info('adding book: '+book.id);
            dao.addBooksToUser(config.get('dbs:userstable'), req.user.id, book[0].id, function (books) {
                req.session.user.books = books;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    })
};




