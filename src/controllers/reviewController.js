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
    if (data.reviewedBy && !data.reviewedBy.match(/^[a-zA-Z,\-.\s]*$/)) return res.status(400).send({ status: false, msg: "enter a valid name" })

    // add reviewed At date.
    data.reviewedAt = Date.now();

    //Check rating
    if(!data.rating) return res.status(400).send({status: false, message: "You must give rating of this book."})
    if (typeof data.rating != 'number' || data.rating < 1 || data.rating > 5)
    return res.status(400).send({status: false, message: 'Rating should be an Integer & between 1 to 5'})

    //In book collection review increased by 1
    const updatedBooks = await bookModel.findOneAndUpdate({_id: bookId, isDeleted: false}, {$inc: {reviews: 1}})

    let createdReview =await reviewModel.create(data)

    let {...data2} = updatedBooks
    data2._doc.reviewsData = createdReview
    return res.status(201).send({ status: true, message: 'Success', data: data2._doc })
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
    if (!data.reviewedBy.match(/^[a-zA-Z,\-.\s]*$/)) return res.status(400).send({ status: false, msg: "enter a valid reviewer's name"})

    const searchBook = await bookModel.findOne({_id: bookId, isDeleted:false})

    if(!searchBook) return res.status(404).send({ status: false, message: " Book deleted or not exist with this id"})

    const updateReview = await reviewModel.findOneAndUpdate({_id: reviewId, bookId: bookId, isDeleted:false}, {review: review, rating: rating, reviewedBy: reviewedBy}, {new: true})

    let {...data3} = searchBook;
    data3._doc.reviewsData = updateReview

    if(!updateReview) return res.status(404).send({ status: false, message: "Review deleted or not exist with this id"})

    return res.status(200).send({status: true, message: "Books list", data: data3._doc})

 
    }catch(error) {
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


    const deleteReview = await reviewModel.findOneAndUpdate({_id: reviewId, bookId:bookId, isDeleted: false}, { isDeleted: true, deletedAt: Date.now()})

    if(!deleteReview) return res.status(404).send({ status: false, message: "review not found"});
    
    await bookModel.findOneAndUpdate({_id: bookId, isDeleted: false}, {$inc: {reviews: -1}})

    res.status(200).send({ status: true, message: "Review has been deleted successfully" });
}
catch(error){
    res.status(500).send({status: false, message: error.message})
}




}


module.exports = {createReview, updateReview, deleteReview};
