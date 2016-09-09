var dao = require('api/dao');
var file = require('config').get('dbs:bookstable');
var HttpError = require('libs/error').HttpError;
var log = require('libs/logs')(module);

exports.get = function (req, res, next) {
    //transform to array-like object
    var bookid = [req.params.bookid.slice(1)];
    dao.getRequestedBook(file, bookid, function (book) {
        if (book) {
            if (req.user) {
                dao.filterUsersBooks(book[0].id, req.user.books, function (value) {
                    res.render('book', {
                        book: book[0],
                        bookAdded: value
                    })
                })
            } else {
                res.render('book', {
                    book: book[0]
                })
            }
        } else {
            next(new HttpError(404, 'Ups, no such book'));
        }
    })
};
