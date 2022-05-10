const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const bookControllers = require("../controllers/bookControllers");

router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);

router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);

router.post("/books", bookControllers.createBook);
router.get("/books", bookControllers.getBook);
router.get("/books/:bookId", bookControllers.getBookDetails);
router.put("/books/:bookId", bookControllers.updateBook);
router.delete("/books/:bookId", bookControllers.deleteBook);



module.exports = router