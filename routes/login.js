var users = require('../api/dao');
var config = require('../config');
var file = config.get('dbs:userstable');

exports.get = function(req, res) {
    res.render('login', { title: 'login or Sign up' });
};
exports.post = function(req, res) {
    users.userAuthentication(file, req.body, function (auth) {
        if (auth) {
            req.session.user = auth;
            res.json({
                success: true,
                answer: 'Готово!',
                done: true
            });
        } else {
            res.json({
                success: true,
                answer: 'Неправильный логин или пароль'
        })}
    });
};
