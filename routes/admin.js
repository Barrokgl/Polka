var config = require('../config');
var HttpError = require('../libs/error').HttpError;
var dao = require('../api/dao');

exports.get = function (req, res, next) {
    if (req.user) {
        if (req.user.login == config.get('admin') || req.user.login == config.get('admin2')) {
            req.session.admin = true;
            res.render('adminpanel/admin')
        } else {
            next(new HttpError(403, 'Forbidden'))
        }
    } else {
        res.redirect('/login');
    }

};
exports.book = function (req, res, next) {
    if (req.session.admin) {
        dao.accessBookCollection(function (books) {
            res.render('adminpanel/adminbooks', {books: books})
        });
    } else {
        next(new HttpError(403, 'Forbidden'))
    }
};
