const mongoose = require('mongoose');
const log = require('libs/logs')(module);
const config = require('config');
const Schema = mongoose.Schema;
const dao = require('api/dao');

const autoIncrement = require('mongoose-auto-increment');
//const User = require('data/models/user');
mongoose.Promise = global.Promise;
//contect to db
mongoose.connect(config.get('dbs:mongo:prod'));

const db = mongoose.connection;

autoIncrement.initialize(db);

const User = require('data/models/user');
const Book = require('data/models/book');

db.on('error', (err) => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info("Connected to DB!");
    dao.getUsersCollection((users)=>{
        //console.log(users);
        for(let i = 0; i < users.length; i++){
            let user = new User(users[i]);
            user.save((err, res)=>{
                if (err) {
                    log.error(err);
                }
                log.info(res);
            })
        }
        log.warning('done');
    });
    dao.getBooksCollection((books)=>{
        for(let i = 0; i < books.length; i++) {
            let book = new Book(books[i]);
            book.save((err, res)=>{
                if (err) {
                    log.error(err);
                }
                log.info(res);
            })
        }
        log.warning('done');
    });
    // User.find({}, (err, result)=>{
    //     if(err){throw new Error(err);}
    //     console.log(result);
    // });
    // User.findById(2, (err, res)=>{
    //     if(err){throw new Error(err);}
    //     console.log(res);
    // });
});

module.exports = mongoose;
