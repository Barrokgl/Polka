const Book = require('data/models/book');
const counter = require('data/models/counter');

let BookService = {};

BookService.get = function get(bookId) {
    return new Promise((resolve, reject) => {
        Book.findById(bookId)
            .then(book => resolve(book))
            .catch(err => reject(err));
    });
};

BookService.getMany = function getMany(books) {
    return new Promise((resolve, reject) => {
        let booksId = books.map((book)=>{return book._id});
        Book.find({
            _id: {
                //send array of _ids
                $in: booksId
            }
        })
            .then(result => {
                // TODO: refactor this to easy implementation
                if(result) {
                    result = result.map(book => {
                        for(let i = 0; i < books.length; i++) {
                            if(books[i]._id == book._id) {
                                book.status = books[i].status;
                            } else {
                                ///
                            }
                        }
                        return book;
                    });
                    resolve(result);
                } else {
                    resolve;
                }
            })
            .catch(err => reject(err));
    });
};

BookService.getAll = function getAll() {
    return new Promise((resolve, reject) => {
       Book.find({})
           .then(users => resolve(users))
           .catch(err => reject(err));
    });
};

BookService.create = function create(bookData) {
    return new Promise((resolve, reject) => {
        bookData._id = counter('books');
        let newBook = new Book(bookData);
        newBook.save()
            .then(book => resolve(book))
            .catch(err => reject(book));
    })
};

BookService.update = function update(bookId, bookData) {
    return new Promise((resolve, reject) => {
        Book.findByIdAndUpdate(bookId, bookData)
            .then(book => resolve(book))
            .catch(err => reject(err));
    });
};

BookService.delete = function deleteBook(bookId) {
    return new Promise((resolve, reject) => {
        Book.findByIdAndRemove(bookId)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

BookService.checkExist = function checkExist(bookParams) {
      let params = {
          author: bookParams.author,
          bookname: bookParams.bookname
      };
      return new Promise((resolve, reject) => {
          Book.find(params)
              .then(book => resolve(book))
              .catch(err => reject(err));
      });
};

module.exports  = BookService;
