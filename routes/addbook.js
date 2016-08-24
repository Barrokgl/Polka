var books = require('../api/books');

exports.get = function(req, res) {
    res.status(200).render('addbook', { title: 'Add your own book' });
};

exports.post = function (req, res, next) {
    books.parseForm(req, res, function (fields) {
        books.checkExist(fields, function (exist) {
            if (!exist) {
                //books.addBook(fields);
                res.status(200).json({success: true, answer: 'Uploaded'});
            } else {
                res.status(200).json({success: true, answer: 'not uploaded'});
            }
        })
    });
};
