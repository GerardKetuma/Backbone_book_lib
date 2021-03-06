var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  mongoose = require('mongoose');

//connect to the database
mongoose.connect('mongodb://localhost/library_database');

//Schemas
var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date
});

//Models
var BookModel = mongoose.model('Book', Book);

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, 'site')));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

//Routes
app.get('/api', function(request, response) {
  response.send('Library API is running');
});

//Route to get all the books in the collection
app.get('/api/books', function(request, response) {
  return BookModel.find(function(err, books) {
    if(!err) {
      return response.send(books);
    } else {
      return console.log(err);
    }
  });
});

//Route to save books
app.post('/api/books', function(request, response) {
  var book = new BookModel({
    title: request.body.title,
    author: request.body.author,
    releaseDate: request.body.releaseDate
  });
  book.save(function(err) {
    if(!err) {
      return console.log('created');
    } else {
      return console.log(err);
    }
  });
  return response.send(book);
});

var port = 4711;
app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
