const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        required : true,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
});

const review = mongoose.model("review",reviewSchema);

module.exports = review;