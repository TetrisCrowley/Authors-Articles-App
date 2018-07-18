const mongoose = require('mongoose');
// Require the model
const Article = require('../models/article');

const authorSchema = mongoose.Schema({
  name: String,
  articles: [Article.schema]
});

module.exports = mongoose.model('Author', authorSchema);