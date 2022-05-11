const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");

const createReview = async function(req, res){
   try {
    let data = req.body
    let bookId = req.params.bookId

    /*****************************************Validation***************************************/
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid book id."})
    
    if(!Object.keys(data).length) return res.status(400).send({status: false, message: "You must give data for review creation."})

    //Add book id in requestbody
    data.bookId = bookId

    //Check bookId in DB
    let checkBookId = await bookModel.findOne({_id: bookId, isDeleted: false});
    if (!checkBookId) return res.status(404).send({status: false, message: "Book doesn't exist"})

    // check reviewedBy
    if(!data.reviewedBy) return res.status(400).send({status: false, message: "Please enter your name"})
    if (data.reviewedBy && !data.reviewedBy.match(/^[a-zA-Z,\-.\s]*$/)) return res.status(400).send({ status: false, msg: "enter a valid name" })

    // add reviewed At date.
    data.reviewedAt = Date.now();

    //Check rating
    if(!data.rating) return res.status(400).send({status: false, message: "You must give rating of this book."})
    if (typeof data.rating != 'number' || data.rating < 1 || data.rating > 5)
    return res.status(400).send({status: false, message: 'Rating should be an Integer & between 1 to 5'})

    //In book collection review increased by 1
    await bookModel.findOneAndUpdate({_id: bookId, isDeleted: false}, {$inc: {reviews: 1}})

    let createdReview =await reviewModel.create(data)
    return res.status(201).send({ status: true, message: 'Success', data: createdReview })
}
catch(error){
    res.status(500).send({ status: false, message: error.message }) 
}
}



module.exports = createReview;
