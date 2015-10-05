var Promise = require('promise');
var db = require('../lib/db');
var models = require('../models');

module.exports = function(app, io, passport) {

app.get('/', isLoggedIn, function(req, res) {
   var posts = models.Post.findAll({
      order: [['postid', 'DESC']],
      include: [
         models.Category,
         models.User,
         {model: models.Comment, include: models.User}
      ]
   });
   var categories = models.Category.findAll();

   Promise.all([posts, categories]).done(function(result) {
      res.render('index', {
         posts: result[0],
         categories: result[1],
         selectedCategory: 0
      });
   });
});

app.get('/category/:category', isLoggedIn, function(req, res) {
   models.Category.findOne({where: {
      name: req.params.category}
   }).done(function(category) {
      var categoryid = category.categoryid;
      var posts = models.Post.findAll({
         where: {categoryid: categoryid},
         include: [
            models.Category,
            models.User,
            {model: models.Comment, include: models.User}
         ]
      });
      var categories = models.Category.findAll();

      Promise.all([posts, categories]).done(function(result) {
         posts = result[0];
         categories = result[1];

         res.render('index', {
            posts: posts,
            categories: categories,
            selectedCategory: categoryid
         });
      });
   });
});

app.get('/post/:postid', function(req, res) {
   var postid = req.params.postid;

   models.Post.findById(postid, {
      include: [models.Category, models.User, models.Comment]
   }).done(function(post) {
      res.render('partials/post.ejs', {
         post: post
      });
   });
});

app.post('/post', function(req, res) {
   models.Post.create({
      url: req.body.url,
      title: req.body.name,
      categoryid: req.body.category,
      userid: req.user.userid
   }).done(function(post) {
      res.sendStatus(200);
      io.emit('post saved', post.postid);
   });
});

app.get('/comment/:commentid', function(req, res) {
   var commentid = req.params.commentid;

   models.Comment.findById(commentid, {
      include: [models.User]
   }).done(function(comment) {
      res.render('partials/comment.ejs', {
         comment: comment
      });
   });
});

app.post('/comment', function(req, res) {
   var comment = models.Comment.create({
      postid: req.body.postid,
      userid: req.user.userid,
      text: req.body.text
   });

   comment.done(function(comment) {
      res.sendStatus(200);
      io.emit('comment saved', [comment.postid, comment.commentid]);
   });
});

app.get('/comment/:commentid', function(req, res) {
   var commentid = req.params.commentid;

   models.Comment.findById(commentid).done(function(comment) {
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
      user : req.user
   });
});

app.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/');
});

};

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }

   res.redirect('/login');
}
