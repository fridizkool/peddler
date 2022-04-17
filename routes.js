const express = require("express");
const router = express.Router();

const {variable} = require("./spotify_authorization");

router.get("/", function(req,res){
    console.log(variable);
    res.render("index", {url:variable});
});

router.get("/home", function(req,res){
    res.render("home");
});

router.get("/home/logged", function(req,res){
    res.render("home");
});

router.get("/login", function(req,res){
    res.render("login")
});

module.exports = router;