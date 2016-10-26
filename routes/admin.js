var config = require('../config');
var HttpError = require('../libs/error').HttpError;
var dao = require('../api/dao');

exports.get = function (req, res, next) {
    if (req.user) {
        if (req.session.user.admin) {
            res.render('adminpanel/admin')
        } else {
            next(new HttpError(403, 'Forbidden'))
        }
    } else {
        res.redirect('/login');
    }
};

exports.book = function (req, res, next) {
    if (req.session.user.admin) {
        dao.getBooksCollection(function (books) {
            res.render('adminpanel/adminbooks', {books: books})
        });
    } else {
        next(new HttpError(403, 'Forbidden'))
    }
};

exports.sitemap = function (req, res, next) {
    dao.getBooksCollection(function (books) {
       dao.getUsersCollection(function (users) {
           res.render('sitemap',{
               title: 'Карта сайта',
               books: books,
               users: users
           })
       });
    });
};