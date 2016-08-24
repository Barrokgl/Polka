var fs = require('fs');
var formidable = require('formidable');
var config = require('../config');
var file = config.get('dbs:bookstable');
var upload = config.get('uploaddir');

//parse incoming form
function parseIncommingForm(req, res, callback) {
    var fields = {};
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = upload;
    form.keepExtensions = true;
    //error handler
    form.on('error', function(err) {
        if (err) throw err;
    });
    //call back when each field in the form is parsed.
    form.on('field', function (field, value) {
        fields[field] = value;
    });
    //Call back when each file in the form is parsed.
    form.on('file', function (name, file) {
        fields[name] = file.path;
    });
    //Call back at the end of the form.
    form.on('end', function () {
        //res.status(200).json({success: true, answer: 'Uploaded'});
        callback(fields)
    });
    form.parse(req);
}

// trans stream to string
function reading(callback) {
    var readStream = fs.createReadStream(file, {encoding: 'utf-8'}, function(err){if (err) {console.log(err);}});
    var str = '';
    readStream.on('data', function (data) {
        str += data;
    });
    readStream.on('end', function () {
        callback(str);
    });
}

// transformToObject data to object with keys - headers and values - our books
function transform(textToTrans) {
    textToTrans = textToTrans.split('\n');
    var headers = textToTrans[0].split('|');
    var objCsv = [];
    for (i=1; i<textToTrans.length; i++) {
        var bigData = textToTrans[i].split('|');
        var newObj = {};
        for (j=0; j<bigData.length;j++) {
            newObj[headers[j]] = bigData[j];
        }
        objCsv.push(newObj);
    }
    return objCsv;
}

//compare our books with props of newbook
var checkArr = [];
function cheking(text, book, callback) {
    for (i=0; i<text.length;i++){
        if (text[i].bookname == book.bookname && text[i].author == book.author) {
            console.log('exists!'); checkArr.push(text[i]);
        }
        else {console.log('no match');}
    }
    callback(checkArr.length !== 0)

}

//transformToObject new book to a string and add to file
function adding(bookToAdd, id) {
    var finBook, arrVal = [];
    //push bookId
    arrVal.push(id);
    for (var key in bookToAdd) {
        if (bookToAdd.hasOwnProperty(key)){
            arrVal.push(bookToAdd[key]);
            finBook = arrVal.join('|');
        } else {throw error}
    }
    //write stream with appending string at the end of file
    var writeStream = fs.createWriteStream(file, {flags: 'a'});
    writeStream.write(finBook+ '\n');
    writeStream.on('error', function (err) {console.log(err);});
    writeStream.end();
    writeStream.on('finish', function () {
        console.log('complete!')
    });
}
var books = {
    parseForm: function (req, res, callback) {
        parseIncommingForm(req, res, function (fields) {
            callback(fields)
        })
    },
    addBook: function (book) {
        reading(function (books) {
                adding(book, transform(books).length)
        });

    },
    checkExist: function (book , callback) {
        reading(function (books) {
            cheking(transform(books), book, function (exist) {
                callback(exist)
            })
        })
    }
};

module.exports = books;