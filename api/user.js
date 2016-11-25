const User = require('data/models/user');
const counter = require('data/models/counter');

let UserService = {};

UserService.get = function get(userId, callback) {
   User.findById(userId, (err, user)=>{
       if (err){callback(err)}
       else { callback(user);}
   });
};

UserService.getMany = function get(users, callback) {
    let usersId = users.map((user)=>{return user.id});
    User.find({
        _id:{
            // send array of _id
            $in: usersId
        }
    }, (err, result)=>{
        if (err){
            throw new Error(err)
        }
        else {
            callback(result);
        }
    });
};

UserService.getAll = function get(callback) {
    User.find({}, (err, users)=>{
        if (err){
            throw new Error(err)
        }
        else {
            callback(users);
        }
    });
};

UserService.create = function create(userData, callback) {
    userData._id = counter('users');
    User.create(userData, (err, user) => {
        callback(err, user);
    });
};

UserService.update = function update(userId, userData, callback) {
     User.findByIdAndUpdate(userId, userData, (err)=>{
         if (err) {
             throw new Error(err)
         }
         else {
             callback()
         }
     });
};

UserService.delete = function deleteUser(userId, callback) {
     User.findByIdAndRemove(userId, (err)=>{
         if (err) {
             throw new Error(err)
         }
         else {
             callback()
         }
     })
};

UserService.filterItems = function filterItems(itemId, usersItems, callback) {
    if (usersItems) {
        let filteredItems = usersItems.filter((value) => {
            if (value.id){
                return value.id == itemId;
            } else {
                return value == itemId;
            }
        });
        filteredItems.length > 0 ? callback(filteredItems) : callback(undefined);
    } else {
        callback(undefined);
    }
};

UserService.authenticate = function authenticate(userData, callback) {
    let params = {
        login: userData.login,
        password: userData.password
    };
    User.find(params, (err, user)=>{
        if (err) {
            throw new Error(err);
        } else {
            callback(user);
        }
    })
};

module.exports = UserService;