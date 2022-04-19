const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function songRec(artist, songs) {
    findArtist(artist, function(response){
        var artistId = response.id;
        similarArtists(artistId, function(artistList) {
            preliminaryList(artistList, function(songList) {
                console.log(songList);
            });
        });
    });
};

async function preliminaryList(similarArtists, callback) {
    var songList = [];
    similarArtists.forEach(function(item) {
        var currentGenres = item.genres;
        spotifyApi.getArtistTopTracks(item.id, 'GB')
        .then(function(data) {
            data.body.tracks.forEach(function(item) {
                var song = {id: item.id, name: item.name, genres: currentGenres, popularity: item.popularity};
                songList.push(song);
            });
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    });
    return callback(songList);
};

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