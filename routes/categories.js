var express = require('express');
var router = express.Router();
var db = require('../lib/db');

router.get(/\w+/, function(req, res) {
   db.query('SELECT * FROM categories', function(err, rows) {
      if (err) { throw err; }

      console.log(rows);
   });
   res.render('index', { title: 'Express' });
});

module.exports = router;
