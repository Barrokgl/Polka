exports.get = function(req, res) {
    res.render('login', { title: 'login or Sign up' });
};
exports.post = function(req, res) {
    res.json({
        success: true,
        answer: 'personal accounts almost work',
        done: true
    });
};
