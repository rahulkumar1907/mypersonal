const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require("mongoose")
const moment = require("moment")


///////////////////////// -CREATING BOOK- ///////////////////////////////
// validation for user sendind empty string
    let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return true }  
    if (typeof (value) === "string" && value.trim().length == 0) { return true }
    return false
}


  const createBooks = async function(req, res){
    try{
    let data = req.body;
    let decodedToken = req.decodedToken
// destructure
    let {title, excerpt, userId, ISBN, category, subcategory} = data;

    if(!Object.keys(data).length) return res.status(400).send({status:false, message: "you must enter data for creating books"})
// regex
    let titleregex = /^[a-zA-Z,\-.\s]*$/
    let excerptregex = /^[a-zA-Z,\-.\s]*$/
    let ISBNregex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    let categoryregex = /^[a-zA-Z,\s]*$/

    //Check title
    if(!title) return res.status(400).send({status:false, message: "you must give title"});
    if (keyValid(title)) return res.status(400).send({ status: false, message: "Title should be valid" })
    if(!title.match(titleregex)) return res.status(400).send({ status: false, message: "please enter a valid title" })

    let duplicateTitle = await bookModel.findOne({title: title});
    if(duplicateTitle) return res.status(400).send({status: false, message: "This title is already exist"})
    
    //Check excerpt
    if(!excerpt) return res.status(400).send({status:false, message: "you must give excerpt of the book"})
    if(!excerpt.match(excerptregex)) return res.status(400).send({ status: false, message: "please enter a excerpt of the book" })

    //Check userId
    if(!userId) return res.status(400).send({status:false, message: "you must give UserId"});
    if(!mongoose.isValidObjectId(userId)) return res.status(400).send({status: false, msg: "Invalid user id."})

    let checkUser = await userModel.findById(userId)
    if(!checkUser) return res.status(400).send({status: false, message: "User doesn't exist"});

    //Check ISBN
    if(!ISBN) return res.status(400).send({status:false, message: "you must give ISBN"});
    if(!ISBN.match(ISBNregex)) return res.status(400).send({ status: false, message: "please enter valid ISBN of the book"});

    let checkIsbn = await bookModel.findOne({ISBN: ISBN});
    if(checkIsbn) return res.status(400).send({status: false, message: "This book number is already exists"});

    //check category.
    if(!category) return res.status(400).send({status:false, message: "please give the category of book"});
    if(!category.match(categoryregex)) return res.status(400).send({ status: false, message: "please enter valid category"});

    //check subcategory.
    if(!subcategory) return res.status(400).send({status:false, message: "please give the category of book"});
    subcategory = [...new Set(subcategory)]

    // if(!releasedAt) return res.status(400).send({status:false, message: "releasedAt must be present"});
    data.releasedAt = moment().format("YYYY-MM-DD");

     // ************Authorization Check**************/

    if(decodedToken.userId !== data.userId)
    return res.status(400).send({status:false,message:"you are not authorised"})

   

    let newBook = await bookModel.create(data);
        res.status(201).send({status:true, message: 'Success', data:newBook})

    }
    catch (error) {
        res.status(500).send({status: false, message: error.message,})
    }
}  

module.exports.createBooks = createBooks

