var db = require('../lib/db');

var Link = function(url, name, category) {
   this.url = url;
   this.name = name;
   this.category = category;
};

Link.prototype.save = function() {
   var self = this;
   var q_link =
      'INSERT INTO `links` ' +
      '(`url`, `name`) ' +
      'VALUES(?, ?)';
   var p_link = [this.url, this.name];

   return db.query(q_link, p_link).then(function(result) {
      var q_category =
         'INSERT INTO `link_categories` ' +
         '(`link_id`, `category_id`) ' +
         'VALUES(?, ?)';
      var p_category = [result.insertId, self.category];

      return db.query(q_category, p_category);
   });
};

Link.getAll = function() {
   return db.query('SELECT * FROM `links`');
};

Link.getByCategory = function(category_id) {
   var q =
      'SELECT * FROM `links` ' +
      'JOIN `link_categories` USING (`link_id`) ' +
      'WHERE `category_id` = ?';

   return db.query(q, category_id);
};

module.exports = Link;
