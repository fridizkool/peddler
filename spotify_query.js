const SpotifyWebApi = require("spotify-web-api-node");

const {spotifyApi} = require("./spotify_authorization");

function search(artist = null, genre = [])
{
  spotifyApi.searchTracks('artist:'+artist).then(
      function(data) {
        console.log(data.body);
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );
}

exports.search = search;