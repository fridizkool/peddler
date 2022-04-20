// dependencies
const express = require("express");
const router = express.Router();
const { authorizeURL, spotifyApi, scopes, getToken, refreshToken } = require("./spotify_authorization");

router.get("/", (req, res) => {
    res.render("index", { url: authorizeURL });
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/query", (req, res) => {
    res.render("findsongs");
});

router.post("/recommend", (req, res) => {
    console.log(req.body.music)
});

// get login authorization from api
router.get('/login', (req, res) => {
      res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// handle callback from api; authenticate
router.get("/callback", async (req, res) => {
    // get code from query
    const code = req.query.code || null;

    // request a token
    const response = await getToken(code);
    
    // handle response; on success, set tokens
    if(response.status === 200) {
        spotifyApi.setAccessToken(response.data.access_token);
        spotifyApi.setRefreshToken(response.data.refresh_token);
        res.render("findsongs");
    }
    else res.send(response);
    // Debug string for api response
    // res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
});

// refresh token (POST api); not used yet
router.get("/refresh_token", async (req, res) => {
    // get code from query
    const { refresh_token } = req.query;

    //request a token
    const response = await refreshToken(refresh_token);
    
    // handle response; on success, set token
    if(response.status === 200)
        spotifyApi.setAccessToken(response.data.access_token);
    else 
        res.send(response);
});

// event listener for button in query.js; search functionality
//router.post("/submit", async (req, res) => {
    /*
    // example query layout... need to modify variable names in findsongs.ejs
    if(req.body.artist != null) {
        spotifyApi.searchArtists(req.body.artist)
            .then(
                data => {
                    // future improvement: replace artist with generic
                    res.render("songs", { artist: req.body.artist, data: data.body.artists.items })
                }, 
                err => { console.error(err); }
            );
    }

    // kinda janky not sure why
    if(req.body.genre != null) {
        spotifyApi.getCategories(req.body.genre)
            .then(
                data => {
                    // future improvement: replace artist with generic
                    res.render("songs", { artist: req.body.genre, data: data.body.categories.items });
                }, 
                err => { console.error(err); }
            );
    }
    */

router.post("/recommend", async(req, res) => {
  var artist = req.body.artist;
  var songs = req.body.music;
  if(typeof songs == 'undefined') {
    console.log("No Songs Selected!");
  }
  else {
    let recList = await recFunctions.songRec(artist, songs);
    res.render("rec_songs", {artist:artist, data:recList});
  }
})

// exports
module.exports = router;