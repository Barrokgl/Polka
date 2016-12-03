const config = require('../config');
const HttpError = require('../libs/error').HttpError;
const dao = require('../api/dao');
const User = require('api/user');
const Book = require('api/book');

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
        Book.getAll()
            .then(books => {
                res.render('adminpanel/adminbooks', {books: books});
            })
            .catch(err => next(err));
    } else {
        next(new HttpError(403, 'Forbidden'))
    }
};

exports.sitemap = function (req, res, next) {
    Book.getAll()
        .then(books => {
            User.getAll()
                .then(users => {
                    res.render('sitemap',{
                        title: 'Карта сайта',
                        books: books,
                        users: users
                    });
                });
        })
        .catch(err => next(err));
};