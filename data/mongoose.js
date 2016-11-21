const mongoose = require('mongoose');
const log = require('/libs/logs')(module);
const config = require('config');
const Schema = mongoose.Schema;

//contect to db
mongoose.connect(config.get('dbs:mongo:dev'));

const db = mongoose.connection;

db.on('error', (err) => {
    log.error('connection error:', err.message);
});
db.once('open', () => {
    log.info("Connected to DB!");
});

module.exports = mongoose;
