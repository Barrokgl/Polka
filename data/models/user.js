const mongoose = require('/data/mongoose');
const Schema = mongoose.Schema;

//define user model
let Users = new Schema({
    _id: {type: Number, required: true},
    login: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
    //books: [{id: Number, status: String}],
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

module.exports = mongoose.model('User', Users);
