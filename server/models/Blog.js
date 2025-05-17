const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
  title: String,
  category: String,
  author: String,
  content: String,
  image: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Blog', blogSchema);