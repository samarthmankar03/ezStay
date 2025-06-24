const express = require("express");
const router = express.Router({mergeParams:true}); // Importing the router
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { addReview, deleteReview } = require("../controllers/review.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

// Review
// Review Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(addReview));

// Review Delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(deleteReview));

module.exports = router ;