var users = require('../api/dao');
var config = require('../config');
var file = config.get('dbs:userstable');

exports.get = function(req, res) {
    res.render('login', { title: 'login or Sign up' });
};
exports.post = function(req, res) {
    users.userAuthentication(file, req.body, function (auth) {
        if (auth) {
            //if remember set cookie maxAge 2 weeks
            if (req.body.remember) {
                var hour = 3600000;
                req.session.cookie.maxAge = 14 * 24 * hour;
            } else {
                req.session.cookie.expires = false;
            }
            //OK
            req.session.user = auth;
            res.status(202).end();
        } else {
            res.status(400).send('Неправильный логин или пароль').end()
        }
    });
};
