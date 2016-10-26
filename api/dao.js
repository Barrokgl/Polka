var fs = require('fs');
var config = require('config');
var booksDB = config.get('dbs:bookstable');
var usersDB = config.get('dbs:userstable');
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
    text.push(itemToAdd);
    //create write stream to write itemToAdd to file
    writeToFile(file, text);
}


function addToUser(text, userId, item, callback) {
    var file = config.get('dbs:userstable');
    //serch by all objects in table
    for (i=0; i < text.length; i++) {
        if (text[i]['id'] == userId) {
            if (text[i].hasOwnProperty(item.property)) {
                text[i][item.property].push({
                    id: parseInt(item.id),
                    status: item.status?item.status:''
                });
            } else {
                text[i][item.property] = [{
                    id: parseInt(item.id),
                    status: item.status?item.status:''
                }];
            }
            callback(text[i][item.property]);
            break;
        } else {
            log.info('searching user');
        }
    }
    // write changing to file
    writeToFile(file, text);
}

//remove items from user
function removeFromUser(text, userId, item, callback) {
    var file = config.get('dbs:userstable');
    //serch by all objects in table
    for (i=0; i < text.length; i++) {
        if (text[i]['id'] == userId) {
            if(text[i].hasOwnProperty(item.property)){
                text[i][item.property] = text[i][item.property].filter(function (value) {
                    return value.id != item.id;
                });
            } else {
                text[i][item.property] = [];
            }
            callback(text[i][item.property]);
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
    if (bookid) {
        for (j=0; j < bookid.length; j++) {
            //iterate all books in table
            for (i=0; i < text.length; i++) {
                // if find book => push to callback array
                if (text[i].id == bookid[j].id) {
                    find.push(text[i]);
                }
            }
        }
    }
    find.length > 0 ? callback(find) : callback(false);
}


//find user in db
function findUser(text, userid, callback) {
    var find = [];
    // iterate all ids in userid
    if (userid) {
        for (j=0; j < userid.length; j++) {
            //iterate all books in table
            for (i=0; i < text.length; i++) {
                // if find user => push to callback array
                if (text[i].id == userid[j]) {
                    find.push(text[i]);
                }
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
function editModel(file , text , itemId, newInfo, callback) {
    //find item by id
    for (i=0; i<text.length; i++) {
        if (text[i]['id'] == itemId) {
            //rewrite new properties
            for(key in newInfo) {
                if(newInfo.hasOwnProperty(key)) {
                    text[i][key] = newInfo[key];
                }
            }
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
        fields[name] = file.path.replace(/public\//i, '');
        fileType = file.type;
    });
    //Call back at the end of the form.
    form.on('end', function () {
        callback(fields, fileType);
    });
    form.parse(req);
}

var dao = {
  checkUser: function (user, callback) {
          readFromFile(usersDB , function (text) {
              checkUserExist(transformToObject(text), user, function (exist) {
                  callback(exist);
              });
          });
  },
  checkBook: function (book, callback) {
        readFromFile(booksDB, function (text) {
            checkBookExist(transformToObject(text), book, function (exist) {
                callback(exist);
            });
        });
  },
  addNewItem: function (item, file) {
         readFromFile(file, function (text) {
             addItemToFile(item, transformToObject(text), file);
         });
  },
  parseForm: function (req, res, callback) {
        parseMultipartForm(req, res, function (fields, fileType) {
            callback(fields, fileType);
        });
  },
  userAuthentication: function (user, callback) {
      readFromFile(usersDB ,function (text) {
          authenticateUser(transformToObject(text), user, function (auth) {
              callback(auth);
          });
      });
  },
  getBooksCollection: function (callback) {
      readFromFile(booksDB , function (text) {
          callback(transformToObject(text));
      });
  },
  getUsersCollection: function (callback) {
      readFromFile(usersDB, function (text) {
          callback(transformToObject(text));
      });
  },
  getRequestedBook: function (bookid, callback) {
      readFromFile(booksDB, function (text) {
          findBook(transformToObject(text), bookid, function (exist) {
              callback(exist);
          });
      });
  },
  getRequestedUser: function (userid, callback) {
       readFromFile(usersDB, function (text) {
           findUser(transformToObject(text), userid, function (user) {
               callback(user);
           });
       });
  },
  filterUsersItems: function (itemId, usersItems, callback) {
      if (usersItems) {
          var filteredItems = usersItems.filter(function (value) {
              return value.id == itemId;
          });
          filteredItems.length > 0 ? callback(filteredItems) : callback(undefined);
      } else {
          callback(undefined);
      }
  },
  addItemToUser: function (userId, item, callback) {
      readFromFile(usersDB, function (text) {
          addToUser(transformToObject(text), userId, item, function (newInfo) {
              callback(newInfo);
          });
      });
  },
  removeItemFromUser: function (userId, item, callback) {
      readFromFile(usersDB, function (text) {
          removeFromUser(transformToObject(text), userId, item, function (newInfo) {
              callback(newInfo);
          });
      });
  },
  editModelInfo: function (file, itemId, newInfo, callback) {
      readFromFile(file, function (text) {
          editModel(file, transformToObject(text), itemId, newInfo, function (upadtedItem) {
              callback(upadtedItem);
          })
      })
  }
};

module.exports = dao;
