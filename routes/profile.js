var dao = require('api/dao');
var file = require('config').get('dbs:bookstable');


exports.get = function(req, res) {
    if (req.session.user) {
        res.render('profile', { title: 'Profile' });
    } else {
        res.redirect('/login');
    }
};

// handle requests for edit user polka
exports.addToPolka = function(req, res, next) {

    dao.getRequestedBook(file, url, function (book) {
        if (book) {
            require('libs/logs')(module).info(book.id);
            res.status(200).end();
        } else {
            res.status(500).end();
        }
    })
};