var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/User');
var Invite          = require('../models/Invite');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

   // used to serialize the user for the session
   passport.serializeUser(function(user, done) {
      done(null, user.id);
   });

   // used to deserialize the user
   passport.deserializeUser(function(id, done) {
      User.getById(id).done(function(user) {
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
        var inviteExists = Invite.exists(req.body.email, req.body.code);

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.getByEmail(email).then(function(user) {
            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                // if there is no user with that email
                // create the user
                var newUser = new User(email, User.generateHash(password));

                inviteExists.done(function(exists) {
                   if (!exists) {
                      return done(null, false, req.flash('signupMessage', 'That email was not invited.'));
                   }

                   // save the user
                   newUser.save().done(function() {
                       return done(null, newUser);
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
        User.getByEmail(email).done(function(user) {
            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            // all is well, return successful user
            return done(null, user);
        }, function(err) {
            return done(err);
        });

    }));
};
