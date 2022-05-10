const reviewModel = require("../models/reviewModel");
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')

const createReview = async function (req, res) {
  try {
       //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "userId Invalid" });
      }
    }

    //fetch book with bookId
    const book = await bookModel.findOne({
      $and: [{ _id }, { isDeleted: false }],
    });

    //no books found
    if (!book) {
      return res.status(200).send({ status: true, data: "book not found" });
    }

    

  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const updateReview = async function (req, res) {
  try {
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const deleteReview = async function (req, res) {
  try {
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

module.exports = { createReview, updateReview, deleteReview };
