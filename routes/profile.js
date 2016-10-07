var dao = require('api/dao');
var config = require('config');
var fs = require('fs');

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
    dao.parseForm(req, res, function (fields, filetype) {
        if (req.session.user) {
            if (filetype == 'image/jpeg' || filetype == 'image/png') {
                //delete old icon
                fs.unlink('public/'+req.user.icon , function (err) {
                    if (err) throw new Error(err);
                    console.log('deleted broken image')
                });
                //add new icon
                req.user.icon = fields.userimage.replace(/public\//i, '');
                //update user profile
                dao.editUserInfo(config.get('dbs:userstable'), req.user.id, req.user, function (updatedUser) {
                    req.session.user = updatedUser;
                    res.status(200).send('Иконка загружена');
                });
            } else {
                fs.unlink(fields.userimage , function (err) {
                    if (err) throw new Error(err);
                    console.log('deleted broken image')
                });
                res.status(200).send('Не соотвествует формату');
            }

        } else {
            res.status(403).send('Неавторизованный пользователь');
            fs.unlink(fields.userimage, function (err) {
                if (err) throw err;
                console.log('non-auth user')
            })
        }
    });
};

exports.editProfile = function (req, res, next) {
    if (req.session.user) {
        for(key in req.body) {
            if(req.body.hasOwnProperty(key)) {
                req.user[key] = req.body[key];
            }
        }
        dao.editUserInfo(config.get('dbs:userstable'), req.user.id , req.user, function (updatedUser) {
            req.session.user = updatedUser;
            res.status(200).send('Профиль обновлен')
        });
        console.log(req.user);
    } else {
        res.status(403).send('Неавторизованный пользователь');
    }

};




