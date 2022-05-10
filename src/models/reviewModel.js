const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: { type: ObjectId, ref: "books", required: true, trim:true },
    reviewedBy: { type: String, default: "Guest",  trim:true},
    reviewedAt: { type: String, required: true, trim:true },
    rating: { type: Number, required: true, trim:true },
    review: { type: String , trim:true},
    isDeleted: { type: Boolean, default: false },

}, { timestamps: true })

module.exports = mongoose.model('review', reviewSchema)