const express = require("express");
const router = express.Router();

const {authorizeURL} = require("./spotify_authorization");

router.get("/", function(req,res){
    res.render("index", {url:authorizeURL});
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