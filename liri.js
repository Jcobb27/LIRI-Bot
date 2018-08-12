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

//Create empty variables for holding the song name and movie name
var songName = "";
var movieName = "";

// Store all of the arguments in an array
var nodeArgs = process.argv;

//if action = my-tweets, call the twitter function
if (action === "my-tweets") {
    myTweets();
}

//function to call twitter api
function myTweets() {
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

//if action = spotify-this-song, call the spotify function
if (action === "spotify-this-song") {

    //if user doesn't put in a song, use The Sign
    if (nodeArgs.length < 4) {
        songName = "The Sign";
    }

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
    spotify(songName);
}

//function to call spotify API
function spotify(song) {
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

//If action = movie-this then call movie function
if (action === "movie-this") {

    //if user doesn't put in a movie, use Mr. Nobody
    if (nodeArgs.length < 4) {
        movieName = "Mr." + "Nobody";
    }

    // Loop through all the words in the node argument
    // And do a for-loop to handle concatanating movie name
    for (var j = 3; j < nodeArgs.length; j++) {

        if (j > 3 && j < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[j];
        }

        else {
            movieName += nodeArgs[j];
        }
    }
    console.log("Movie name test: " + movieName);
    movie(movieName);
}

//Movie Function
function movie(movieTitle) {
    //run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover speicific data
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

//if action = do-what-it-says, use random.txt to call command
if (action === "do-what-it-says") {
    // This block of code will read from the "random.txt" file.
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        // The switch-case will direct which function gets run.
        switch (dataArr[0]) {
            case "my-tweets":
                myTweets();
                break;

            case "spotify-this-song":
                spotify(dataArr[1]);
                break;

            case "movie-this":
                movie(dataArr[1]);
                break;
        }
    });

}   