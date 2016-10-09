var dao = require('api/dao');
var config = require('config');
var fs = require('fs');
var HttpError = require('libs/error').HttpError;

exports.get = function(req, res) {
    if (req.session.user) {
        dao.getRequestedBook(config.get('dbs:bookstable'), req.user.books, function (books) {
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
            require('libs/logs')(module).info('adding book with id: '+book[0].id);
            dao.addBooksToUser(config.get('dbs:userstable'), req.user.id, book[0].id, function (books) {
                req.session.user.books = books;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    })
};

exports.removeBook = function (req, res, next) {
    var bookid = [parseInt(req.body.bookid)];
    dao.getRequestedBook(config.get('dbs:bookstable'), bookid, function (book) {
        if (book) {
            require('libs/logs')(module).info('removing book with id: '+book[0].id);
            dao.removeBookFromUser(config.get('dbs:userstable'), req.user.id, book[0].id, function (books) {
                req.session.user.books = books;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    })
};

exports.edit = function (req, res, next) {
    if (req.session.user) {
        res.render('edit_profile', {title: 'Edit profile'});
    } else {
        res.redirect('/login');
    }
};

exports.uploadImg = function (req, res, next) {
    if (req.session.user) {
        dao.parseForm(req, res, function (fields, filetype) {
            if (filetype == 'image/jpeg' || filetype == 'image/png') {
                //delete old icon
                fs.unlink('public/'+req.user.icon , function (err) {
                    if (err) throw new Error(err);
                    console.log('delete old image')
                });
                //add new icon
                req.user.icon = fields.userimage;
                //update user profile
                dao.editItemInfo(config.get('dbs:userstable'), req.user.id, req.user, function (updatedUser) {
                    req.session.user = updatedUser;
                    res.status(200).send('Иконка загружена');
                });
            } else {
                fs.unlink('public/'+fields.userimage , function (err) {
                    if (err) throw new Error(err);
                    console.log('deleted broken image')
                });
                res.status(200).send('Не соотвествует формату');
            }

        });
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};

exports.editProfile = function (req, res, next) {
    if (req.session.user) {
        dao.editItemInfo(config.get('dbs:userstable'), req.user.id , req.body, function (updatedUser) {
            req.session.user = req.user = updatedUser;
            res.status(200).send('Профиль обновлен')
        });
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};




