const dao = require('../api/dao');
const Book = require('api/book');

exports.get = function (req, res, next) {
  //TODO: use getMany method to send only sorted by types books
  Book.getAll()
      .then(books => {
          res.render('index', {
              doc: books
          });
      })
      .catch(err => next(err));
};
