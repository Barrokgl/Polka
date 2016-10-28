var dao = require('api/dao');
var file = require('config').get('dbs:bookstable');
var HttpError = require('libs/error').HttpError;
var log = require('libs/logs')(module);
var config = require('config');
var fs = require('fs');

exports.get = function (req, res, next) {
    console.log(req.params.bookid);
    //transform to array-like object
    //костыль... просто листай дальше
    var bookid = [{id: req.params.bookid}];
    // get book by id
    dao.getRequestedBook(bookid, function (book) {
        if (book) {
            if (req.user) {
                dao.filterUsersItems(book[0].id, req.user.books, function (value) {
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
    var bookid = [{id: req.params.bookid}];
    if (req.user) {
        if (req.session.user.admin) {
            dao.getRequestedBook(bookid, function (book) {
                console.log(book);
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
                var bookid = [{id: req.params.bookid}];
                // get this book
                dao.getRequestedBook(bookid, function (book) {
                    // delete old image
                    fs.unlink('public/'+book[0].bookimage , function (err) {
                        if (err) throw new Error(err);
                        console.log('delete old image');
                        // add new image
                        dao.editModelInfo(file, bookid, fields, function () {
                            res.status(200).send('обложка книги обновлена');
                        });
                    });
                });
            } else {
                fs.unlink('public/'+fields.bookimage , function (err) {
                    if (err) throw new Error(err);
                    console.log('deleted broken image')
                });
                res.status(401).send('Картинка не соотвествует формату');
            }
        })
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};
