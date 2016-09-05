var fs = require('fs');
var config = require('../config');
var upload = config.get('uploaddir');
var formidable = require('formidable');
var log = require('../libs/logs')(module);

// trans stream to string
function readFromFile(file, callback) {
    var readStream = fs.createReadStream( file, {encoding: 'utf-8'}, function(err){if (err) {throw new Error(err);}});
    var str = '';
    readStream.on('data', function (data) {
        str += data;
    });
    readStream.on('end', function () {
        callback(str);
    });
}

// transformToObject data to object
function transformToObject(text) {
    return JSON.parse(text);
}

//transformToObject new item to a string and add to file
function addItemToFile(itemToAdd, text, file) {
    // create new obj and add id
    var objToAdd = {id: text.length+1};
    for (var key in itemToAdd) {
        if (itemToAdd.hasOwnProperty(key)) {
            objToAdd[key] = itemToAdd[key];
        } else {
            throw new Error(500);
        }
    }
    text[text.length] = objToAdd;
    console.log(text);
    console.log(JSON.stringify(text));
    // create wtite stream to rewrite newItem
    var writeStream = fs.createWriteStream(file, {flags: 'w'});
    writeStream.write(JSON.stringify(text));
    writeStream.on('error', function (err) {throw new Error(err);});
    writeStream.end();
    writeStream.on('finish', function () {
        log.info('complete adding new item to: '+file);
    });
}


//compare our books with props of newbook
function checkBookExist(text, book, callback) {
    var checkBookArr = [];
    for (i=0; i<text.length;i++){
        if (text[i].bookname == book.bookname && text[i].author == book.author) {
            checkBookArr.push(text[i]);
        } else {
            checkBookArr = [];
        }
    }
    callback(checkBookArr.length !== 0)

}

//find book
function findBook(text, book, callback) {
    var find;
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
function checkUserExist(text, user, callback) {
    var checkArr = [];
    for (i = 0; i < text.length; i++) {
        if (text[i].login == user.login || text[i].username == user.username) {
            checkArr.push(text[i]);
            break;
        } else {
            checkArr = [];
        }
    }
    callback(checkArr.length !== 0)
}

// authentication of user
function authenticateUser(text, user, callback) {
    var authenticated;
    for (i=0; i < text.length; i++) {
        if (text[i].login == user.login) {
            if (text[i].password == user.password) {
                authenticated = text[i];
                break;
            } else {
                break;
            }
        } else {
            authenticated = false;
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
// check object not empty
function notEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }
    return false;
}

var dao = {
  checkUser: function (file , user, callback) {
          readFromFile(file , function (text) {
              checkUserExist(transformToObject(text), user, function (exist) {
                  callback(exist);
              })
          })
  },
  checkBook: function (file , book, callback) {
        readFromFile(file , function (text) {
            checkBookExist(transformToObject(text), book, function (exist) {
                callback(exist);
            })
        })
    },
  addNewItem: function (item, file) {
         readFromFile(file, function (text) {
             addItemToFile(item, transformToObject(text), file);
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
  },
  filterUsersBooks:  function (bookid, userBooks, callback) {
            var filteredBooks = userBooks.filter(function (value) {
                    return value == bookid
                 });
            if (notEmpty(filteredBooks)) {
                callback(filteredBooks);
            } else {
                callback(undefined);
            }
        }
};

module.exports = dao;
