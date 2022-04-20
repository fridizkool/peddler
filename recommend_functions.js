const { resolveInclude } = require("ejs");
const express = require("express");
const { spotifyApi } = require("./spotify_authorization");
const distance = require('euclidean-distance');

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

    //retrieve audio profile of user selected songs
    let songAnalyses = await audioProfile(songIds);
    songAnalyses = songAnalyses.audio_features;

    //average song profiles together
    //use a master profile that will be used to weight the songs later
    let masterProfile = {
        danceability: 0,
        energy: 0,
        key: 0,
        loudness: 0,
        mode: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0
    }
    //console.log(songAnalyses[0].danceability);
    for (let i = 0; i < songAnalyses.length; i++) {
        masterProfile.danceability += songAnalyses[i].danceability;
        masterProfile.energy += songAnalyses[i].energy;
        masterProfile.key += songAnalyses[i].key;
        masterProfile.loudness += songAnalyses[i].loudness;
        masterProfile.mode += songAnalyses[i].mode;
        masterProfile.speechiness += songAnalyses[i].speechiness;
        masterProfile.acousticness += songAnalyses[i].acousticness;
        masterProfile.instrumentalness += songAnalyses[i].instrumentalness;
        masterProfile.liveness += songAnalyses[i].liveness;
        masterProfile.valence += songAnalyses[i].valence;
        masterProfile.tempo += songAnalyses[i].tempo;
    };
    for (let property in masterProfile) {
        masterProfile[property] = masterProfile[property] / songAnalyses.length;
    }

    //search for artist name to get id and other artist information
    let origArtist = await findArtist(artist);
    let artistId = origArtist.id;

    let artistList = await similarArtists(artistId);

    let songList = await preliminaryList(artistList, origArtist);

    songList = await calcWeight(songList, masterProfile);

    //sort song list based on which songs have the lowest weights
    songList.sort((a,b) => (a.weight > b.weight) ? 1 : -1);

    //minimize song list by grabbing only songs with similar genre tags
    minSongList = [];
    let count = 0;
    for (let i = 0; i < songList.length; i++) {
        if (songList[i].sameGenreCount === origArtist.genres.length) {
            minSongList[count] = songList[i];
            count++;
        }
    }

    let sumPop = 0;
    for (let i = 0; i < minSongList.length; i++) {
        sumPop += minSongList[i].popularity;
    }
    let avePop = sumPop / minSongList.length;

    let evenMinerList = [];
    count = 0;
    for (let i = 0; i < minSongList.length; i++) {
        if(minSongList[i].popularity > avePop) {
            evenMinerList[count] = minSongList[i];
            count++;
        }
    }

    let finalList = evenMinerList.slice(0,30);

    return finalList;
};


async function preliminaryList(similarArtists, origArtist) {
    let songList = [];
    for (let i = 0; i < similarArtists.length; i++) {
        let topTracks = await getTopSongs(similarArtists[i].id);
        
        for (let j = 0; j < topTracks.length; j++) {
            let song = {
                artist: similarArtists[i].name,
                preview_url: topTracks[j].preview_url,
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
    //return callback(songList);
    return songList;
}

async function calcWeight(songList, masterProfile) {
    for (let i = 0; i < songList.length; i++) {
        let songProfile = await audioProfile([songList[i].id]);
        songList[i]['weight'] = await calcDistance(songProfile.audio_features[0], masterProfile);
    }
    return songList;
};

async function calcDistance(songProfile, masterProfile) {
    songList = [];
    masterList = [];
    for (let prop in masterProfile) {
        masterList.push(masterProfile[prop]);
        songList.push(songProfile[prop]);
    }
    return distance(songList, masterList);
}

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

async function findArtist(artist) {
    return await spotifyApi.searchArtists(artist)
    .then(function(data) {
        for (let i = 0; i < data.body.artists.items.length; i++) {
            if(data.body.artists.items[i].name.toLowerCase() === artist.toLowerCase()) {
                return data.body.artists.items[i];
            }
        }
    }, function(err) {
        console.log(err);
    });
};

async function similarArtists(artist) {
    return await spotifyApi.getArtistRelatedArtists(artist)
    .then(function(data){
        return data.body.artists;
    }, function(err) {
        console.log(err);
    });
}

async function audioProfile(songIds) {
    return await spotifyApi.getAudioFeaturesForTracks(songIds) 
    .then(function(data) {
        return data.body;
    }, function(err) {
        console.log(err);
    })
}

module.exports = {songRec};