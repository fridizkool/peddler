const { resolveInclude } = require("ejs");
const express = require("express");
const { spotifyApi } = require("./spotify_authorization");

async function songRec(artist, songs) {

    //retrieves song ids for user selected music
    let songIds = [];
    for (let i = 0; i < songs.length; i++) {
        let songGarbage = await findSong(songs[i]);
        let tracks = songGarbage.tracks.items;
        for (let j = 0; j < tracks.length; j++) {
            if (songs[i] === tracks[j].name) {
                //console.log(songGarbage.tracks.items[j].name);
                songIds.push(tracks[j].id);
                break;
            }
        }
    }
    //console.log(songIds);

    await findArtist(artist, async function(response){

        origArtist = response;
        artistId = response.id;
        await similarArtists(artistId, origArtist, async function(artistList) {

            await preliminaryList(artistList.artists, artistList.original, async function(songList) {

                await calcWeight(songList, function(weightedSongs) {
                    //console.log(this.artistInfo);
                });
            });
        });
    });
};

async function getSongInfo(songs, callback) {
    
}

async function preliminaryList(similarArtists, origArtist, callback) {
    let songList = [];
    for (let i = 0; i < similarArtists.length; i++) {
        let topTracks = await getTopSongs(similarArtists[i].id);
        
        for (let j = 0; j < topTracks.length; j++) {
            let song = {
                id: topTracks[j].id,
                name: topTracks[j].name,
                genres: similarArtists[i].genres,
                popularity: topTracks[j].popularity
            }
            sameGenreCount = 0;
            for (let k = 0; k < origArtist.genres.length; k++) {
                for (let l = 0; l < song.genres.length; l++) {
                    if (origArtist.genres[k] === song.genres[l]) {
                        sameGenreCount++;
                    }
                }
            }
            song['sameGenreCount'] = sameGenreCount;
            songList.push(song);
        }
    }
    return callback(songList);
}

async function calcWeight(songList) {
    for (let i = 0; i < songList.length; i++) {
        var weight = 0;


        //placeholder
        songList['weight'] = 0;
    }
};

async function getTopSongs(artist) {
    return spotifyApi.getArtistTopTracks(artist, 'GB')
    .then(function(data) {
        return data.body.tracks;
    }, function(err) {
        console.log('Something went wrong!', err);
    });
}

async function findSong(songName) {
    return spotifyApi.searchTracks(songName)
    .then(function(data) {
        return data.body;
    }, function(err) {
        console.log('Something went wrong!', err);
    });
}

async function findArtist(artist, callback) {
    return spotifyApi.searchArtists(artist)
    .then(async function(data) {
        return await data.body.artists.items.forEach(async function(item) {
            if(item.name.toLowerCase() === artist.toLowerCase()) {
                return callback(item);
            }
        })
    }, function(err) {
        console.log(err);
    });
};

async function similarArtists(artist, origArtist, callback) {
    return await spotifyApi.getArtistRelatedArtists(artist)
    .then(function(data){
        let res = {
            artists: data.body.artists,
            original: origArtist
        }
        return callback(res);
    }, function(err) {
        console.log(err);
    });
}

async function audioProfile(songId, callback) {
    await spotifyApi.getAudioFeaturesForTracks(songIds) 
    .then(function(data) {
        console.log(data.body);
        return callback(data.body);
    }, function(err) {
        console.log(err);
    })
}

module.exports = {songRec};