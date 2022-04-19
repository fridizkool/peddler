// dependencies
require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const axios = require('axios');
const qs = require('qs');

// secrets map
const dataMap = {
    port:               process.env.PORT,
    clientId:           process.env.CLIENT_ID,
    clientSecret:       process.env.CLIENT_SECRET,
    redirectUri:        process.env.REDIRECTURI,
    clientRedirectUri:  process.env.CLIENT_REDIRECTURI,
    state:              'default',
    scopes:             ['ugc-image-upload', 'user-modify-playback-state', 'user-read-playback-state',
                         'user-read-currently-playing', 'user-follow-modify', 'user-follow-read',
                         'user-read-recently-played', 'user-read-playback-position', 'user-top-read',
                         'playlist-read-collaborative', 'playlist-modify-public', 'playlist-read-private',
                         'playlist-modify-private', 'app-remote-control', 'streaming', 'user-read-email',
                         'user-read-private', 'user-library-modify', 'user-library-read']
};

// set credentials for api
let spotifyApi = new SpotifyWebApi({
    clientId:       dataMap.clientId,
    clientSecret:   dataMap.clientSecret,
    redirectUri:    dataMap.redirectUri
});

// authorization url
const authorizeURL = spotifyApi.createAuthorizeURL(dataMap.scopes, dataMap.state);

// retrieve access token
const getToken = async (authCode) => {
    try {
        const token = Buffer.from(`${dataMap.clientId}:${dataMap.clientSecret}`, 'utf-8').toString('base64');
        const data = qs.stringify({
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: dataMap.redirectUri
        });
        return await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${token}`
            }
        });
    } catch(err) { console.error(err); }
}

// refresh access token
const refreshToken = async (authCode) => {
    try {
        const token = Buffer.from(`${dataMap.clientId}:${dataMap.clientSecret}`, 'utf-8').toString('base64');
        const data = qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: authCode
        });
        return await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${token}`
            }
        });
    } catch(err) { console.error(err); }
}

// exports
exports.authorizeURL = authorizeURL;
exports.spotifyApi = spotifyApi;
exports.scopes = dataMap.scopes;
exports.secrets = dataMap;
exports.getToken = getToken;
exports.refreshToken = refreshToken;