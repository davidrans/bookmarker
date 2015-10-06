var bcrypt = require('bcrypt-nodejs');

var UserLib = {

   comparePasswords: function(password, hashedPass) {
      return bcrypt.compareSync(password, hashedPass);
   },

   generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
   }

};

module.exports = UserLib;
