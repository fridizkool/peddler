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

router.get("/query", function(req,res){
    res.render("findsongs");
});

var {search} = require("./spotify_query");
router.post("/submit", (req, res) => {
  search("Love");
})

module.exports = router;