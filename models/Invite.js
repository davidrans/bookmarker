var db = require('../lib/db');

var Invite = function(email, code) {
   this.email = email;
   this.code = code;
};

Invite.prototype.save = function() {
   var q =
      'REPLACE INTO `invites` ' +
      'SET `email` = ?, `code` = ?';

   return db.query(q, [this.email, Invite.generateCode()]);
};

Invite.exists = function(email, code) {
   var q =
      'SELECT * FROM `invites` ' +
      'WHERE `email` = ? AND `code` = ?';

   return db.query(q, [email, code]).then(function(rows) {
      if (!rows.length) { return false; }

      return true;
   });
};

Invite.generateCode = function() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });
};

module.exports = Invite;
