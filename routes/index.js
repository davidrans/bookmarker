var Promise = require('promise');
var db = require('../lib/db');
var Link = require('../models/Link');
var Category = require('../models/Category');
var User = require('../models/User');

module.exports = function(app, passport) {

/* GET home page. */
app.get('/', isLoggedIn, function(req, res) {
   var links = Link.getAll();
   var categories = Category.getAll();

   Promise.all([links, categories]).done(function(result) {
      res.render('index', {
         links: result[0],
         categories: result[1]
      });
   });
});

app.post('/', function(req, res) {
   var link = new Link(req.body.url, req.body.name, req.body.category);
   link.save();
});

app.get('/signup', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', { message: req.flash('loginMessage') }); 
});

app.post('/signup', passport.authenticate('local-signup', {
   successRedirect : '/profile', // redirect to the secure profile section
   failureRedirect : '/signup', // redirect back to the signup page if there is an error
   failureFlash : true // allow flash messages
}));

app.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

app.post('/login', passport.authenticate('local-login', {
   successRedirect : '/profile',
   failureRedirect : '/login',
   failureFlash : true
}));

app.get('/profile', isLoggedIn, function(req, res) {
   res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
   });
});

app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

app.get('/:category', function(req, res) {
   Category.getByName(req.params.category).then(function(category) {
      if (!category) { res.status(404).send('No such category'); }

      Link.getByCategory(category.id).done(function(links) {
         res.render('category', {
            category: category,
            links: links
         });
      });
   });
});

app.get('/users/search/:email', function(req, res) {
   User.search(req.params.email).then(function(users) {
      res.send(users);
   });
});

};

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }

   res.redirect('/login');
}
