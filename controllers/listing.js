const Listing = require('../models/listing');
const { listingschema } = require("../schema.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.newListing = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    const id = req.params.id;
    const info = await Listing.findById(id)
        .populate({
            path : "review", 
            populate : {
                path : "author"}})
        .populate("owner");
    if(!info) {
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }
    console.log(info);
    res.render("./listings/show.ejs",{info});
}

module.exports.createListing = async (req, res) => {
    let result = listingschema.validate(req.body);
    if (result.error) {
        console.log(result.error.message);
        throw new ExpressError(400, result.error.message);
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id; // Set the owner to the logged-in user
    await newListing.save();
    console.log("created new listing");
    req.flash("success","New listing created successfully!");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }
    console.log("editing");
    res.render("./listings/edit.ejs",{listing});
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Update the listing with the form data (using nested "listing" object from req.body)
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // If a new image file is uploaded, update the image details
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");

    console.log(listing);
    console.log("edited");

    // Redirect to the updated listing page
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req,res)=>{
    const id = req.params.id;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    console.log("deleted");
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};
