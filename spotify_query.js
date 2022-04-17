const SpotifyWebApi = require("spotify-web-api-node");

const {spotifyApi} = require("./spotify_authorization");

spotifyApi.searchTracks('artist:Love').then(
    function(data) {
      console.log(data.body);
    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );