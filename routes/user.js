//var dao = require('api/dao');
const fs = require('fs');
const HttpError = require('libs/error').HttpError;
const User = require('api/user');
const Book = require('api/book');

exports.get = function (req, res, next) {
    let userId = req.params.userid;
    User.get(userId)
        .then(user => {
            if(req.user && user._id == req.user._id) {
                res.redirect('profile');
            } else {
                Book.getMany(user.books)
                    .then(books => {
                        User.getMany(user.subscriptions)
                            .then(users => {
                                if (req.user) {
                                    User.filterItems(user._id, req.user.subscriptions)
                                        .then(value => {
                                            res.render('user', {
                                                title: user.username+' page',
                                                subscribed: value,
                                                userInfo: user,
                                                polka: books,
                                                subscriptions: users
                                            });
                                        })
                                } else {
                                    res.render('user', {
                                        title: user.username+' page',
                                        subscribed: undefined,
                                        userInfo: user,
                                        polka: books,
                                        subscriptions: users
                                    });
                                }
                            });
                    });
            }
        })
        .catch(err => next(err));
};

