const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
 const internController = require("../controllers/internController")
// const middleWare = require("../middlewares/commonMiddleware")

router.post("/colleges",collegeController.createCollege)

 router.post("/interns",internController.createIntern)

 router.get("/getdetails",internController.collegeDetails)

// router.put("/blogs/:blogId",middleWare.authentication,middleWare.authorisation,blogController.updateBlog)

// router.delete("/blogs/:blogId",middleWare.authentication,middleWare.authorisation,blogController.deleteBlog)
// router.delete("/blogs",middleWare.authentication,middleWare.authorisation,blogController.deleteBlog1)

// router.post("/login", authorController.loginAuthor)


module.exports = router;
