var config = require('../config');
var users = require('../api/dao');
var file = config.get('dbs:userstable');

module.exports = function (req, res, next) {
  req.user = res.locals.user = null;
  if (!req.session.user) {
      return next()
  }
  users.checkUser(file, req.session.user, function (exist) {
      if (!exist) {
          req.session.destroy();
          res.redirect('/login')
      } else {
          req.user = res.locals.user = req.session.user;
          next()
      }
  });

};