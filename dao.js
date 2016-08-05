/**
 * Created by Barrokgl on 01.08.2016.
 */
var fs = require('fs');

var newUser = {UserId:'003',Login: 'newuser@mail.ru',Username :'newuser1',Password: 'myownpass'};

var createUser = function (userToAdd) {
    var readStream = fs.createReadStream('users.csv', {encoding: 'utf-8'}, function(err){console.log(err);});
    var writeStream = fs.createWriteStream('users.csv', {flags: 'a'});
    readStream.on('readable', function () {
        //start read readStream
        var data = readStream.read();
        console.log(data);
        //parse csv file to object
        var text = data.split('\n');
        var headers = text[0].split('|');
        var finText = [];
        for (i=1; i<text.length; i++) {
            var bigData = text[i].split('|');
            var newObj = {};
            for (j=0; j<bigData.length;j++) {
                newObj[headers[j]] = bigData[j];
            }
            finText.push(newObj);
        }
        console.log(finText);
        //compare object properties of our csv with props userToAdd
        function compareUsr() {
            for (i=0; i<finText.length;i++){
                if (finText[i].Login == userToAdd.Login || finText[i].Username == userToAdd.Username) {console.log('exists!'); return true;}
                else {
                    console.log('no match');
                }
            }
        }
        if (compareUsr() != true) {addUser()}

    });
    //transform new usr to a string and add to file
    function addUser() {
        var usrToAdd = '';
        for (var key in userToAdd) {
            if (key != 'Password'){usrToAdd =  usrToAdd.concat(userToAdd[key]+'|')}
            else {usrToAdd = usrToAdd.concat(userToAdd[key])}
        }
        writeStream.write('\n' + usrToAdd);
    }
};

createUser(newUser);
