const express = require("express");
const fs = require("fs");
const router = express.Router();
const users = require("../contollers/users");
const multer = require("multer");
const logMiddleware = require("../middlewares/logger");
const UsersPicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      let dir = "./assets/userData/profilePics";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return cb(null, dir);
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + " " + Date.now());
    }
  });
const UsersImageUpload = multer({ storage: UsersPicStorage });
router
  .route("/addUserType")
  .post(logMiddleware,users.addUserType);
router
  .route("/addUsers")
  .post(logMiddleware,UsersImageUpload.single("UsersImage"), users.addUsers);
  router
  .route("/login")
  .post(logMiddleware,users.login);

  module.exports = router;