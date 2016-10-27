var dao = require('api/dao');
var config = require('config');
var fs = require('fs');
var HttpError = require('libs/error').HttpError;

exports.get = function(req, res) {
    if (req.session.user) {
        dao.getRequestedBook(req.user.books, function (books) {
            dao.getRequestedUser(req.user.subscriptions, function (users) {
                res.render('profile', {
                    title: 'Profile',
                    polka: books,
                    subscriptions: users
                });
            });
        });
    } else {
        res.redirect('/login');
    }
};

// handle requests for edit user polka
exports.addToPolka = function(req, res, next) {
    dao.getRequestedBook([req.body], function (book) {
        if (book) {
            require('libs/logs')(module).info('adding book with id: '+book[0].id);
            dao.addItemToUser(req.user.id, req.body, function (newInfo) {
                req.session.user.books = newInfo;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    });
};

exports.removeBook = function (req, res, next) {
    dao.getRequestedBook([req.body], function (book) {
        if (book) {
            require('libs/logs')(module).info('removing book with id: '+book[0].id);
            dao.removeItemFromUser(req.user.id, req.body,  function (newInfo) {
                req.session.user.books = newInfo;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    });
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
                dao.editModelInfo(config.get('dbs:userstable'), req.user.id, req.user, function (updatedUser) {
                    req.session.user = updatedUser;
                    res.status(200).send('Иконка загружена');
                });
            } else {
                fs.unlink('public/'+fields.userimage , function (err) {
                    if (err) throw new Error(err);
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
        dao.editModelInfo(config.get('dbs:userstable'), req.user.id , req.body, function (updatedUser) {
            req.session.user = req.user = updatedUser;
            res.status(200).send('Профиль обновлен')
        });
    } else {
        next(new HttpError(403, 'Forbidden'));
    }
};

exports.addSubscription = function (req, res, next) {
    dao.addItemToUser(req.session.user.id, req.body, function (newValue) {
        req.session.user[req.body.property] = newValue;
        res.status(200).end();
    });
};

exports.removeSubscription = function (req, res, next) {
    dao.removeItemFromUser(req.session.user.id, req.body, function (newValue) {
        req.session.user[req.body.property] = newValue;
        res.status(200).end();
    });
};

exports.setBookStatus = function (req, res, next) {
    req.body.id = parseInt(req.body.id, 10);
    dao.setStatusOfUsersBook(req.body, req.user.id, function (books) {
        console.log(books);
        req.session.user.books = books;
        res.status(200).end();
    });
};
