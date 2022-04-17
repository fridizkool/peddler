const SpotifyWebApi = require("spotify-web-api-node");

var scopes = ['user-read-private', 'user-read-email'],
  redirectUri = 'http://localhost:3000/home/logged',
  clientId = '7282a035744b40b9a890e04cf8a1fb9e',
  clientSecret = '25710fcec0c540c3be3c8bf79b99a606',
  state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId
});

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

exports.authorizeURL = authorizeURL;
exports.spotifyApi = spotifyApi;