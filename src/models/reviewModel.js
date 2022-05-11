const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//structure of document
const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: ObjectId, ref: "books", trim: true },
    reviewedBy: { type: String, default: "Guest", trim: true },
    reviewedAt: {type:Date, default: Date, trim: true },
    rating: { type: Number, required: true, trim: true },
    review: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema);
//model will create document using above structure of document
