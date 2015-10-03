var Promise = require('promise');
var db = require('../lib/db');
var Link = require('../models/Link');
var Category = require('../models/Category');
var User = require('../models/User');
var Comment = require('../models/Comment');

module.exports = function(app, io, passport) {

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

app.get('/post/:link_id', function(req, res) {
   var link_id = req.params.link_id;

   Link.getById(link_id).done(function(link) {
      res.render('partials/post.ejs', {
         link: link
      });
   });
});

app.post('/post', function(req, res) {
   Link.create(req.body.url, req.body.name, req.body.category, req.user.id).done(
    function(link_id) {
      res.sendStatus(200);
      io.emit('link saved', link_id);
   });
});

app.get('/comment/:comment_id', function(req, res) {
   var comment_id = req.params.comment_id;

   Comment.getById(comment_id).done(function(comment) {
      res.render('partials/comment.ejs', {
         comment: comment
      });
   });
});

app.post('/comment', function(req, res) {
   var comment = Comment.create(req.body.link_id, req.user.id, req.body.text);
   res.sendStatus(200);

   comment.done(function(comment_id) {
      io.emit('comment saved', [req.body.link_id, comment_id]);
   });
});

app.get('/comment/:comment_id', function(req, res) {
   var comment_id = req.params.comment_id;

   Comment.getById(comment_id).done(function(comment) {
      res.render('partials/comment.ejs', {
         comment: comment
      });
   });
});

app.get('/signup/:code', function(req, res) {
   // render the page and pass in any flash data if it exists
   res.render('signup.ejs', {
      code: req.params.code,
      message: req.flash('signupMessage')
   });
});

app.post('/signup', function(req, res, next) {
   passport.authenticate('local-signup', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/signup/' + req.body.code); }

      req.logIn(user, function(err) {
         if (err) { return next(err); }
         return res.redirect('/');
      });
   })(req, res, next);
});

app.get('/login', function(req, res) {
   // render the page and pass in any flash data if it exists
   res.render('login.ejs', { message: req.flash('loginMessage') });
});

app.post('/login', passport.authenticate('local-login', {
   successRedirect : '/',
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

/*app.get('/:category', function(req, res) {
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
});*/

};

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }

   res.redirect('/login');
}
