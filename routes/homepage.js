var dao = require('../api/dao');

exports.get = function (req, res) {
  dao.getBooksCollection(function (doc) {
    res.render('index', {
      doc: doc
    });
  });
};
