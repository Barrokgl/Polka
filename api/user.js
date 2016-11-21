const User = require('/data/models/user');
const counter = require('/data/models/counter');
let UserService = {};

UserService.get = function get(userId, callback) {
   User.findById(userId, (err, user)=>{
       if (err){
           callback(err);
       } else {
           callback(user);
       }
   });
};

UserService.create = function create(userData, callback) {
    userData._id = counter('users');
    let newUser = new User(userData);
    newUser.save((err)=>{
        if (err) {
            callback(err);
        } else {
            callback();
        }
    });
};

UserService.update = function update(userId, userData, callback) {
     User.findByIdAndUpdate(userId, userData, (err)=>{
          callback(err);
     });
};

UserService.delete = function deleteUser(userId, callback) {
     User.findByIdAndRemove(userId, (err)=>{
         callback(err);
     })
};

module.exports = UserService;