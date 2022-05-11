const userModel=require('../models/userModel')
const bookModel=require('../models/bookModel')
const jwt = require('jsonwebtoken')


const authentication = async function (req, res, next) {
        try {
          let token = req.headers["x-api-key"]||req.headers["X-API-KEY"];
          if (!token) {
            return res
              .status(400)
              .send({ status: false, message: "Please pass token" });
          }

        

          jwt.verify(token, "project3-uranium", function ( error , decode) {
            if(error) {

              return res.status(400).send({status: false, message : error.message})

            }
           //let decodedToken = decode;
            next();
            });

        } catch (error) {
          return res.status(500).send({ status: false, message: error.message });
        }
      };
//AUTHERISATION
      const autherisation= async function(req,res,next){
        try {
            let token = req.headers["x-api-key"]||req.headers["X-API-KEY"];
            if (!token) {
              return res
                .status(400)
                .send({ status: false, message: "Please pass token" });
            }
            let decodedToken;
          jwt.verify(token, "project3-uranium", async function ( error , decode) {
              if(error) {
  
                return res.status(400).send({status: false, message : error.message})
  
              }
              
              decodedToken = decode;
              let loginUserId=decodedToken.userId
              let user = await bookModel.findOne({userId:loginUserId})
              if(!user) return res.status(404).send({status:false, message:" User Not autherized"})
               next();
            });
  
          } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
          }
        };
  
      

module.exports.authentication=authentication
module.exports.autherisation=autherisation