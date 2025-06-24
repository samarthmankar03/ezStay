const Listing = require('../models/listing');
const review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");

module.exports.addReview = async (req,res) =>{
    let result = reviewSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        console.log(result.error.message);
        throw new ExpressError(400, result.error.message);
    }

    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id; // Set the author to the logged-in user

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}