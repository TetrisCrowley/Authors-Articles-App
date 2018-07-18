const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article');

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

// Show route
router.get('/:id', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) => {
    res.render('authors/show.ejs', {
      author: foundAuthor
    });
  });
});

// Edit route
router.get('/:id/edit', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) => {
    res.render('authors/edit.ejs', {
      author: foundAuthor
    });
  });
});
router.put('/:id', (req, res) => {
  Author.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedAuthor) => {
    console.log(updatedAuthor, " This is the updated author");
    res.redirect("/authors");
  });
});

// author create route
router.post('/', (req, res) => {
  Author.create(req.body, (err, createdAuthor) => {
    console.log(createdAuthor, ' this is the createdAuthor');
    // just to see if post route set up right
    res.redirect('/authors');
  });
});

// Delete route
router.delete('/:id', (req, res) => {
  Author.findByIdAndRemove(req.params.id, (err, foundAuthor) => {
    // We are collecting all of the Article Ids from the deletedAuthors
    // articles property
    const articleIds = [];
    for(let i = 0; i < foundAuthor.articles.length; i++){
      articleIds.push(foundAuthor.articles[i].id);
    }
    Article.remove({
      _id: { $in: articleIds}
    }, (err, data) => {
      res.redirect('/authors')
    });
  });
});


module.exports = router;