const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const userModel = require("../models/userModel");

/////////////////////// -AUTHENTICATION- //////////////////////////////
const Authentication = async function (req, res, next) {
    // compare the logged in user's Id and the Id in request
    try {
  
      let token = req.headers["x-api-key"];
      // if (!token) { req.headers["X-api-key"]}
      if (!token) return res.status(404).send({ status: false, message: "token must be required in the header" });
  
      let decodedToken = jwt.verify(token, "functionUp")
        if (!decodedToken) return  res.status(400).send({ status: false, message: "invalid token" });

        // if (decodedtoken.userId != get.userId) {
        //   return res.status(403).send({ status: false, msg: "NOT AUTHORISED" });
        // }
        req.decodedToken = decodedToken;
        next();
      }
     catch (error) { res.status(500).send({ status: false, message: error.massage })}
};

const auth2 = async function (req, res, next){
  let userId = req.params.userId
  let get = await userModel.findById(userId).select({userId:1,_id:0});
  if (!get){return res.status(400).send(400)({status:false, message:"please enter valid user id"});}

  let token = req.headers["x-api-key"]
  if(!token){ return res.status(400).send({status:false,message:"Kindly add token"});}

  let decodedToken = jwt.verify(token,"functionUp");
  if(decodedToken.userId != get.userId){return res.status(403).send({status:false, message:"not authorised"});}
  next();
}




//////////////////////// -AUTHORIZATION- ////////////////////////////////


module.exports= {Authentication,auth2}
