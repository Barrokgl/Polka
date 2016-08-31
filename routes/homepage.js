var dao = require('../api/dao');

exports.get = function (req, res) {
  dao.accessBookCollection(function (doc) {
    res.render('index', {
      doc: doc
    });
  });
};
