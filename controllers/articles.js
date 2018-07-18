const express = require('express');
const router = express.Router();
// Require the model
const Article = require('../models/article');
const Author = require('../models/author');

// Index route
router.get('/', (req, res) => {
  Article.find({}, (err, foundArticles) => {
    res.render('articles/index.ejs', {
     articles: foundArticles
    });
  });
});

// New route
router.get('/new', (req, res) => {
  // get the authors to send over to article new page 
  // so user can choose from list
  Author.find({}, (err, foundAuthors) => {
    res.render('articles/new.ejs', { 
      authors: foundAuthors 
    });
  });
});
// Avoid this handling /new by placing it towards the bottom of the file
// Display the aauthor with a link of the article show page


// Show route
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    // Need to find the author of the article:
    Author.findOne({"articles._id": req.params.id}, (err, foundAuthor) => {
      res.render('articles/show.ejs', {
        author: foundAuthor,
        article: foundArticle
      });
    });
  });
});


// Create route
router.post('/', (req, res) => {
  // Create a new article, push a copy of it into the author's article array
  Author.findById(req.body.authorId, (err, foundAuthor) => {
    // foundAuthor is the document, with author's articles array
    Article.create(req.body, (err, createdArticle) => {
      foundAuthor.articles.push(createdArticle);
      foundAuthor.save((err, data) => {
        res.redirect('/articles');
      });
    });
  });
});

// Delete route
// Delete an author, delete the associated articles
router.delete('/:id', (req, res) => {
  Article.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
    // finding the author with that article
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.save((err, data) => {
        res.redirect('/articles');  
      });
    });
  });
});

// Edit route
router.get('/:id/edit', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    Author.find({}, (err, allAuthors) => {
      Author.findOne({'articles._id': req.params.id}, (err, foundArticleAuthor) => {
        res.render('articles/edit.ejs', {
          article: foundArticle,
          authors: allAuthors,
          articleAuthor: foundArticleAuthor
        });
      });
    });
  });
});

// Update an article and update the author's articles list
router.put('/:id', (req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedArticle) => {
    // find the author with that article
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
      // first find the article and removing, req.params.id = articles if
        if(foundAuthor._id.toString() !== req.body.authorId){
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.save((err, savedFoundAuthor) => {
            Author.findById(req.body.authorId, (err, newAuthor) => {
              newAuthor.articles.push(updatedArticle);
              newAuthor.save((err, savedNewAuthor) => {
                res.redirect('/articles/'+req.params.id);
                
              });
            });
          });
        } else {
          foundAuthor.articles.id(req.params.id).remove();
          foundAuthor.articles.push(updatedArticle);
          foundAuthor.save((err, data) => {
            res.redirect('/articles/'+req.params.id);
          });
        };
      });
    });
});

module.exports = router;