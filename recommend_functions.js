const { resolveInclude } = require("ejs");
const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function songRec(artist, songs) {
    console.log('here');
    await findArtist(artist, async function(response){
        let artistId = response.id;
        await similarArtists(artistId, async function(artistList) {
            let songList = await preliminaryList(artistList)
            songList.forEach(e => {
                console.log(e);
            });
            console.log(songList.length + ' ' + songList[0] + ' ' + songList[songList.length-1]);
        });
    });
};

const preliminaryList = async (similarArtists) => {
    //let songList = [];

    similarArtists.forEach(async function(item) {

        let currentGenres = item.genres;
        
        const list = await getTopSongs(item.id, async function(topTracks) {
            let songList = [];
            topTracks.forEach(async function(item) {
                
                const song = {
                    id: item.id, 
                    name: item.name, 
                    genres: currentGenres, 
                    popularity: item.popularity
                }

                //console.log(song);
                songList.push(song);
                //console.log(songList[0]);

            });
            return songList;
        });
    });
    console.log(list[0]);
};

async function getTopSongs(artist, callback) {
    spotifyApi.getArtistTopTracks(artist, 'GB')
    .then(function(data) {
        return callback(data.body.tracks);
    }, function(err) {
        console.log('Something went wrong!', err);
    });
}

/*async function preliminaryList(similarArtists, callback) {
    let songList = [];
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