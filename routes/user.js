const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate("local" ,{failureRedirect:"/login",failureFlash:true}), userController.login);

//logut route
router.get("/logout",userController.logout);


// //rendersignupform route
// router.get("/signup",userController.renderSignupForm);
// //post signup route
// router.post("/signup",wrapAsync(userController.signup));
// //renderloginform route
// router.get("/login",userController.renderLoginForm);
// //post loginform route
// router.post("/login",saveRedirectUrl,passport.authenticate("local" ,{failureRedirect:"/login",failureFlash:true}), userController.login);
// //logout Route
// router.get("/logout",userController.logout);

module.exports = router;