var LocalStrategy   = require('passport-local').Strategy;
var UserLib   = require('../lib/UserLib');

var models = require('../models');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

   // used to serialize the user for the session
   passport.serializeUser(function(user, done) {
      done(null, user.userid);
   });

   // used to deserialize the user
   passport.deserializeUser(function(userid, done) {
      models.User.findById(userid).done(function(user) {
         done(null, user);
      }, function(err) {
         done(err);
      });
   });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
       var inviteExists = models.Invite.findOne({
          email: req.body.email,
          code: req.body.code
       });

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        models.User.findOne({email: email}).done(function(user) {
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                inviteExists.done(function(invite) {
                   if (!invite) {
                      return done(null, false, req.flash('signupMessage', 'That email was not invited.'));
                   }

                   // if there is no user with that email
                   // create the user
                   models.User.create({
                      email: email,
                      password: UserLib.generateHash(password)
                   }).done(function(user) {
                       return done(null, user);
                   }, function(err) {
                       throw err;
                   });
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
       models.User.findOne({
          email: email,
          password: password
       }).done(function(user) {
            // if no user is found, return the message
            if (!user) {
               // req.flash is the way to set flashdata using connect-flash
               return done(null, false, req.flash('loginMessage', 'Invalid credentials'));
            }

            // all is well, return successful user
            return done(null, user);
        }, function(err) {
            return done(err);
        });

    }));
};
