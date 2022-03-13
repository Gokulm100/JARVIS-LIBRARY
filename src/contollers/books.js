var express = require("express");
const app = express();
var Sequelize = require("sequelize");
var models = require("../models");
const Op = Sequelize.Op
var books = {
  //function to add new genre
  addGenre: function (req, res) {
    try {
      var genreExists = checkgenreExists(req.body.name);
      genreExists.then(stat => {
        if (stat == 1) {
          res.json({
            status: "failed",
            data: [],
            message: "Genre Already Exists!.Please try again"
          });
        } else {
          models.genre.create(req.body).then(
            function (genre) {
              res.json({
                status: "success",
                data: genre,
                message: "New genre added successfully!"
              });
            },
            function (err) {
              res.json({
                status: "failed",
                data: err,
                message: "Genre could not be added.Please try again"
              });
            }
          );
        }
      })
    } catch (error) {
      res.json({
        status: "failed",
        data: error,
        message: "Unable to process your request !"
      });
    }
  },
  //function to add new book
  addBooks: function (req, res) {
    try {
      checkBookAlreadyExists(req.body.name, req.body.author).then(stat => {
        if (stat == 1) {
          res.json({
            status: "failed",
            data: [],
            message: "Failed to add book!Same book already exists!"
          });
        } else {
          if(req.file){
            req.body.coverImage=req.file.path;
          }
          models.books.create(req.body).then(
            function (book) {
              res.json({
                status: "success",
                data: book,
                message: "New Book Added successfully!"
              });
            },
            function (err) {
              res.json({
                status: "failed",
                data: err,
                message: "Book could not be added.Please try again"
              });
            }
          );
        }
      })
    } catch (error) {
      res.json({
        status: "failed",
        data: err,
        message: "Unable to process Your request !"
      });
    }
  },
  //Function to update books
  updateBook: function (req, res) {
    try {
      if (req.query.book_id == null || req.query.book_id == "") {
        throw { err: "Book Id is empty" };
      }
      checkBookAlreadyExists(req.body.name, req.query.book_id).then(stat => {
        if (stat == 1) {
          res.json({
            status: "failed",
            data: [],
            message: "Failed to add book!Same book already exists!"
          });
        } else {
          if(req.file){
            req.body.coverImage=req.file.path;
          }          
          models.books
            .update(req.body, {
              where: { id: req.query.book_id }
            })
            .then(
              function () {
                res.json({
                  status: "success",
                  message: "Book details updated successfully."
                });
              },
              function (err) {
                res.json({
                  status: "failed",
                  data: err,
                  message: "could not update book details.please try again!"
                });
              }
            );
        }
      })
    } catch (err) {
      res.json({
        status: "failed",
        data: err,
        message: "Unable to process Your request !"
      });
    }
  },
  //Function to List books
  listBooks: function (req, res) {
    try {
      let conditions = {};
      if (req.params.book_id) {
        conditions.where = { id: req.params.book_id, name: { [Op.like]: req.query.name + '%' } };
      } else {
        conditions.where = {
          name: req.query.name ? { [Op.like]: req.query.name + '%' } : { [Op.ne]: null },
          language: req.query.language ? { [Op.like]: req.query.language + '%' } : { [Op.ne]: null }
        };
      }
      conditions.order = [["id", "DESC"]]
      if (
        !isNaN(parseInt(req.query.start)) &&
        !isNaN(parseInt(req.query.limit))
      ) {
        conditions.offset = parseInt(req.query.start);
        conditions.limit = parseInt(req.query.limit);
      }
      conditions.include = [{
        model: models.genre,
        as: 'genreName',
        attributes: ['name'],
        required: true,
        where: {
          name: req.query.genre ? { [Op.like]: req.query.genre + '%' } : { [Op.ne]: null }
        }
      }]
      models.books.findAll(conditions).then(
        function (books) {
          res.json({
            status: "success",
            data: books,
            message: "Book details fetched successfully."
          });
        },
        function (err) {
          res.json({
            status: "failed",
            data: err,
            message: "Could not fetch book details.please try again"
          });
        }
      );
    } catch (err) {
      res.json({
        status: "failed",
        data: err,
        message: "Unable to process Your request !"
      });
    }
  },
}
function checkgenreExists(name) {
  return new Promise((resolve, reject) => {
    models.genre.findAll({ where: { name: name } }).then(stat => {
      if (stat.length > 0) {
        resolve(1)
      } else {
        resolve(0)
      }

    })
  })
}
function checkBookAlreadyExists(name, id = null) {
  let conditions = {}
  if (id) {
    conditions.where = { id: { [Op.ne]: id }, name: name }
  } else {
    conditions.where = { name: name }
  }
  return new Promise((resolve, reject) => {
    models.books.findAll(conditions).then(stat => {
      if (stat.length > 0) {
        resolve(1)
      } else {
        resolve(0)
      }

    })
  })
}
module.exports = books;