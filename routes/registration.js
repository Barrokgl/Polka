const User = require('api/user');

exports.post = function (req, res) {
    User.create(req.body, (err, user) => {
        if (err) {
            res.status(400).send('Пользователь с таким именем или логином уже существует');
        } else {
            req.session.user = res.locals.user = req.body;
            res.status(201).end();
        }
    });
};
