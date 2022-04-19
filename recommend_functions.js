const { resolveInclude } = require("ejs");
const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function songRec(artist, songs) {
    findArtist(artist, function(response){
        var artistId = response.id;
        similarArtists(artistId, function(artistList) {
            var songList = await preliminaryList(artistList)
            console.log(songList);
        });
    });
};

const preliminaryList = function(similarArtists) {
    var songList = [];
    similarArtists.forEach(function(item) {
        var currentGenres = item.genres;
        getTopSongs(item.id, function(topTracks) {
            topTracks.forEach(function(item) {
                const song = {
                    id: item.id, 
                    name: item.name, 
                    genres: currentGenres, 
                    popularity: item.popularity}
                songList.push(song);
            }
        )});
    });
    return songList;
};

function getTopSongs(artist, callback) {
    spotifyApi.getArtistTopTracks(artist, 'GB')
    .then(function(data) {
        return callback(data.body.tracks);
    }, function(err) {
        console.log('Something went wrong!', err);
    });
}

/*async function preliminaryList(similarArtists, callback) {
    var songList = [];
    similarArtists.forEach()
}*/

async function calcWeight(songList) {
    console.log(songList);
};

async function findArtist(artist, callback) {
    spotifyApi.searchArtists(artist)
    .then(function(data) {
        data.body.artists.items.forEach(function(item) {
            if(item.name.toLowerCase() === artist.toLowerCase()) {
                return callback(item);
            }
        })
    }, function(err) {
        console.log(err);
    });
};

async function similarArtists(artist, callback) {
    spotifyApi.getArtistRelatedArtists(artist)
    .then(function(data){
        return callback(data.body.artists);
    }, function(err) {
        console.log(err);
    });
}

module.exports = {songRec};