var fs = require('fs');
var dao = require('../api/dao');
var config = require('../config');
var file = config.get('dbs:bookstable');

exports.get = function(req, res) {
    res.status(200).render('addbook', { title: 'Add your own book' });
};

exports.post = function (req, res, next) {
    dao.parseForm(req, res, function (fields, fileType) {
        console.log(fileType);
        dao.checkBook(file, fields, function (exist) {
            console.log(fields);
            if (!exist) {
                if (fileType == 'image/jpeg' || fileType == 'image/png') {
                    dao.addNewItem(fields, file);
                    res.status(200).json({success: true, answer: 'Uploaded', done: true});
                } else {
                    fs.unlink(fields.bookimage, function (err) {
                        if (err) throw err;
                        console.log('deleted')
                    });
                    dao.addNewItem(fields, file);
                    res.status(200).json({success: true, answer: 'Success, but image is broken', done: true});
                }
            } else {
                res.status(200).json({success: true, answer: 'not uploaded'});
                fs.unlink(fields.bookimage, function (err) {
                    if (err) throw err;
                    console.log('deleted')
                })
            }
        })
    });
};
