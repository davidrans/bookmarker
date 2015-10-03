var db     = require('../lib/db'),
    bcrypt = require('bcrypt-nodejs');

var User = function(email, password, id) {
   this.email = email;
   this.password = password;
   this.id = id || undefined;
};

User.prototype.validPassword = function(password) {
   return bcrypt.compareSync(password, this.password);
};

User.prototype.save = function() {
   var self = this;
   var q =
      'INSERT INTO `users` ' +
      '(`email`, `password`) ' +
      'VALUES (?, ?)';

   return db.query(q, [this.email, this.password]).then(function(result) {
      self.id = result.insertId;
      return result;
   });
};

User.getByEmail = function(email) {
   var q =
      'SELECT * FROM `users` ' +
      'WHERE `email` = ?';

   return db.query(q, email).then(function(rows) {
      if (!rows.length) { return null; }

      var user = rows[0];

      return new User(user.email, user.password, user.user_id);
   });
};

User.getById = function(id) {
   var q =
      'SELECT * FROM `users` ' +
      'WHERE `user_id` = ?';

   return db.query(q, id).then(function(rows) {
      if (!rows.length) { return null; }

      var user = rows[0];

      return new User(user.email, user.password, user.user_id);
   });
};

User.search = function(email) {
   var q =
      'SELECT * FROM `users` ' +
      'WHERE `email` LIKE  ?';

   return db.query(q, '%' + email + '%').then(function(rows) {
      return rows.map(function(user) {
         return new User(user.email, user.password, user.user_id);
      });
   });
};

User.generateHash = function(password) {
   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = User;
