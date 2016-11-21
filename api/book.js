const Book = require('/data/models/book');
const counter = require('/data/models/counter');

let BookService = {};

BookService.get = function (bookId, callback) {
    Book.findById(bookId, (err, book)=>{
        if (err) {
            callback(err);
        } else {
            callback(user);
        }
    });
};

BookService.create = function create(bookData, callback) {
    bookData._id = counter('books');
    let newBook = new Book(bookData);
    newBook.save((err)=>{
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
};

BookService.update = function update(userId, bookData, callback) {
    Book.findByIdAndUpdate(bookId, bookData, (err)=>{
        callback(err);
    });
};

BookService.delete = function deleteBook(bookId, callback) {
    Book.findByIdAndRemove(bookId, (err)=>{
        callback(err);
    })
};