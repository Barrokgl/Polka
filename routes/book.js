var dao = require('api/dao');
var file = require('config').get('dbs:bookstable');
var HttpError = require('libs/error').HttpError;
var log = require('libs/logs')(module);
var config = require('config');
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
            next(new HttpError(404,'Ups, no such book'));
        }
    })
};

exports.edit = function (req, res, next) {
    var bookid = [req.params.bookid.slice(1)];
    if (req.user) {
        if (req.user.login == config.get('admin') || req.user.login == config.get('admin2')) {
            dao.getRequestedBook(file, bookid, function (book) {
                if (book) {
                    res.render('edit_book', {
                        book: book[0]
                    })
                } else {
                    next(new HttpError(500, 'Problem loading book editor'))
                }
            })
        } else {
            next(new HttpError(403, 'Forbidden'))
        }
    } else {
        res.redirect('/login');
    }
};
