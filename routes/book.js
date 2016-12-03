const dao = require('api/dao');
const Book = require('api/book');
const User = require('api/user');
const file = require('config').get('dbs:bookstable');
const HttpError = require('libs/error').HttpError;
const log = require('libs/logs')(module);
const config = require('config');
const fs = require('fs');

exports.get = function (req, res, next) {
    Book.get(req.params.bookid)
        .then(book => {
            if(book) {
                if(req.user){
                    User.filterItems(book._id, req.user.books)
                        .then(value => {
                            console.log(value);
                            res.render('book', {
                                book: book,
                                bookAdded: value
                            });
                        });
                } else {
                    res.render('book', {
                        book: book
                    });
                }
            } else {
                next(new HttpError(404, 'Ups, no such book'));
            }
        })
        .catch(err => next(err));
};

exports.edit = function (req, res, next) {
    if (req.user) {
        if (req.session.user.admin) {
            Book.get(req.params.bookid)
                .then(book => {
                    if(book) {
                        res.render('edit_book',{
                            book: book
                        });
                    } else {
                        next(new HttpError(500, 'Problem loading book editor'));
                    }
                })
                .catch(err => next(err));
        } else {
            next(new HttpError(403, 'Forbidden'))
        }
    } else {
        res.redirect('/login');
    }
};

exports.editBook = function (req, res, next) {
    if (req.session.user.admin) {
        let bookId = req.params.bookid;
        Book.update(bookId, req.body)
            .then(book => {
                if(book) {
                    res.status(200).send('Книга обновлена');
                }
            })
            .catch(err => next(err));
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
                let bookId = req.params.bookid;
                Book.get(bookId)
                    .then(book => {
                        fs.unlink('public/'+book.bookimage, (err) => {
                            if(err) {
                                next(err);
                            }
                            Book.update(bookId, fields)
                                .then(book => {
                                    if (book) {
                                        res.status(200).send('обложка книги обновлена');
                                    } else {
                                        res.status(500).send('Что-то пошло не так');
                                    }
                                })
                                .catch(err => next(err));
                        });
                    })
                    .catch(err => next(err));
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
