const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

/////////////////////// -AUTHENTICATION- //////////////////////////////
const Authentication = async function (req, res, next) {
    // compare the logged in user's Id and the Id in request
    try {
  
      const token = req.headers["x-api-key"];
      if (!token) {
       return res.status(404).send({ status: false, message: "token must be required in the header" });
      }
  
       jwt.verify(token, "functionUp",function(error){
        if (error){
          return  res.status(400).send({ status: false, message: "invalid token" });
        }
        next();
      });
        
       } catch (error) { res.status(500).send({ status: false, message: error.massage })}
};




//////////////////////// -AUTHORIZATION- ////////////////////////////////


module.exports.Authentication= Authentication
