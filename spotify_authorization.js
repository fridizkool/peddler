require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");

const dataMap = {
    clientId:           process.env.CLIENT_ID,
    clientSecret:       process.env.CLIENT_SECRET,
    redirectUri:        process.env.REDIRECTURI,
    clientRedirectUri:  process.env.CLIENT_REDIRECTURI,
    accessToken:        process.env.ACCESS_TOKEN,
    state:              'default',
    scopes:             ['ugc-image-upload', 'user-modify-playback-state', 'user-read-playback-state',
                         'user-read-currently-playing', 'user-follow-modify', 'user-follow-read',
                         'user-read-recently-played', 'user-read-playback-position', 'user-top-read',
                         'playlist-read-collaborative', 'playlist-modify-public', 'playlist-read-private',
                         'playlist-modify-private', 'app-remote-control', 'streaming', 'user-read-email',
                         'user-read-private', 'user-library-modify', 'user-library-read']
};

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
let spotifyApi = new SpotifyWebApi({
    clientId:       dataMap.clientId,
    clientSecret:   dataMap.clientSecret,
    redirectUri:    dataMap.redirectUri
});

/*
spotifyApi
    .authorizationCodeGrant(dataMap.accessToken)
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    });

spotifyApi
    .refreshAccessToken()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    });
*/

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(dataMap.scopes, dataMap.state);

exports.authorizeURL = authorizeURL;
exports.spotifyApi = spotifyApi;
exports.scopes = dataMap.scopes;