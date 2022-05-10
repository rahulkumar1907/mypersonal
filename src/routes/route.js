const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const middleware = require("../middleWare/auth");

//////////////////// -USER APIS- ////////////////
router.post("/register", userController.register)
router.post("/login", userController.login)
    
//////////////////// -BOOK APIS- ////////////////
router.post("/books", middleware, bookController.createBooks);

router.get("/books", middleware, bookController.getBooks)

router.put("/books/:bookId", middleware, bookController.updateBook)

router.delete("/books/:bookId", middleware, bookController.deleteBook)





module.exports = router;