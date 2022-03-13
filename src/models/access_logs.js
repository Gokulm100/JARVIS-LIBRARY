
"use strict";
var bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  var access_logs = sequelize.define(
    "access_logs",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          request: {
            type: DataTypes.STRING,
            allowNull: false
          },            
          method:{
            type: DataTypes.STRING
          },
          user_id: {
            type: DataTypes.INTEGER, 
            allowNull: true
          },       
    },
    {
        freezeTableName: true,
      }
    )
    return access_logs;                 

}