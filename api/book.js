const Book = require('data/models/book');
const counter = require('data/models/counter');

let BookService = {};

BookService.get = function get(bookId, callback) {
    Book.findById(bookId, (err, book)=>{
        if (err) {
            throw new Error(err)
        } else {
            callback(book);
        }
    });
};

BookService.getMany = function getMany(books, callback) {
    let booksId = books.map((book)=>{return book.id});
    console.log(booksId);
    Book.find({
        _id: {
            // send array of _id
            $in: booksId
    }
    }, (err, result)=>{
        if (err) {
            throw new Error(err)
        } else {
            callback(result);
        }
    });
};

BookService.getAll = function getAll(callback) {
    Book.find({}, (err, books)=>{
        if (err) {
            throw new Error(err)
        } else {
            callback(books);
        }
    });
};

BookService.create = function create(bookData, callback) {
    bookData._id = counter('books');
    let newBook = new Book(bookData);
    newBook.save((err)=>{
        if (err) {
            throw new Error(err)
        } else {
            callback();
        }
    });
};

BookService.update = function update(userId, bookData, callback) {
    Book.findByIdAndUpdate(bookId, bookData, (err)=>{
        if(err){
           throw new Error(err);
        } else {
            callback();
        }
    });
};

BookService.delete = function deleteBook(bookId, callback) {
    Book.findByIdAndRemove(bookId, (err)=>{
        if(err){
            throw new Error(err)
        }
        callback();
    })
};

BookService.checkExist = function checkExist(bookParams, callback) {
      let params = {
          author: bookParams.author,
          bookname: bookParams.bookname
      };
      Book.find(params, (err, book) => {
          if(err) {
              throw new Error(err);
          }
          callback(book);
      });
};

module.exports  = BookService;
