const bookModel = require("../models/bookModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Please pass token" });
    }

    //decode token
    try {
      const decodedToken = jwt.verify(token, "project3-uranium", {
        ignoreExpiration: true,
      });

      if (Date.now() > decodedToken.exp * 1000) {
        return res
          .status(401)
          .send({ status: false, message: "session expired" });
      }

      req.decodedToken = decodedToken;
    } catch (error) {
      return res
        .status(401)
        .send({ status: false, message: "Authentication failed" });
    }
    console.log("authentication successful");
    next();
    // });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//Authorization
const authorization = async function (req, res, next) {
  try {
    const decodedToken = req.decodedToken;

    let id = decodedToken.userId;

    const _id = req.params.bookId;

    if (_id) {
      //id format validation
      if (_id) {
        if (mongoose.Types.ObjectId.isValid(_id) == false) {
          return res
            .status(400)
            .send({ status: false, message: "Invalid bookId" });
        }
      }

      const book = await bookModel.findById({ _id });
      console.log(book);

      //no book found
      if (!book) {
        return res
          .status(404)
          .send({ status: false, message: "book not found" });
      }

      if (book.userId != id) {
        return res
          .status(401)
          .send({ status: false, message: "Not authorised" });
      }

      console.log("authorization successful");

      next();
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, authorization };
