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









module.exports = router