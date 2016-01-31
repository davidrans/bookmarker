var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var models = require('../models');
var User = models.User;
var Invite = models.Invite;

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

   // used to serialize the user for the session
   passport.serializeUser(function(user, done) {
      done(null, user.userid);
   });

   // used to deserialize the user
   passport.deserializeUser(function(userid, done) {
      User.findById(userid).done(function(user) {
         done(null, user);
      }, function(err) {
         done(err);
      });
   });

   // =========================================================================
   // GOOGLE ==================================================================
   // =========================================================================
   passport.use(new GoogleStrategy({

      clientID        : configAuth.googleAuth.clientID,
      clientSecret    : configAuth.googleAuth.clientSecret,
      callbackURL     : configAuth.googleAuth.callbackURL,

   },
   function(token, refreshToken, profile, done) {
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function() {
         // Use first email.
         var email = profile.emails[0].value;

         Invite.findOne({email: email}).done(function(invite) {
            if (!invite) {
               return done(null, false);
            }
         });

         // try to find the user based on their google id
         User.findOne({where: {'googleid' : profile.id}}).done(function(user) {
            if (user) {
               // If a user is found, log them in.
               return done(null, user);
            } else {
               // If the user isn't in our database, create a new user.
               User.create({
                  email: email,
                  googleid: profile.id,
                  google_token: token,
                  name: profile.displayName
               }).done(function(user) {
                  return done(null, user);
               }, function(err) {
                  throw err;
               });
            }
          });
      });

   }));

};
