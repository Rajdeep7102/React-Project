const mongoose = require('mongoose');

// Create a User model
const UserSchema = new mongoose.Schema({
    username: String,
    email:String,
    password: String,
  });

const Users = mongoose.model('Users',UserSchema)
module.exports= Users;
