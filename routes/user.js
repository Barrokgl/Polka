//var dao = require('api/dao');
const fs = require('fs');
const HttpError = require('libs/error').HttpError;
const User = require('api/user');
const Book = require('api/book');

exports.get = function (req, res, next) {
    //let userid = [{_id:req.params.userid}];
    let userId = req.params.userid;
    User.get(userId, (user)=>{
        if (user){
            console.log(user);
            if (req.user && user._id == req.user.id) {
                res.redirect('/profile');
            } else {
                Book.getMany(user.books, (books)=>{
                    console.log(books);
                    User.getMany(user.subscriptions, (users)=>{
                        if (req.user) {
                            User.filterItems(user._id, req.user.subscriptions, (value)=>{
                                res.render('user', {
                                    title: user.username+' page',
                                    subscribed: value,
                                    userInfo: user,
                                    polka: books,
                                    subscriptions: users
                                });
                            });
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
        } else {
            next(new HttpError(404, 'Ups, no such user'));
        }
    });
    //get user by id
    // dao.getRequestedUser(userid, function (user) {
    //     console.log(user);
    //     if (user) {
    //         if (req.user && user[0].id == req.user.id) {
    //             res.redirect('/profile');
    //         } else {
    //             dao.getRequestedBook(user[0].books, function (books) {
    //                 dao.getRequestedUser(user[0].subscriptions, function (users) {
    //                     if (req.user) {
    //                         dao.filterUsersItems(user[0].id, req.user.subscriptions, function (value) {
    //
    //                             res.render('user', {
    //                                 title: user.username+' page',
    //                                 subscribed: value,
    //                                 userInfo: user[0],
    //                                 polka: books,
    //                                 subscriptions: users
    //                             });
    //                         });
    //                     } else {
    //                         res.render('user', {
    //                             title: user[0].username+' page',
    //                             subscribed: undefined,
    //                             userInfo: user[0],
    //                             polka: books,
    //                             subscriptions: users
    //                         });
    //                     }
    //                 });
    //
    //             });
    //         }
    //     } else {
    //         next(new HttpError(404, 'Ups, no such user'))
    //     }
    // })
};

