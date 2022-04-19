const express = require("express");
const router = express.Router();
const { authorizeURL, spotifyApi, scopes, getToken, refreshToken } = require("./spotify_authorization");

router.get("/", (req, res) => {
    res.render("index", {url:authorizeURL});
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    const response = await getToken(code);
    
    if(response.status === 200) {
        spotifyApi.setAccessToken(response.data.access_token);
        spotifyApi.setRefreshToken(response.data.refresh_token);
        res.render("findsongs");
    }
    else res.send(response);
    // Debug string for api response
    // res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
});

router.get('/refresh_token', async (req, res) => {
    const { refresh_token } = req.query;

    const response = await refreshToken(refresh_token);
    
    if(response.status === 200)
        spotifyApi.setAccessToken(response.data.access_token);
    else 
        res.send(response);
});

router.get("/query", (req, res) => {
    res.render("findsongs");
});

router.post("/submit", async (req, res) => {
    //const token = await refreshToken(spotifyApi.getRefreshToken());
 
    // example query layout... need to modify variable names in findsongs.ejs
    if(req.body.artist != null) {
        spotifyApi.searchArtists(req.body.artist)
            .then(
                data => {
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
                    res.render("songs", { artist: req.body.genre, data: data.body.categories.items });
                }, 
                err => { console.error(err); }
            );
    }
    
});

router.post("/recommend", (req, res) => {
  console.log(req.body.music)
})

router.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

module.exports = router;