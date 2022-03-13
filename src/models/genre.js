"use strict";
module.exports = (sequelize, DataTypes) => {
  var genre = sequelize.define("genre", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name:{
      type:DataTypes.STRING
    }
  });
  genre.associate = function(models) {
    models.genre.hasMany(models.books, {
      onDelete: "CASCADE",
      foreignKey: {
        name: "genre_id",
        field: "genre_id",
        allowNull: false
      }
    });
  };
  return genre;
};