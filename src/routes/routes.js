const express = require('express');
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const bookControllers = require("../controllers/bookControllers");


router.post("/register",userControllers.createUser)










module.exports=router