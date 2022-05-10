const express = require("express");
const router = express.Router(); //used express to create route handlers
//import controllers
const userControllers = require("../controllers/userControllers");
const bookControllers = require("../controllers/bookControllers");

//User API's
router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);

//Book API's
router.post("/books", bookControllers.createBook);
router.get("/books", bookControllers.getBook);
router.get("/books/:bookId", bookControllers.getBookDetails);
router.put("/books/:bookId", bookControllers.updateBook);
router.delete("/books/:bookId", bookControllers.deleteBook);

module.exports = router;
