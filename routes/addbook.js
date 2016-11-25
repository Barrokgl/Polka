const fs = require('fs');
const dao = require('../api/dao');
const Book = require('api/book');
const config = require('../config');
const file = config.get('dbs:bookstable');
const log = require('../libs/logs')(module);

exports.get = function(req, res) {
    res.status(200).render('addbook', { title: 'Add your own book' });
};

exports.post = function (req, res, next) {
    dao.parseForm(req, res, function (fields, fileType) {
        Book.checkExist(fields, function (exist) {
            if (!exist) {
                Book.create(fields, () => {
                    if (fileType != 'image/jpeg' || fileType != 'image/png') {
                        fs.unlink('public/' + fields.bookimage, function (err) {
                            if (err) throw new Error(err);
                            log.warning('deleted broken image')
                        });
                        //dao.addNewItem(fields, file);
                        res.status(200).send('Успешно, но обложка не загружена');
                    } else {
                        res.status(200).send('Книга добавлена');
                    }
                });
            } else {
                res.status(400).send('Такая книга уже добавлена');
                fs.unlink('public/'+fields.bookimage, function (err) {
                    if (err) throw err;
                    log.warning('tried to load existing book')
                })
            }
        })
    });
};
