var Promise = require('promise');
var db = require('../lib/db');
var User = require('./User');
var Category = require('./Category');
var Comment = require('./Comment');

var Link = function(url, name, user_id) {
   this.url = url;
   this.name = name;
   this.user_id = user_id;
};

Link.prototype.save = function() {
   var self = this;
   var q_link =
      'INSERT INTO `links` ' +
      '(`url`, `name`, `user_id`) ' +
      'VALUES(?, ?, ?)';
   var p_link = [this.url, this.name, this.user_id];

   return db.query(q_link, p_link);
};

Link.create = function(url, name, category_id, user_id) {
   var link = new Link(url, name, user_id);

   link.save().then(function(result) {
      var q_category =
         'INSERT INTO `link_categories` ' +
         '(`link_id`, `category_id`) ' +
         'VALUES(?, ?)';
      var p_category = [result.insertId, category_id];

      return db.query(q_category, p_category);
   });
};

Link.getAll = function() {
   var q =
      'SELECT * FROM `links` ' +
      'ORDER BY `link_id` DESC';

   var links = [];
   return db.query(q).then(function(rows) {
      if (!rows.length) { return []; }

      rows.forEach(function(row) {
         var category = Category.getByLinkId(row.link_id);
         var user = User.getById(row.user_id);
         var comments = Comment.getAll(row.link_id);

         var link = Promise.all([category, user, comments]).then(function(res) {
            return {
               id: row.link_id,
               url: row.url,
               name: row.name,
               category: res[0],
               user: res[1],
               comments: res[2]
            };
         });
         links.push(link);
      });

      return Promise.all(links);
   });
};

Link.getByCategory = function(category_id) {
   var q =
      'SELECT * FROM `links` ' +
      'JOIN `link_categories` USING (`link_id`) ' +
      'WHERE `category_id` = ?';

   return db.query(q, category_id);
};

module.exports = Link;
