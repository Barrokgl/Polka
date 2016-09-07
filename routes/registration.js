var users = require('api/dao');
var config = require('config');
var file = config.get('dbs:userstable');

exports.post = function (req, res) {
    // check user
    users.checkUser(file, req.body, function (exist) {
        if (!exist) {
            users.addNewItem(req.body, file);
            req.session.user = req.body.user;
            res.status(201).end();
        }
        else {
            res.status(400).send('Пользователь с таким именем или логином уже существует');
        }
    });

};
