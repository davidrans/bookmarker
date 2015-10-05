var Sequelize = require('sequelize');
var config = require('../config');

module.exports = new Sequelize(
         config.mysql.db,
         config.mysql.user,
         config.mysql.pass, {
   host: config.mysql.host,
   dialect: 'mysql',

   pool: {
      max: 5,
      min: 0,
      idle: 10000
   }
});
