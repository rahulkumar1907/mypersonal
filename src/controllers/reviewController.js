const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");

///////////////////////// -CREATE REVIEW- ///////////////////////////////

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

///////////////////////// -UPDATE REVIEW- ///////////////////////////////

const updateReview = async function(req, res){
    try{
    let data = req.body
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId
    const {review, rating, reviewedBy} = data

    /************** Validation for bookId and reviewId **************/
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid book id."})

    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid review id."})

    if(!Object.keys(data).length) return res.status(400).send({status: false, message: "You must give data for review updation."})

    // check review
    if(!review)  return res.status(400).send({ status: false, message: "Review is missing"})

    // check rating
    if(!rating)  return res.status(400).send({ status: false, message: "Rating is missing"})

    if (typeof data.rating != 'number' || data.rating < 1 || data.rating > 5)
    return res.status(400).send({status: false, message: 'Rating should be an Integer & between 1 to 5'})

    // check reviewedBy
    if(!reviewedBy)  return res.status(400).send({ status: false, message: "Reviewer's name is missing"})

    const searchBook = await bookModel.findById(bookId)

    if(!searchBook) return res.status(404).send({ status: false, message: " Book does not exist with this id"})

    const searchReview = await reviewModel.findById(reviewId)

    if(!searchReview) return res.status(404).send({ status: false, message: " Review does not exist with this id"})

    if(searchBook.isDeleted == false){
        if(searchReview.isDeleted == false){
            const updatedReview = await reviewModel.findOneAndUpdate({_id: reviewId}, {review: review, rating: rating, reviewedBy: reviewedBy}, { new: true })

            return res.status(200).send({status: true, message: "Books list", data: updatedReview})
        }else {
            return res.status(400).send({ status: false, message: "Unable to update. Review has been already deleted"})

        } 
    }else {
        return res.status(400).send({ status: false, message: "Unable to update. Book already deleted"})
        
    }}catch(error) {
    res.status(500).send({ status: false, message: error.message }) 

    }

}

///////////////////////// -DELETE REVIEW- ///////////////////////////////
const deleteReview = async function (req, res){
    try { 
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid book id."})
    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "Invalid review id."})
    
    const checkBook = await bookModel.findById(bookId)
    if(!checkBook) return res.status(404).send({ status: false, message: "book doesn't exist"})

    const checkReview = await reviewModel.findById(reviewId)
    if(!checkReview) return res.status(404).send({ status: false, message: "Review doesn't exist"})


    const deleteReview = await reviewModel.findOneAndUpdate({_id: reviewId, isDeleted: false}, { isDeleted: true })

    if(!deleteReview) return res.status(404).send({ status: false, message: "review not found"});

    res.status(200).send({ status: true, message: "Review has been deleted successfully" });
}
catch(error){
    res.status(500).send({status: false, message: error.message})
}




}


module.exports = {createReview, updateReview, deleteReview};
