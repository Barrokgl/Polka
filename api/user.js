const User = require('data/models/user');
const counter = require('data/models/counter');
const log = require('libs/logs')(module);

let UserService = {};

UserService.get = function get(userId) {
    return new Promise((resolve, reject) => {
        User.findById(userId)
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.getMany = function get(users) {
    return new Promise((resolve, reject) => {
        let userId = users.map(user => user._id);
        User.find({
            _id: {
                $in: userId
            }
        })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
};

UserService.getAll = function get(callback) {
    return new Promise((resolve, reject) => {
        User.find({})
            .then(users => resolve(users))
            .catch(err => reject(err));
    });
};

UserService.create = function create(userData) {
    return new Promise((resolve, reject) => {
        userData._id = counter('users');
        User.create(userData)
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.update = function update(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId, userData)
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.removeBook = function RemoveItem(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId,
            {
                $pull: {
                    'books': {
                        _id: userData._id
                    }
                }
            },
            {
                save: true, new: true
            }
            )
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.addBook = function addBok(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId,
            {
                $push: {
                    'books' : {
                        _id: userData._id,
                        status: userData.status
                    }
                }
            },
            {
                save: true, new: true
            }
        )
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.addSubscription = function addSubscription(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId,
            {
                $push: {
                    'subscriptions': {
                        _id: userData._id,
                        status: userData.status ? userData.status : ''
                    }
                }
            },
            {
                save: true, new: true
            }
            )
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.removeSubcription = function removeSubscription(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId,
            {
                $pull: {
                    'subscriptions': {
                        _id: userData._id
                    }
                }
            },
            {
                save: true, new: true
            }
            )
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
};

UserService.delete = function deleteUser(userId) {
    return new Promise((resolve, reject) => {
       User.findByIdAndRemove(userId)
           .then(resolve)
           .catch(err => reject(err));
    });
};

UserService.filterItems = function filterItems(itemId, usersItems) {
    return new Promise((resolve, reject) => {
        if(usersItems) {
            let filteredItems = usersItems.filter(value => {
                if(value._id) {
                    return value._id == itemId;
                } else {
                    return value == itemId;
                }
            });
            filteredItems.length > 0 ? resolve(filteredItems) : resolve(null);
        } else {
            resolve(null);
        }
    });
};

UserService.authenticate = function authenticate(userData) {
    return new Promise((resolve, reject) => {
       let params = {
           login: userData.login,
           password: userData.password
       };
        User.find(params)
           .then(user => resolve(user))
           .catch(err => reject(err));
    });
};

UserService.setStatusOfBook = function setStatusOfBook(userId, userData) {
    return new Promise((resolve, reject) => {
        User.findById(userId)
            .then(user => {
                let book = user.books.id(userData._id);
                book.set({status: userData.status});
                user.save()
                    .then(user => resolve(user));
            })
            .catch(err => reject(err));
    });
};

module.exports = UserService;
