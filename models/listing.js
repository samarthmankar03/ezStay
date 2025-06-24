const mongoose = require("mongoose");
const { listingschema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        url : String,
        filename : String,
    },
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required:true,
    },
    country : {
        type : String,
        required:true,
    },
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.review}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;