var dao = require('../api/dao');

exports.get = function (req, res) {
  //TODO: use getMany method to send only sorted by types books
  Book.getAll(function (books) {
    res.render('index', {
      doc: books
    });
  });
};
