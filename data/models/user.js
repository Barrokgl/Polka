const mongoose = require('data/mongoose');
const autoIncrement = require('mongoose-auto-increment');
let Schema = require('mongoose').Schema;

//define user model
let Users = new Schema({
    login: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
    books: [{id: Number, status: String}],
    icon: String,
    lastname: String,
    firstname: String,
    patronymic: String,
    usersex: String,
    birthdate: Date,
    country: String,
    interests: String,
    about: String,
    admin: Boolean,
    subscriptions: [{id: Number}]
});

Users.plugin(autoIncrement.plugin, 'User');

module.exports = require('mongoose').model('User', Users);
