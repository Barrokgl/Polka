const mongoose = require('/data/mongoose');
const Schema = mongoose.Schema;

//define book model
let Books = new Schema({
    _id: {type: Number, required: true},
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

module.exports.BooksModel = mongoose.model('Book', Books);