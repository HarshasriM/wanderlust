const express = require("express");
const router = express.Router();


//Posts
//Index Route
router.get("/posts",(req,res)=>{
    res.send("GET for show route")
});

//Show 
router.get("/:id",(req,res)=>{
    res.send("GET for id route")
});

//POST
router.post("/",(req,res)=>{
    res.send("POST for the posts");
});
//delete 
router.delete("/:id",(req,res)=>{
    res.send("delete for the posts");
});


module.exports = router;