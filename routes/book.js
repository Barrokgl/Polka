var dao = require('../api/dao');
var file = require('../config').get('dbs:bookstable');
var HttpError = require('../libs/error').HttpError;

exports.get = function (req, res, next) {
    var url = decodeURI(req.params.bookname.slice(1));
    dao.getRequestedBook(file, url, function (book) {
        if (book) {
            res.render('book', {book: book})
        } else {
            next(new HttpError(404, 'Ups, no such book'));
        }
    })
};
