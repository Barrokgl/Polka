var dao = require('api/dao');
var config = require('config');


exports.get = function(req, res) {
    if (req.session.user) {
        console.log(req.polka);
        res.render('profile', {
            title: 'Profile',
            polka: req.polka
        });
    } else {
        res.redirect('/login');
    }
};

// handle requests for edit user polka
exports.addToPolka = function(req, res, next) {
    dao.getRequestedBook(config.get('dbs:bookstable'), req.body.bookid, function (book) {
        if (book) {
            dao.addBooksToUser(config.get('dbs:userstable'), req.user.id, book.id, function (books) {
                req.session.user.books = books;
                res.status(200).end();
            });
        } else {
            res.status(500).end();
        }
    })
};




