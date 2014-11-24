var mysql = require('mysql'),
    config = require('../config'),
    Promise = require('promise');

var pool = mysql.createPool({
   host:       config.mysql.host,
   database:   config.mysql.db,
   user:       config.mysql.user,
   password:   config.mysql.pass
});

pool.query = Promise.denodeify(pool.query);

module.exports = pool;
