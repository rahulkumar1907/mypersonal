const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../middleware/auth");

//////////////////// -USER APIS- ////////////////
router.post("/register", userController.register)
router.post("/login", userController.login)
    
//////////////////// -BOOK APIS- ////////////////
router.post("/books",middleware.Authentication,bookController.createBooks);






module.exports = router;