const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// author index route
router.get('/', (req, res) => {
  Author.find({}, (err, foundAuthors) => {
    res.render('authors/index.ejs', {
     authors: foundAuthors
    });
  });
});

// author new route
router.get('/new', (req, res) => {
  res.render('authors/new.ejs')
});

// author create route
router.post('/', (req, res) => {
  // see what user typed
  console.log(req.body)
  Author.create(req.body, (err, createdAuthor) => {
    console.log(createdAuthor, ' this is the createdAuthor');
    // just to see if post route set up right
    res.redirect('/authors');
  });
});

module.exports = router;