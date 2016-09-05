var fs = require('fs');
var newHeaders = ['userId', 'login', 'username', 'password'];
var convert = require('./dao').objToString;
var dao = require('./dao');
//generate dao strings
function generateContent(lengthOfCsv) {
    var contentString = [];
    for (i = 0; i < lengthOfCsv; i++) {
        var user = {
            userId: i+1,
            login: 'user'+(i+1)+'@mail.com',
            username: 'user'+(i+1),
            password:Math.floor(Math.random()*(1000-10+1))+10
        };
        contentString.push(user);
        contentString[i] = convert(contentString[i]).split(' ').join('|').slice(0, -1)+'\n';
    }
    return contentString.join('');
}
// write our db
function write(headers, lengthOfCsv, csvfile) {
    var writeStream = fs.createWriteStream(csvfile);
    writeStream.write(headers.join('|')+ '\n');
    writeStream.write(generateContent(lengthOfCsv));
    writeStream.on('error', function (err) {
        console.log(err);
    });
}

