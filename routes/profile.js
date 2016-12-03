const dao = require('api/dao');
const User = require('api/user');
const Book = require('api/book');
const config = require('config');
const fs = require('fs');
const HttpError = require('libs/error').HttpError;
const log = require('libs/logs')(module);

exports.get = function(req, res, next) {
    if (req.session.user) {
        Book.getMany(req.user.books)
            .then(books => {
                User.getMany(req.user.subscriptions)
                    .then(users => {
                        res.render('profile', {
                            title: 'Profile',
                            polka: books,
                            subscriptions: users
                        });
                    });
            })
            .catch(err => next(err));
    } else {
        res.redirect('login');
    }
};

// handle requests for edit user polka
exports.addToPolka = function(req, res, next) {
    let bookid = req.body._id;
    Book.get(bookid)
        .then(book => {
            if (book) {
                require('libs/logs')(module).info('adding book with id: '+book.id);
                User.addBook(req.user._id, req.body)
                    .then(newInfo => {
                        req.session.user = req.user = newInfo;
                        res.status(200).end();
                    })
                    .catch(err => next(err));
            } else {
                res.status(500).end();
            }
        })
        .catch(err => next(err));
};

exports.removeBook = function (req, res, next) {
    let bookid = req.body.id;
    Book.get(bookid)
        .then(book => {
            if (book) {
                require('libs/logs')(module).info('removing book with id: '+book._id);
                User.removeBook(req.user._id, req.body)
                    .then(newInfo => {
                        req.session.user = req.user = newInfo;
                        res.status(200).end();
                    })
                    .catch(err => next(err));
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
                if (req.user.icon) {
                    fs.unlink('public/'+req.user.icon , function (err) {
                        if (err) throw new Error(err);
                        console.log('delete old image')
                    });
                }//add new icon
                req.user.icon = fields.userimage;
                //update user profile
                User.update(req.user._id, req.user)
                    .then(user => {
                        if (user) {
                            req.session.user = req.user = user;
                            res.status(200).send('Иконка загружена');
                        } else {
                            res.status(500).send('Что-то пошло не так');
                        }
                    })
                    .catch(err => next(err));
            } else {
                fs.unlink('public/'+fields.userimage , function (err) {
                    if (err) {
                        next(err);
                    };
                    console.log('deleted broken image')
                });
                res.status(401).send('Не соотвествует формату');
            }
        });
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};

exports.editProfile = function (req, res, next) {
    if (req.session.user) {
        User.update(req.user._id, req.body)
            .then(user => {
                if(user) {
                    req.session.user = req.user = user;
                    res.status(200).send('Профиль обновлен');
                } else {
                    next(new HttpError(500, 'Что-то пошло не так...'))
                }
            })
            .catch(err => next(err));
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};

exports.addSubscription = function (req, res, next) {
    User.addSubscription(req.session.user._id, req.body)
        .then(user => {
            req.session.user = user;
            res.status(200).end();
        })
        .catch(err => next(err));
};

exports.removeSubscription = function (req, res, next) {
    User.removeSubcription(req.session.user._id, req.body)
        .then(user => {
            req.session.user = req.user = user;
            res.status(200).end();
        })
        .catch(err => next(err));
};

exports.setBookStatus = function (req, res, next) {
    User.setStatusOfBook(req.user._id, req.body)
        .then(user => {
            req.session.user = req.user = user;
            res.status(200).end();
        })
        .catch(err => next(err));
};
