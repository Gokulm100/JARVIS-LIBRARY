"use strict";
module.exports = (sequelize, DataTypes) => {
  var userType = sequelize.define("userType", {
    type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_type:{
      type:DataTypes.STRING
    }
  });
  userType.associate = function(models) {
    models.userType.hasMany(models.users, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "user_type",
        field: "user_type",
        allowNull: false
      }
    });
  };
  return userType;
};