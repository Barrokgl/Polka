const config = require('config');
const dao = require('api/dao');
const User = require('api/user');

module.exports = function (req, res, next) {
  req.user = res.locals.user = null;
  // if no opened sessions give it to next middleware
  if (!req.session.user) {
      next()
  } else {
      // check user in our db using session data
      User.get(req.session.user.id, function (exist) {
          // if no such user, this means bad session or some bug
          // so we break current session end redirect to login
          if (!exist) {
              req.session.destroy();
              res.redirect('/login');
              console.log('destroy session');
          // if user exist write his data to req and
          // req.locals properties and give it to next middleware
          } else {
              if (req.session.user.login == config.get('admin') || req.session.user.login == config.get('admin2')) {
                  req.session.user.admin = true;
              }
              req.user = res.locals.user = req.session.user;
              next()
          }
      });
  }
};