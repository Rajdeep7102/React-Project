// Blog Model 
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    Author: String,
    Time: Date,
    Heading : String,
    Content: String,
    Summary: String,
    Category : String,
    File: String,
    Views: {
      type: Number,
      default: 0, // Set a default value if needed
    },
    elapsedTime: {
      type: Number,
      default: 0,
    },
  })

const Blogs = mongoose.model('Blogs',blogSchema);

module.exports = Blogs;