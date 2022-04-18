const express = require("express");
//const { spotifyApi, secrets } = require("./spotify_authorization");

/*
const getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(secrets.clientId + ':' + secrets.clientSecret).toString('base64'))
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}
*/

//spotifyApi.setAccessToken(getToken);

async function findArtist(spotifyApi, artist) {
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

exports.findArtist = findArtist;