const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../middleWare/auth");

//////////////////// -USER APIS- ////////////////
router.post("/register", userController.register)
router.post("/login", userController.login)
    
//////////////////// -BOOK APIS- ////////////////
router.post("/books",middleware.Authentication,bookController.createBooks);

router.get("/books",middleware.Authentication,bookController.getBooks)

router.put("/books/:bookId",middleware.auth2,bookController.updateBook)





module.exports = router;