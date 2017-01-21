
const chats = [
    {
        name: 'Java',
    },
    {
        name: 'JavaScript',
    },
    {
        name: 'Python',
    },
    {
        name: 'Go',
    }
];

exports.get = function(req, res, next) {
    res.status(200).render('chat', {
        title: 'Chats',
        chats: chats
    });
};