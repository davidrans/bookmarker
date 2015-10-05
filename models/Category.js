"use strict";

module.exports = function(sequelize, DataTypes) {
   var Category = sequelize.define('Category', {
      'categoryid': {
         type: DataTypes.INTEGER(10).UNSIGNED,
         autoIncrement: true,
         primaryKey: true
      },
      'name': {
         type: DataTypes.STRING(255),
         allowNull: false
      }
   });

   return Category;
};
