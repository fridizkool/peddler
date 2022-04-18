const express = require("express");
const router = express.Router();
const spotFunctions = require("./spotify_functions");
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

router.post("/submit", (req, res) => {
    // maybe refresh token here?

    spotifyApi.getMe().then(data => { console.log(data.statusCode); });

    /*
    spotifyApi.searchTracks('artist:' + req.body.artist)
        .then(data => {
            console.log('Search for ' + req.body.artist, data.body);
        },
        err => {
            console.error(err);
        });
    */
});

router.post("/recommend", (req, res) => {
  console.log(req.body.music)
})

// currently unused
router.get("/home/logged", (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
    }
    else{
      spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
          const access_token = data.body['access_token'];
          const refresh_token = data.body['refresh_token'];
          const expires_in = data.body['expires_in'];
    
          spotifyApi.setAccessToken(access_token);
          spotifyApi.setRefreshToken(refresh_token);
    
          console.log('access_token:', access_token);
          console.log('refresh_token:', refresh_token);
    
          console.log(
            `Sucessfully retreived access token. Expires in ${expires_in} s.`
          );
    
          setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const access_token = data.body['access_token'];
    
            console.log('The access token has been refreshed!');
            console.log('access_token:', access_token);
            spotifyApi.setAccessToken(access_token);
          }, expires_in / 2 * 1000);
        })
        .catch(error => {
          console.error('Error getting Tokens:', error);
        });
      }
    res.render("home");
});

router.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

module.exports = router;