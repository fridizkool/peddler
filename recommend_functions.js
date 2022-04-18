const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function songRec(artist, songs) {
    console.log(songs);
    console.log(artist);
};

async function similarSongs(song) {

};

module.exports = {songRec};