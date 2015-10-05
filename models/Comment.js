"use strict";

module.exports = function(sequelize, DataTypes) {
   var Comment = sequelize.define('Comment', {
      'commentid': {
         type: DataTypes.INTEGER(10).UNSIGNED,
         autoIncrement: true,
         primaryKey: true
      },
      text: {
         type: DataTypes.TEXT,
         allowNull: false
      }
   }, {
      classMethods: {
         associate: function(models) {
            Comment.belongsTo(models.Post, {foreignKey: 'postid'});
            Comment.belongsTo(models.User, {foreignKey: 'userid'});
         }
      }
   });

   return Comment;
};
