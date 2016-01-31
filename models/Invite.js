"use strict";

module.exports = function(sequelize, DataTypes) {
   var Invite = sequelize.define('Invite', {
      inviteid: {
         type: DataTypes.INTEGER(10).UNSIGNED,
         autoIncrement: true,
         primaryKey: true
      },
      email: {
         type: DataTypes.STRING(255),
         allowNull: false,
         unique: true
      }
   });

   return Invite;
};
