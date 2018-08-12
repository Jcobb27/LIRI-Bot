//Read and set environmental variables
require("dotenv").config();

//Import the twitter NPM package
var Twitter = require("twitter");

//Import the node-spotify-api NPM package
var Spotify = require("node-spotify-api");

//Import the API keys
var keys = require("./keys");

//Import the request NPM package
var request = require("request");

//Import FS package for read/write
var fs = require("fs");


// The first argument will be the action 
var action = process.argv[2];

//Create an empty variable for holding the song name
var songName = "";

// Store all of the arguments in an array
var nodeArgs = process.argv;

//if action = my-tweets, call the twitter API
if (action === "my-tweets") {
    var client = new Twitter(keys.twitter);
    var params = { screen_name: 'Jenn70612121', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at + " " + tweets[i].text);
            }
        }
    });
}

//if action = spotify-this-song, call the spotify API
if (action === "spotify-this-song") {
    
    // Loop through all the words in the node argument
    // And do a for-loop to handle putting song names in a string
    for (var j = 3; j < nodeArgs.length; j++) {

        if (j > 3 && j < nodeArgs.length) {

            songName = songName + " " + nodeArgs[j];

        }

        else {

            songName += nodeArgs[j];

        }
    }
    console.log (songName);

    //get the info from spotify
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

