const mongoose = require('mongoose');
const log = require('libs/logs')(module);
const config = require('config');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

// user native Promise
mongoose.Promise = global.Promise;

//contect to db
mongoose.connect(config.get('dbs:mongo:prod'));

const db = mongoose.connection;
autoIncrement.initialize(db);

db.on('error', (err) => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info("Connected to DB!");
});

module.exports = mongoose;
