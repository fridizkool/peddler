const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function findArtist(artist) {
    try {
        await spotifyApi
            .searchArtists(artist)
            .then(
                data => console.log(
                    'Search artists for ' + artist, data.body
                )
            );
    } catch(err) { console.error(err); }
};

async function findSong(song) {

};

async function findAlbum(album) {

};

async function findPlaylist(playlist) {

};

async function getDiscography(options) {

};

module.exports = {findArtist};