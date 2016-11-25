const dao = require('api/dao');
const Book = require('api/book');
const User = require('api/user');
const file = require('config').get('dbs:bookstable');
const HttpError = require('libs/error').HttpError;
const log = require('libs/logs')(module);
const config = require('config');
const fs = require('fs');

exports.get = function (req, res, next) {
    Book.get(req.params.bookid, function (book) {
        console.log(book);
        if (book) {
            if (req.user) {
                User.filterItems(book._id, req.user.books, function (value) {
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
            next(new HttpError(404,'Ups, no such book'));
        }
    })
};

exports.edit = function (req, res, next) {
    if (req.user) {
        if (req.session.user.admin) {
            Book.get(req.params.bookid , function (book) {
                if (book) {
                    res.render('edit_book', {
                        book: book
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

exports.editBook = function (req, res, next) {
    if (req.session.user.admin) {
        var bookid = [{id: req.params.bookid}];
        dao.editModelInfo(file, bookid , req.body, function (updatedBook) {
            res.status(200).send('Книга обновлена')
        });
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};

exports.uploadBookCover = function (req, res, next) {
    if(req.session.user.admin) {
        // parse form with image
        dao.parseForm(req, res, function (fields, filetype) {
            if (filetype == 'image/jpeg' || filetype == 'image/png') {
                // get this book
                Book.get(req.params.bookid, function (book) {
                    // delete old image
                    fs.unlink('public/'+book.bookimage , function (err) {
                        if (err) {throw new Error(err)};
                        console.log('delete old image');
                        // add new image
                        dao.editModelInfo(file, bookid, fields, function () {
                            res.status(200).send('обложка книги обновлена');
                        });
                    });
                });
            } else {
                fs.unlink('public/'+fields.bookimage , function (err) {
                    if (err) {throw new Error(err)};
                    console.log('deleted broken image')
                });
                res.status(401).send('Картинка не соотвествует формату');
            }
        })
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};
