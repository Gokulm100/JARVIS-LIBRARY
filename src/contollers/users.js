const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const models = require("../models");
const users = require("../models/users");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var config = require("../config/config.json");
var settings = {
    //function to add user type
    addUserType: function(req, res) {
      try {
        models.userType.create(req.body).then(
          function(userType) {
            res.json({
              status: "success",
              data: userType,
              message: "User type created successfully"
            });
          },
          function(err) {
            res.json({
              status: "failed",
              data: err,
              message: "User type could not be added.Please try again"
            });
          }
        );       
      } catch (error) {
        res.json({
          status: "failed",
          data: err,
          message: "Unable to process Your request !"
        });          
      }
  },  
    //function to add users
    addUsers: function(req, res) {
      try {
        checkUserAlreadyExists(req.body.user_name).then(stat=>{
          if(stat==1){
            res.json({
              status: "failed",
              data: [],
              message: "User could not be added.Username already exists!"
            });            
          }else{
            if(req.file){
              req.body.profile_photo=req.file.path
            }
            models.users.create(req.body).then(
              function(Users) {
                const token = generateInitailToken(users.user_id,users.email)
                Users= Users.toJSON()
                Users.token =  token;
                res.json({
                  status: "success",
                  data: Users,
                  message: "Users registered successfully"
                });
              },
              function(err) {
                res.json({
                  status: "failed",
                  data: err,
                  message: "User could not be added.Please try again"
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
    //function for user login
    login: function(req, res) {
      try {
        if (req.body.user_name == null || req.body.user_name == "") {
          throw { err: "Username is Empty" };
        } else if (req.body.password == null || req.body.password == "") {
          throw { err: "Password is empty" };
        }
        models.users
          .findOne({
            where: { user_name: req.body.user_name }
          })
          .then(
            user => {
              if (user && user.user_id) {
                if (req.body.password) {
                  if (bcrypt.compareSync(req.body.password, user.password)) {
                    let token = jwt.sign({  user_id: user.user_id ,email:user.email }, config.secret);
                    res.json({
                      status: "success",
                      data: user,
                      message: "correct password",
                      token: token
                    });
                  } else {
                    res.json({
                      status: "failed",
                      message: "wrong password"
                    });
                  }
                } else {
                  res.json({
                    status: "failed",
                    message: "please enter password"
                  });
                }
              } else {
                res.json({
                  status: "failed",
                  message: "invalid username"
                });
              }
            },
            err => {
              res.json({
                status: "failed",
                errors: err,
                message: "some error occured,please try again"
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
function generateInitailToken(user_id,email){
      const token = jwt.sign(
        { user_id: user_id ,email:email },
        config.secret,
        {
          expiresIn: "2h",
        }
      );
      return token;
}
function checkUserAlreadyExists(name, id = null) {
  let conditions = {}
  if (id) {
    conditions.where = { id: { [Op.ne]: id }, user_name: name }
  } else {
    conditions.where = { user_name: name }
  }
  return new Promise((resolve, reject) => {
    models.users.findAll(conditions).then(stat => {
      if (stat.length > 0) {
        resolve(1)
      } else {
        resolve(0)
      }

    })
  })
}
module.exports= settings;