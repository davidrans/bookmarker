var db = require('../lib/db');

var Category = function(name) {
   this.name = name;
};

Category.prototype.save = function() {
   var q =
      'REPLACE INTO `categories` ' +
      'SET `name` = ?';

   return db.query(q, this.name);
};

Category.get = function(category_id) {
   var q =
      'SELECT * FROM `categories` ' +
      'WHERE `category_id` = ?';

   return db.query(q, category_id).then(function(rows) {
      if (!rows.length) { return null; }

      var cat = rows[0];
      return new Category(cat.name, cat.category_id);
   });
};

Category.getByName = function(name) {
   var q =
      'SELECT * FROM `categories` ' +
      'WHERE `name` = ?';

   return db.query(q, name).then(function(rows) {
      if (!rows.length) { return null; }

      var cat = rows[0];
      return new Category(cat.name, cat.category_id);
   });
};

Category.getAll = function() {
   var q = 'SELECT * FROM `categories`';

   var cats = [];
   return db.query(q).then(function(rows) {
      if (!rows.length) { return []; }

      rows.forEach(function(row) {
         cats.push(new Category(row.name, row.category_id));
      });

      return cats;
   });
};

module.exports = Category;
