const SpotifyWebApi = require("spotify-web-api-node");

const {spotifyApi, authorizeURL} = require("./spotify_authorization");

function search(artist = null, genre = [])
{
  var info = "";
  //console.log(authorizeURL);
  spotifyApi.searchTracks('artist:'+artist).then(
      function(data) {
        info = data.body.tracks.items;
        console.log(info);
      },
      function(err) {
        console.log('Something went wrong!', err);
      }
    );
    return info;
}

exports.search = search;