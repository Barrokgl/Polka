var dao = require('../api/dao');

exports.get = function (req, res) {
  var books = dao.accessBookCollection(function (doc) {
    console.log(doc);
    res.render('index', {
      doc: doc
    });
  });

};
