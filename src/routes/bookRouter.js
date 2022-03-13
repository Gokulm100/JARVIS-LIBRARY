var fs = require("fs");
var express = require("express");
const router = express.Router();
const books = require("../contollers/books");
const multer = require("multer");
const authMiddleware = require("../middlewares/authorize");
const logMiddleware = require("../middlewares/logger");
const coverPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      let dir = "./assets/books/covers";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return cb(null, dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now());
    }
  });
const CoverImageUpload = multer({ storage: coverPicStorage });
  //API to Add new genre
  router
  .route("/addGenre")
  .post(authMiddleware,logMiddleware,books.addGenre);
//API to Add new book
router
  .route("/addBooks")
  .post(authMiddleware,logMiddleware,CoverImageUpload.single("coverImage"), books.addBooks);
//API to edit existing book
  router
  .route("/updateBooks")
  .post(authMiddleware,logMiddleware,CoverImageUpload.single("coverImage"), books.updateBook);
  //API to Add new genre
  router
  .route("/listBooks/:book_id?")
  .get(authMiddleware,logMiddleware,books.listBooks);

  module.exports = router;