"use strict";
var bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define(
    "users",
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          user_name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },            
          first_name:{
            type: DataTypes.STRING
          },
          last_name:{
            type: DataTypes.STRING
          },
          user_type: {
            type: DataTypes.INTEGER, //1=>admin 2=>user
            allowNull: true
          },
          display_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          profile_photo: {
            type: DataTypes.STRING
          },
          status: {
            type: DataTypes.ENUM,
            values: ["enabled", "disabled"],
            defaultValue: "enabled"
          },      
          email: {
            type:DataTypes.STRING,        
            allowNull: false
          }       
    },
    {
        freezeTableName: true,
        hooks: {
          beforeCreate: user => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        }
      }
    )
    Users.associate = function(models) { 
        models.users.belongsTo(models.userType, {
            foreignKey: "user_type",
            as: "userType"   
          });   
          Users.prototype.toJSON = function() {
            var user = Object.assign({}, this.get());
            delete user.password;
            return user;
          };
    }
    return Users;                 

}