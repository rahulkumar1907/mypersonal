const collegeModel = require("../models/collegeModel");
// const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


const createCollege = async function (req, res) {
  try {
    let Body = req.body
    let arr = Object.keys(Body)
    if (arr.length == 0) return res.status(400).send({ status: false, msg: "Invalid request. Please provide Details" })
    else if (!Body.name) return res.status(400).send({ status: false, msg: "name is required" })
    else if (!Body.fullname) return res.status(400).send({ status: false, msg: "fullname is required" })
    else if (!Body.logoLink) return res.status(400).send({ status: false, msg: "logoLink is required" })


    let name1 = await collegeModel.findOne({ name: Body.name });
    if (name1) { res.status(400).send({ status: false, Error: "College already exist!" }); }
    else {
      let collegeCreated = await collegeModel.create(Body);
      res.status(201).send({ status: true, data: collegeCreated });
    }
  
}
  catch (err) {
    res.status(500).send({ msg: "Server not responding", error: err.message });
  }
}

  module.exports.createCollege = createCollege;






