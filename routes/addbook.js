var fs = require('fs');
var dao = require('../api/dao');
var config = require('../config');
var file = config.get('dbs:bookstable');
var log = require('../libs/logs')(module);

exports.get = function(req, res) {
    res.status(200).render('addbook', { title: 'Add your own book' });
};

exports.post = function (req, res, next) {
    dao.parseForm(req, res, function (fields, fileType) {
        dao.checkBook(file, fields, function (exist) {
            if (!exist) {
                if (fileType == 'image/jpeg' || fileType == 'image/png') {
                    dao.addNewItem(fields, file);
                    res.status(200).send('Книга добавлена');
                } else {
                    fs.unlink(fields.bookimage, function (err) {
                        if (err) throw new Error(err);
                        log.warning('deleted broken image')
                    });
                    //dao.addNewItem(fields, file);
                    res.status(200).send('Успешно, но обложка не загружена');
                }
            } else {
                res.status(400).send('Такая книга уже добавлена');
                fs.unlink(fields.bookimage, function (err) {
                    if (err) throw err;
                    log.warning('tried to load existing book')
                })
            }
        })
    });
};
