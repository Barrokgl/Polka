const mongoose = require('data/mongoose');
const autoIncrement = require('mongoose-auto-increment');
let Schema = require('mongoose').Schema;

let UsersItem = new Schema({

}, { autoIndex: false});


//define user model
let Users = new Schema({
    login: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
    books: [{
        _id: {
            type: Number,
            index: true,
            unique: true,
            ref: 'Book'
        },
        status: String
    }],
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
    subscriptions: [{
        _id: {
            type: Number,
            index: true,
            unique: true,
            ref: 'User'
        },
        status: String
    }]
}, { autoIndex: false});

Users.plugin(autoIncrement.plugin, 'User');

module.exports = require('mongoose').model('User', Users);
