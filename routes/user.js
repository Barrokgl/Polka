var dao = require('api/dao');
var fs = require('fs');
var HttpError = require('libs/error').HttpError;

exports.get = function (req, res, next) {
    var userid = [req.params.userid.slice(1)];
    //get user by id
    dao.getRequestedUser(userid, function (user) {
        if (user) {
            if (user[0].id == req.user.id) {
                res.redirect('/profile');
            } else {
                dao.getRequestedBook(user[0].books, function (books) {
                    dao.getRequestedUser(user[0].subscriptions, function (users) {
                        dao.filterUsersItems(user[0].id, req.user.subscriptions, function (value) {
                            console.log(value);
                            res.render('user', {
                                title: user.username+' page',
                                subscribed: value,
                                userInfo: user[0],
                                polka: books,
                                subscriptions: users
                            });
                        });

                    });

                });
            }
        } else {
            next(new HttpError(404, 'Ups, no such user'))
        }
    })
};

