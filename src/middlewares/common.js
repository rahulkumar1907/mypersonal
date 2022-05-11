const userModel = require("../models/userModel");
const bookModel = require("../models/bookModel");
const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Please pass token" });
    }

    jwt.verify(token, "project3-uranium", function (error, decode) {
      if (error) {
        return res.status(400).send({ status: false, message: error.message });
      }
      //let decodedToken = decode;
      next();
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//AUTHERISATION
const autherisation = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Please pass token" });
    }
    let decodedToken;
    jwt.verify(token, "project3-uranium", async function (error, decode) {
      if (error) {
        return res.status(400).send({ status: false, message: error.message });
      }

      decodedToken = decode;
      let _id = decodedToken.userId;

      const id = req.params.bookId;
      if (id) {
        //id format validation
        if (id) {
          if (mongoose.Types.ObjectId.isValid(_id) == false) {
            return res
              .status(400)
              .send({ status: false, message: "Invalid bookId" });
          }
        }
        
        const book = await bookModel.findById({ _id: id });

        if (book.userId != _id) {
          return res
            .status(401)
            .send({ status: false, message: "Not authorised" });
        }

        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.authentication = authentication;
module.exports.autherisation = autherisation;
