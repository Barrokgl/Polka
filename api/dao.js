var fs = require('fs');
var config = require('config');
var upload = config.get('uploaddir');
var formidable = require('formidable');
var log = require('libs/logs')(module);

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

// create writeStream and write to file
function writeToFile(file, text) {
    var writeStream = fs.createWriteStream(file, {flags: 'w'});
    writeStream.write(transformToJson(text));
    writeStream.on('error', function (err) {throw new Error(err);});
    writeStream.end();
    writeStream.on('finish', function () {
        log.info('complete adding new item to: '+file);
    });
}

// transformToObject json to object
function transformToObject(text) {
    return JSON.parse(text);
}

// transformToObject object to json
function transformToJson(text) {
    return JSON.stringify(text, null, 4);
}

//transformToObject new item to a string and add to file
function addItemToFile(itemToAdd, text, file) {
    // set id of new item
    itemToAdd.id =  text.length+1;
    if (itemToAdd.bookimage) {
        itemToAdd.bookimage = itemToAdd.bookimage.replace(/public\//i, '');
    }
    console.log(itemToAdd);
    text.push(itemToAdd);
    //create write stream to write itemToAdd to file
    writeToFile(file, text);
}

//add new books to user
function addBookToPolka(text, userId, bookId, callback) {
    var file = config.get('dbs:userstable');
        //serch by all objects in table
        for (i=0; i < text.length; i++) {
             if (text[i]['id'] == userId) {
                 text[i]['books'].push(parseInt(bookId));
                 callback(text[i]['books']);
                 break;
             } else {
                 log.info('searching user');
             }
        }
    // write changing to file
    writeToFile(file, text);
}

// remove books from user
function removeBookFromPolka(text, userId, bookId, callback) {
    var file = config.get('dbs:userstable');
        //serch by all objects in table
        for (i=0; i < text.length; i++) {
            if (text[i]['id'] == userId) {
                text[i]['books'] = text[i]['books'].filter(function (value) {
                    return value != bookId;
                });
                callback(text[i]['books']);
                break;
            } else {
                log.info('searching user')
            }
        }
    // write changing to file
    writeToFile(file, text);
}

//compare our books with props of newbook
function checkBookExist(text, book, callback) {
    var checkBookArr = [];
    for (i=0; i<text.length;i++){
        if (text[i].bookname == book.bookname && text[i].author == book.author) {
            checkBookArr.push(text[i]);
            break;
        }
    }
    callback(checkBookArr.length !== 0);

}

//find book in db
function findBook(text, bookid, callback) {
    var find = [];
    // iterate all ids in bookid
    for (j=0; j < bookid.length; j++) {
        //iterate all books in table
        for (i=0; i < text.length; i++) {
            // if find book => push to callback array
            if (text[i].id == bookid[j]) {
                find.push(text[i]);
            }
        }
    }
    find.length > 0 ? callback(find) : callback(false);
}

//compare our dao with props of newUser
function checkUserExist(text, user, callback) {
    var checkArr = [];
    for (i = 0; i < text.length; i++) {
        if (text[i].login == user.login || text[i].username == user.username ) {
            checkArr.push(text[i]);
            break;
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
        }
    }
    callback(authenticated);
}

//edit user porfile and upload icon
function editUser(text ,userId, newInfo, callback) {
    var file = config.get('dbs:userstable');
    for (i=0; i<text.length; i++) {
        if (text[i]['id'] == userId) {
            text[i] = newInfo;
            callback(text[i]);
            break;
        }
    }
    writeToFile(file, text);
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
  getRequestedBook: function (file, bookid, callback) {
      readFromFile(file, function (text) {
          findBook(transformToObject(text), bookid, function (exist) {
              callback(exist);
          })
      })
  },
  filterUsersBooks:  function (bookid, userBooks, callback) {
      var filteredBooks = userBooks.filter(function (value) {
          return value == bookid;
      });
      if(filteredBooks.length > 0) {
          callback(filteredBooks);
      } else {
          callback(undefined);
      }
  },
  addBooksToUser: function (file, userId, bookId, callback) {
       readFromFile(file, function (text) {
           addBookToPolka(transformToObject(text), userId, bookId, function (books) {
               callback(books);
           })
       })
  },
  removeBookFromUser: function (file, userId, bookId, callback) {
      readFromFile(file, function (text) {
          removeBookFromPolka(transformToObject(text), userId, bookId, function (books) {
              callback(books);
          })
      })
  },
  editUserInfo: function (file, userId, newInfo, callback) {
      readFromFile(file, function (text) {
          editUser(transformToObject(text), userId, newInfo, function (updatedUser) {
              callback(updatedUser);
          })
      })
  }
};

module.exports = dao;
