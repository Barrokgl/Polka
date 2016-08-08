/**
 * Created by Barrokgl on 01.08.2016.
 */
var fs = require('fs');
var newUser = {userId:'003',login: 'newuser@mail.ru',username :'newuser1',password: 'myownpass'};

var users = {
  readAllUsers: function (csvfile) {
      // trans stream to string
      function readAllUsers(csvfile) {
          var readStream = fs.createReadStream(csvfile, {encoding: 'utf-8'}, function(err){if (err) {console.log(err);}});
          var str = '', sync = true;
          readStream.on('data', function (data) {
              str += data;
          });
          readStream.on('end', function () {
              sync = false;
          });
          //use deasync module to fill our str
          while(sync) {require('deasync').sleep(100);}
          return str;
      }
      return readAllUsers(csvfile);
  },
  transToObj: function (text) {
      // transform data to object with keys - headers and values - our users
      function transToObj(textToTrans) {
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
      return transToObj(readAllUsers(text));
  },
  compareUsr: function (text, user) {
      //compare our users with props of newUser
      function compareUsr(text, user) {
          for (i=0; i<text.length;i++){
              if (text[i].login == user.login || text[i].username == user.username) {console.log('exists!'); return true;}
              else {console.log('no match');}
          }
      }
      return compareUsr(transToObj(readAllUsers(text)), user);
  },
  addUser: function (user, csvfile) {
      //transform new usr to a string and add to file
      function addUser(userToAdd, csvfile) {
          var finUser, arrVal = [];
          for (var key in userToAdd) {
              if (userToAdd.hasOwnProperty(key)){
                  arrVal.push(userToAdd[key]);
                  finUser = arrVal.join('|');
              } else {throw error}
          }
          // write stream with appending string at the end of file
          var writeStream = fs.createWriteStream(csvfile, {flags: 'a'});
          writeStream.write('\n' + finUser);
          writeStream.on('error', function (err) {console.log(err);});
          writeStream.end();
          writeStream.on('finish', function () {
              console.log('complete!')
          });
          console.log(finUser);
      }
      addUser(user, csvfile);
    }
};

module.exports.users = users;