"use strict";
var bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define(
    "books",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          genre_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },            
          yearPublished:{
            type: DataTypes.INTEGER
          },
          author: {
            type: DataTypes.STRING, //1=>admin 2=>user
            allowNull: true
          },
          language: {
            type: DataTypes.STRING,
            allowNull: false
          },
          coverImage:{
            type: DataTypes.STRING
          },
          status: {
            type: DataTypes.ENUM,
            values: ["enabled", "disabled"],
            defaultValue: "enabled"
          },           
    },
    {
        freezeTableName: true,
      }
    )
    books.associate = function(models) { 
        models.books.belongsTo(models.genre, {
          foreignKey: "genre_id",
          as: "genreName"   
        });  
    }
    return books;                 

}