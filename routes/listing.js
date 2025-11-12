const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js"); 
// const passport = require("passport")
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
//const upload = multer({ dest: 'uploads/' });

// //server side validation middlewares
// //listing
// const validateListing = (req,res,next)=>{
//     let {error}= listingSchema.validate(req.body);
//         if(error){
//             console.log(error)
//             let errMsg = error.details.map((el)=>el.message).join(",");
//             throw new ExpressError(400, errMsg);
//         }
//         else{
//             next();
//         }
// }


//index  and post request
router
    .route("/")
    .get(wrapAsync(listingController.index))
    // .post( upload.single('listing[image.url]'),(req,res)=>{
    //     res.send(req.file);
    // })
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
    
// //Index Route
// router.get("/",wrapAsync(listingController.index));

// //New Route
// router.get("/new",isLoggedIn,listingController.renderNewForm);

// //create Route
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));


// //Show Route
// router.get("/:id",wrapAsync(listingController.showListing));

// //Edit Route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// //update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

// //Delete Route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// //create route
// // app.post("/listings",wrapAsync(async (req,res,next)=>{
// //     let newListing = new Listing(req.body.listing);
// //     console.log(newListing)
// //     await newListing.save();
// //     res.redirect("/listings");
// // }));
module.exports=router;