const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const mongoose = require("mongoose")
const moment = require("moment")


///////////////////////// -CREATING BOOK- ///////////////////////////////
// validation for user sendind empty string
    let keyValid = function (value) {
    if (typeof (value) == "undefined" || typeof (value) == null) { return false }  
    if (typeof (value) === "string" && value.trim().length == 0) { return false }
    return true
}


  const createBooks = async function(req, res){
    try{
    let data = req.body;
    let decodedToken = req.decodedToken
// destructure
    let {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = data;

    console.log(releasedAt)

    if(!Object.keys(data).length) return res.status(400).send({status:false, message: "you must enter data for creating books"})
// regex
    // let titleregex = /^[a-zA-Z,\-.\s]*$/
    let excerptregex = /^[a-zA-Z,\-.\s]*$/
    let ISBNregex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
    let categoryregex = /^[a-zA-Z,\s]*$/
    let dateRegex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/

    //Check title
    if(!title) return res.status(400).send({status:false, message: "you must give title"});
    if (!keyValid(title)) return res.status(400).send({ status: false, message: "Title should be valid" })
    // if(!title.match(titleregex)) return res.status(400).send({ status: false, message: "please enter a valid title" })

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
    if(checkIsbn) return res.status(400).send({status: false, message: "This ISBN is already exists"});

    //check category.
    if(!category) return res.status(400).send({status:false, message: "please give the category of book"});
    if(!category.match(categoryregex)) return res.status(400).send({ status: false, message: "please enter valid category"});

    //check subcategory.
    if(!subcategory) return res.status(400).send({status:false, message: "please give the category of book"});
    subcategory = [...new Set(subcategory)]

    if(!releasedAt) return res.status(400).send({status:false, message: "releasedAt must be present"});
    if(!releasedAt.match(dateRegex)) return res.status(400).send({status:false, message:"please enter valid date"})
    // data.releasedAt = moment().format("YYYY-MM-DD");

     // ************Authorization Check**************/

    if(decodedToken.userId !== data.userId)
    return res.status(400).send({status:false,message:"you are not authorised"})

   

    let newBook = await bookModel.create(data);
        res.status(201).send({status:true, message: 'Success', data:newBook})

    }
    catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
}  

const getBooks = async function(req, res){
    try{
    let data = req.query
        let book = await bookModel.find({$and : [data, {isDeleted: false}]}).select({"_id": 1, "title": 1, "excerpt": 1, "userId": 1, "ISBN": 1, "category": 1, "releasedAt": 1, "reviews":1}).sort({"title": 1})

        if(!book) return res.status(404).send({status: false, message: "book not found"})
        res.status(200).send({status: true, message: "Books list", data: book})
    }
    catch(error){res.status(500).send({status: false, message: error.message})}
    
}





    const updateBook = async function (req, res){
        try {
            let getId = req.params.bookId;
            let data = req.body;

            let checkId = await bookModel.findById(getId);
            if(checkId){
                if(checkId.isDeleted === false){
                    let check = await bookModel.findByIdAndUpdate(getId,{
                        title:data.title,
                        excerpt:data.excerpt,
                        ISBN:data.ISBN
                    },
                    {new:true}
                    );
                    res.status(200).send({status:true, data:check});
                }
                else{res.staus(400).send({status:false,message:"can't update It is already deleted"})}
            }
            else{res.status(400).send({status:false, message:"PLease enter UserId"})}
        }
        catch(error){res.status(500).send({status:false, message: error.message})}
    }

        // const deleteBook = async function(req,res)


module.exports = {createBooks,updateBook,getBooks}

