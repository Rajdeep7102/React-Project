const mongoose = require('mongoose');

// MongoDB Schema for User Blog History
const userHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
      },
      viewedBlogs: [
        {
          blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blogs', // Reference to the Blog collection
          },
          heading: String,
          categories: [String],
          viewCount: {
            type: Number,
            default: 1, // Initial view count is 1
          },
        },
      ],
    });

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;
