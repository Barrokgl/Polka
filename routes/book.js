var dao = require('api/dao');
var file = require('config').get('dbs:bookstable');
var HttpError = require('libs/error').HttpError;
var log = require('libs/logs')(module);

exports.get = function (req, res, next) {
    log.info(req.params.bookid);
    dao.getRequestedBook(file, req.params.bookid.slice(1), function (book) {
        if (book) {
            if (req.user) {
                dao.filterUsersBooks(book.id, req.user.books, function (value) {
                    res.render('book', {
                        book: book,
                        bookAdded: value
                    })
                })
            } else {
                res.render('book', {
                    book: book
                })
            }
        } else {
            next(new HttpError(404, 'Ups, no such book'));
        }
    })
};
