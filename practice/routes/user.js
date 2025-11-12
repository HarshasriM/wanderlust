const express = require("express");
const router = express.Router();

//Users
//Index Route
router.get("/",(req,res)=>{
    res.send("GET for show route")
});

//Show user
router.get("/:id",(req,res)=>{
    res.send("GET for id route")
});

//POST -users
router.post("/:id",(req,res)=>{
    res.send("POST for the users");
});
//delete -users
router.delete("/:id",(req,res)=>{
    res.send("delete for the users");
});


module.exports = router;