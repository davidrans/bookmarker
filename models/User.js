"use strict";

var bcrypt = require('bcrypt-nodejs');
var UserLib = require('../lib/UserLib');

module.exports = function(sequelize, DataTypes) {
   var User = sequelize.define('User', {
      userid: {
         type: DataTypes.INTEGER(10).UNSIGNED,
         autoIncrement: true,
         primaryKey: true,
      },
      email: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      password: {
         type: DataTypes.STRING(255),
         allowNull: false,

         set: function(val) {
            this.setDataValue('password', UserLib.generateHash(val));
         }
      }
   });

   return User;
};
