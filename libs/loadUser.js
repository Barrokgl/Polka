var config = require('config');
var users = require('api/dao');
var file = config.get('dbs:userstable');

module.exports = function (req, res, next) {
  req.user = res.locals.user = null;
  // if no opened sessions give it to next middleware
  if (!req.session.user) {
      next()
  } else {
      // check user in our db using session data
      users.checkUser(file, req.session.user, function (exist) {
          // if no such user, this means bad session or some bug
          // so we break current session end redirect to login
          if (!exist) {
              req.session.destroy();
              res.redirect('/login');
          // if user exist write his data to req and
          // req.locals properties and give it to next middleware
          } else {
              req.user = res.locals.user = req.session.user;
              next()
          }
      });
  }
};