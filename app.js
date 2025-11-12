if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
//After deployment stage is known as production

//console.log(process.env);
//console.log(process.env.SECRET);

const express=require("express");
const app  = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride  = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

//mongo connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
const sessionOptions ={
    secret :"mysupersecertcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true, //used to prevent cross scripting
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//storing info of user when he logeed in
passport.deserializeUser(User.deserializeUser());//unstoring info of user when he logged out

//Home Route
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//   let newUser =  await User.register(fakeUser,"helloworld");
//   res.send(newUser);
// })



//listing
app.use("/listings",listingRouter);
//review
app.use("/listings/:id/reviews",reviewRouter);
//this id still in app.js doen't go to review.js
//user
app.use("/",userRouter);


//if our request is not match with any route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})
//custom middleware
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{err})
    //res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("server is listeninig to port 8080");
})




// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

