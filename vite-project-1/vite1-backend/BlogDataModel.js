// Blog Model 
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    Author: String,
    Time: Date,
    Heading : String,
    Content: String,
    Summary: String,
    Category : String,
  })

const Blogs = mongoose.model('Blogs',blogSchema);

module.exports = Blogs;