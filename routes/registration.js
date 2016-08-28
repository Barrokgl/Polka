var users = require('../api/dao');
var config = require('../config');
var file = config.get('dbs:userstable');

exports.post = function (req, res) {
    console.log(req.body);
    users.checkExist(file, req.body, function (exist) {
        if (!exist) {
            users.addNewItem(req.body, file);
            req.session.user = req.body;
            res.json({
                success: true,
                answer: 'Пользователь добавлен!',
                done: true
            });

        }
        else {
            res.json({
                success: true,
                answer: 'Пользователь с таким именем или логином уже существует!'
            });
        }
    });

};
