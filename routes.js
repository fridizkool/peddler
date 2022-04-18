const express = require("express");
const router = express.Router();

const { authorizeURL, spotifyApi, scopes } = require("./spotify_authorization");

router.get("/", function(req,res){
    res.render("index", {url:authorizeURL});
});

router.get("/home", function(req,res){
    res.render("home");
});

router.get("/home/logged", function(req,res){
    res.render("home");
});

router.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

router.get("/query", function(req,res){
    res.render("findsongs");
});

var {search} = require("./spotify_query");
router.post("/submit", (req, res) => {
  search("Love", []);
})

router.get('/callback', (req, res) => {
    const { code } = req.query;
    console.log(code);
    try {
        let data = await.spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        res.redirect('http://localhost:3000/home');
    } catch(err) { res.redirect('/#/error/invalid token'); }
});

module.exports = router;

    /*
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
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
        res.send('Success! You can now close the window.');
  
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
        res.send(`Error getting Tokens: ${error}`);
      });
  });
*/