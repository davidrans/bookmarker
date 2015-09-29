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
   console.log(link_id, user_id, text);
   var comment = new Comment(link_id, user_id, text);

   return comment.save()
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
         var user = User.getById(row.user_id);

         return user.then(function(user) {
            return {
               user: user,
               text: row.text
            };
         });
      });

      return Promise.all(comments);
   });
};

module.exports = Comment;
