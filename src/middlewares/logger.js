const models = require("../models");
const log = (req, res, next) => {
    res.setHeader('Inapp', 'Bibin-Machine test');
    var logData ={};
    logData.request = req.originalUrl;
    logData.method=req.method;
    logData.user_id=req.user? req.user.user_id:null
    addlog(logData)
    return next();
  };
  function addlog(logData){
    try {
        models.access_logs.create(logData).then(
          function(logData) {
           console.log('request logged')
          },
          function(err) {
           console.log('Request log failed')
          }
        );       
      } catch (error) {
        console.log('Request log failed')       
      }
  }
  module.exports = log;