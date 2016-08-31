var fs = require('fs');
var config = require('../config');
var upload = config.get('uploaddir');
var formidable = require('formidable');

// trans stream to string
function readFromFile(file, callback) {
    var readStream = fs.createReadStream( file, {encoding: 'utf-8'}, function(err){if (err) {console.log(err);}});
    var str = '';
    readStream.on('data', function (data) {
        str += data;
    });
    readStream.on('end', function () {
        callback(str);
    });
}

// transformToObject data to object with keys - headers and values
function transformToObject(text) {
    text = text.split('\n');
    var headers = text[0].split('|');
    var objCsv = [];
    for (i=1; i<text.length; i++) {
        var bigData = text[i].split('|');
        var newObj = {};
        for (j=0; j<bigData.length;j++) {
            newObj[headers[j]] = bigData[j];
        }
        objCsv.push(newObj);
    }
    return objCsv;
}

//convert obj to string
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += obj[p]+ ' ';
        }
    }
    return str;
}

//transformToObject new item to a string and add to file
function addItemToFile(ItemToAdd, id, file) {
    var finItem, arrVal = [];
    //push userId
    arrVal.push(id);
    for (var key in ItemToAdd) {
        if (ItemToAdd.hasOwnProperty(key)){
            arrVal.push(ItemToAdd[key]);
            finItem = arrVal.join('|');
        } else {throw error}
    }
    //write stream with appending string at the end of file
    var writeStream = fs.createWriteStream(file, {flags: 'a'});
    writeStream.write(finItem+ '\n');
    writeStream.on('error', function (err) {console.log(err);});
    writeStream.end();
    writeStream.on('finish', function () {
        console.log('complete!')
    });
}


//compare our books with props of newbook
var checkBookArr = [];
function checkBookExist(text, book, callback) {
    for (i=0; i<text.length;i++){
        if (text[i].bookname == book.bookname && text[i].author == book.author) {
            console.log('exists!'); checkBookArr.push(text[i]);
        }
        else {console.log('no match');}
    }
    callback(checkBookArr.length !== 0)

}

//find book
var find;
function findBook(text, book, callback) {
    for (i=0; i < text.length-1; i++) {
        if (text[i].bookname.toLocaleLowerCase() == book.toLocaleLowerCase()) {
            find = text[i];
            break;
        } else {
            find = false;
        }
    }
    callback(find);
}

//compare our dao with props of newUser
var checkArr = [];
function checkUserExist(text, user, callback) {
    for (i = 0; i < text.length; i++) {
        if (text[i].login == user.login || text[i].username == user.username) {
            console.log('exists!');
            checkArr.push(text[i]);
            break;
        } else {
            console.log('no match');
        }
    }
    callback(checkArr.length !== 0)
}

// authentication of user
var authenticated;
function authenticateUser(text, user, callback) {
    for (i=0; i < text.length; i++) {
        if (text[i].login == user.login) {
            if (text[i].password == user.password) {
                authenticated = text[i];
                break;
            } else {
                console.log('wrong password');
                break;
            }
        } else {
            authenticated = false;
            console.log('not found')
        }
    }
    callback(authenticated);
}

//parse incoming form
function parseMultipartForm(req, res, callback) {
    var fields = {};
    var fileType;
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
        fileType = file.type;
    });
    //Call back at the end of the form.
    form.on('end', function () {
        callback(fields, fileType)
    });
    form.parse(req);
}

var dao = {
  checkUser: function (file , user, callback) {
          readFromFile(file , function (text) {
              checkUserExist(transformToObject(text), user, function (exist) {
                  callback(exist);
                  console.log(exist);
              })
          })
  },
  checkBook: function (file , book, callback) {
        readFromFile(file , function (text) {
            checkBookExist(transformToObject(text), book, function (exist) {
                callback(exist);
                console.log(exist);
            })
        })
    },
  addNewItem: function (item, file) {
         readFromFile(file, function (text) {
             addItemToFile(item, transformToObject(text).length, file);
         });
  },
  parseForm: function (req, res, callback) {
        parseMultipartForm(req, res, function (fields, fileType) {
            callback(fields, fileType);
        })
  },
  userAuthentication: function (file, user, callback) {
      readFromFile(file, function (text) {
          authenticateUser(transformToObject(text), user, function (auth) {
              callback(auth);
          })
      })
  },
  accessBookCollection: function (callback) {
      readFromFile(config.get('dbs:bookstable'), function (text) {
          callback(transformToObject(text));
      })
  },
  getRequestedBook: function (file, book, callback) {
      readFromFile(file, function (text) {
          findBook(transformToObject(text), book, function (exist) {
              callback(exist);
          })
      })
  }
};


module.exports = dao;
module.exports.objToString = objToString;
