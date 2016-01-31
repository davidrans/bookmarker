"use strict";

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
      googleid: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      google_token: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      name: {
         type: DataTypes.STRING(255),
         allowNull: false
      }
   });

   return User;
};
