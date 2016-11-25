const mongoose = require('data/mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = require('mongoose').Schema;

//define book model
let Books = new Schema({
    bookname: {type: String, required: true},
    author: {type: String, required: true},
    genre: String,
    year: Number,
    text: String,
    bookimage: String,
    isbn: String,
    publisher: String,
    setting: String
});

Books.plugin(autoIncrement.plugin, 'Book');

module.exports = require('mongoose').model('Book', Books);