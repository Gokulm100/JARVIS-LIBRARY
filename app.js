const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const userSettings = require("./src/routes/userRouter");
const bookSettings = require("./src/routes/bookRouter");
const models = require("./src/models");
var winston = require("winston"),
expressWinston = require("express-winston");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const http = require("http");
const path = require("path");
const port = process.env.PORT||3000
app.use(expressWinston.logger({ 
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.colorize({
      all:true
    })
  ),
  level:"info",
  meta: true,
  // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // optional: allows to skip some log messages based on request and/or response
  , transports: [
    new winston.transports.Console(
      {
        level:"info"
      }
    )
  ]
}));
app.get("/", function(req, res) {
res.setHeader('Inapp', 'Bibin-Machine test');
  res.send("Connected to JARVIS-Library API");
});
app.use("/assets",express.static(path.join(__dirname, "assets")));
app.use("/users", userSettings);
app.use("/bookRouter", bookSettings);
app.listen(port,()=>{
  console.log('Connected to port '+port)
});
models.sequelize.sync().then(function() {
  console.log('Database Synced!')
})
module.exports = app;
