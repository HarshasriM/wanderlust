require('dotenv').config();
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    // Listing.find({}).then((result)=>{
    //     //console.log(res);
    //     res.send(result);
    // })
    const category = req.query.category;
    let allListings;
    if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }
    //const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", } }).populate("owner"); //chaining and nested of populate
    //console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });

};


module.exports.renderNewForm = (req, res) => {
    //console.log(req.user);//when we logged in it stores user info automatically
    //isAuthenticated() --- triggers that user to check
    res.render("listings/new.ejs");
};



module.exports.createListing = async (req, res, next) => {
    //let {title,description,image,price,location,country}=req.body;
    //let listing=req.body.listing;
    //console.log(listing);
    //     throw new ExpressError(400,"Send valid data for listing"); 
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send a valid data")
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    //console.log(url,"..",filename);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    //console.log(newListing)
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing is created!")
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send a valid data")
    // }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    //console.log(typeof (req.file) !== "undefined");
    if (typeof (req.file) !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        listing.save();
    }
    listing.geometry = response.body.features[0].geometry;
    listing.save();
    req.flash("success", "Listing is updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing is deleted!")
    res.redirect("/listings")
}