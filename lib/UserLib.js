var bcrypt = require('bcrypt-nodejs');

var UserLib = {

   setPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
   },

   generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
   }

};

module.exports = UserLib;
