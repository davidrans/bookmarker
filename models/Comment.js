var Promise = require('promise');
var db = require('../lib/db');
var User = require('./User');

var Comment = function(link_id, user_id, text) {
   this.link_id = link_id;
   this.user_id = user_id;
   this.text = text;
};

Comment.prototype.save = function() {
   var q_comment =
      'INSERT INTO `comments` ' +
      '(`link_id`, `user_id`, `text`) ' +
      'VALUES(?, ?, ?)';
   var p_comment = [this.link_id, this.user_id, this.text];

   return db.query(q_comment, p_comment);
};

Comment.create = function(link_id, user_id, text) {
   var comment = new Comment(link_id, user_id, text);

   return comment.save().then(function(result) {
      return result.insertId;
   });
};

Comment.get = function(row) {
   var user = User.getById(row.user_id);

   return user.then(function(user) {
      return {
         user: user,
         text: row.text
      };
   });
};

Comment.getById = function(comment_id) {
   var q =
      'SELECT * FROM `comments` ' +
      'WHERE `comment_id` = ?';

   return db.query(q, comment_id).then(function(rows) {
      if (!rows.length) { return null; }

      return Comment.get(rows[0]);
   });
};

Comment.getAll = function(link_id) {
   var q =
      'SELECT * FROM `comments` ' +
      'WHERE `link_id` = ? ' +
      'ORDER BY `comment_id`';

   var comments = [];
   return db.query(q, link_id).then(function(rows) {
      if (!rows.length) { return []; }

      var comments = rows.map(function(row) {
         return Comment.get(row);
      });

      return Promise.all(comments);
   });
};

module.exports = Comment;
