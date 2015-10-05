"use strict";

module.exports = function(sequelize, DataTypes) {
   var Post = sequelize.define('Post', {
      postid: {
         type: DataTypes.INTEGER(10).UNSIGNED,
         autoIncrement: true,
         primaryKey: true
      },
      url: {
         type: DataTypes.STRING(255),
         allowNull: false
      },
      title: {
         type: DataTypes.STRING(255),
         allowNull: false
      }
   }, {
      classMethods: {
         associate: function(models) {
            Post.hasMany(models.Comment, {foreignKey: 'postid'});
            Post.belongsTo(models.User, {foreignKey: 'userid'});
            Post.belongsTo(models.Category, {foreignKey: 'categoryid'});
         }
      }
   });

   return Post;
};
