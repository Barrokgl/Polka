const User = require('api/user');

exports.post = function (req, res) {
    User.create(req.body)
        .then(user => {
            if(user){
                req.session.user = res.locals.user = req.body;
                res.status(201).end();
            } else {
                res.status(400).send('Пользователь с таким именем или логином уже существует');
            }
        })
        .catch(err => next(err));
};
