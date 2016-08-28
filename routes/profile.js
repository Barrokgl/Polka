exports.get = function(req, res) {
    if (req.session.user) {
        res.render('profile', { title: 'Profile' });
    } else {
        res.redirect('/login');
    }
};
