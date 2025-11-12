const express = require("express");
const app = express();
const users = require("./routes/user");
const posts = require("./routes/posts");
const cookieParser = require("cookie-parser");


// //app.use(cookieParser());
// //for signed cookies we should pass secret code
// app.use(cookieParser("secret code"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("send cookie");
// });

// app.get("/verify" ,(req,res)=>{
//     //console.log(req.cookies);  -- general cookies are accessed
//     console.log(req.signedCookies); //signed cookies are accessed
//     res.send("verified");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("sent you some cookie");
// });

// app.get("/usecookies",(req,res)=>{
//     let {greet="anonymous"} = req.cookies;
//     res.send(`Hi ${greet}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("HI,I am root!");
// });


// app.use("/users",users);//we keep common route among all user routes--/users is common
// app.use("/posts",posts);//we keep common route among all post routes--/posts is common

const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const sessionOptions = { secret: "mysupersecretcode", resave: false, saveUninitialized: true };

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

//storing session Info
app.get('/register', (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    //res.send(name);
    if (name === "anonymous") {
        req.flash("error", "user is not registered");
    }
    else {

        req.flash("success", "user is registered");
    }

    res.redirect("/hello");
})
//using session Info
app.get("/hello", (req, res) => {
    // res.send(`hello ${req.session.name}` )
    //let name = req.session.name;
    //res.render("flash.ejs",{name});
    //better usage locals is not below like this we can use middleware
    //    res.locals.success = req.flash("success");
    //    res.locals.error = req.flash("error");
    res.render("flash.ejs", { name: req.session.name });
    //res.render("flash.ejs" ,{name : req.session.name , msg:req.flash("success")});
})
app.get("/reqcount", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    }
    else {
        req.session.count = 1;
    }

    res.send(`You sent a request ${req.session.count} times`)
});

app.get("/sessionroute", (req, res) => {
    res.send("success");
})

app.listen(3000, () => {
    console.log("server is listening to the port 3000")
})