var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var Promise = require('promise');
var Link = require('../models/Link');
var Category = require('../models/Category');

/* GET home page. */
router.get('/', function(req, res) {
   var links = Link.getAll();
   var categories = db.query('SELECT * FROM categories');

   Promise.all([links, categories]).done(function(result) {
      links = result[0];
      categories = result[1];

      res.render('index', {
         links: links,
         categories: categories
      });
   });
});

router.post('/', function(req, res) {
   var link = new Link(req.body.url, req.body.name, req.body.category);
   link.save();
});

router.get('/:category', function(req, res) {
   Category.getByName(req.params.category).then(function(category) {
      if (!category) { res.status(404).send('No such category'); }

      Link.getByCategory(category.id).done(function(links) {
         res.render('category', {
            category: category,
            links: links
         });
      });
   });
});

module.exports = router;
