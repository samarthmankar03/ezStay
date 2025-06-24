const express = require("express");
const router = express.Router({mergeParams:true}); // Importing the router
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { listingschema } = require("../schema.js");
const { isLoggedIn }= require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const validateListing = (req,res,next) => {
    let {error} = listingschema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

const listingController = require("../controllers/listing.js");

// new route
router.get("/new",isLoggedIn,listingController.newListing);

router
    .route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)) 
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // show route
    .patch(
        isLoggedIn,
        upload.single("listing[image]"),
        // validateListing,
        wrapAsync(listingController.updateListing)) // update route
    .delete(isLoggedIn,wrapAsync(listingController.deleteListing)) // delete route


// edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));



module.exports = router;
