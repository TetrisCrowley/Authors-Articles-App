const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// run our database connection code
require('./db/db');

// middleware -- all routes must pass thru this
// therefore it needs to be before controller(s)
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

// controllers
const authors = require('./controllers/authors')
app.use('/authors', authors)

const articles = require('./controllers/articles')
app.use('/articles', articles)

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.listen(3000, () => {
  console.log("Express server running")
})