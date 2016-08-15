/**
 * Created by Barrokgl on 01.08.2016.
 */
var fs = require('fs');
var csvfile = './users.csv';


var users = {
  transToObj: function (callback) {
      // trans stream to string
      function reading(callback) {
          var readStream = fs.createReadStream(csvfile, {encoding: 'utf-8'}, function(err){if (err) {console.log(err);}});
          var str = '';
          readStream.on('data', function (data) {
              str += data;
          });
          readStream.on('end', function () {
              callback(str);
          });
      }
      // transform data to object with keys - headers and values - our users
      function transform(textToTrans, callback) {
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
          callback(objCsv);
      }
      reading(function (cb) {
          transform(cb, function (cb) {
              callback(cb);
          })
      });
  },
  checkExist: function (user, callback) {
      //compare our users with props of newUser
      var checkArr = [];
      function cheking(text, user, callback) {
          for (i=0; i<text.length;i++){
              if (text[i].login == user.login || text[i].username == user.username) {
                  console.log('exists!'); checkArr.push(text[i]);
              }
              else {console.log('no match');}
          }
          callback(checkArr.length !== 0)

      }
      // check our user from file we read by transToObj
     this.transToObj(function (text) {
         cheking(text, user, function (cb) {
             callback(cb);
         });
     });
  },
  addUser: function (user) {
      //transform new usr to a string and add to file
      function adding(userToAdd, id) {
          var finUser, arrVal = [];
          //push userId
          arrVal.push(id);
          for (var key in userToAdd) {
              if (userToAdd.hasOwnProperty(key)){
                  arrVal.push(userToAdd[key]);
                  finUser = arrVal.join('|');
              } else {throw error}
          }
          //write stream with appending string at the end of file
          var writeStream = fs.createWriteStream(csvfile, {flags: 'a'});
          writeStream.write(finUser+ '\n');
          writeStream.on('error', function (err) {console.log(err);});
          writeStream.end();
          writeStream.on('finish', function () {
              console.log('complete!')
          });
      }
      users.transToObj(function (cb) {
          adding(user, cb.length);
      });

    }
};

module.exports = users;

