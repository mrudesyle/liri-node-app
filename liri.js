//add code to read and set any environment variables with the dotenv package
require('dotenv').config();

//declare variables to set references to our other .js files and npm packages
var request = require('request');
var keys = require('./keys');
var twitter = require('Twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

//user input/output variables
var command = process.argv[2];
var param = process.argv[3];
var output;

//create a twitter function to return tweets
function tweetMeUp() {
    var twitterKeys = new twitter(keys.twitterKeys);
    //declare variables to set screen name & number of reults to return
    var formalArguments = {
        screen_name: 'MaRu',
        count: 20
    };

    twitterKeys.get('statuses/user_timeline', formalArguments, function (error, tweets, response) {
        if (!error) {
            //declare empty array to push results into to wrtie to a log and console log
            var arr = [];
            for (var t = 0; t < tweets.length; t++) {
                arr.push({
                    'created at: ': tweets[t].created_at,
                    'Tweets: ': tweets[t].text,
                });
            }
        } else {
            console.log("Dang....Orange Cheeto broke twitter!!");
        }
        console.log(arr);
        writeLog(arr);
    });
}

//create spotify function
function spotifyMeUp(param) {
    if (param === undefined) {
        param = 'The Sign Ace of Base';
    }
    //needed to add this spotify parameter here b/c 
    //the keys from the .env file were not loading
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });
    spotify.search({ type: 'track', query: param }, function (error, data) {
        var getSong;
        //verify that there are no errors and there are results returned from the query
        //otherwise, console log a message in the else block
        if (!error && (data.tracks.items.length >= 1)) {
            getSong = data.tracks.items[0];
            var artistConcat = getSong.artists[0].name;
            for (var a = 1; a < getSong.artists.length; a++) {
                artistConcat += ', ' + getSong.artists[a].name;
            }
            consoleOutput = ('\nSong Info \n\nArtist: ' + artistConcat + '\n\nSong Title: ' + getSong.name + '\n\nOriginal Album: ' + getSong.album.name + '\n\nPreview: ' + getSong.preview_url + '\n');
            console.log(consoleOutput);
            logOutput = ('Song Info: Artist: ' + artistConcat + ' --> Song Title: ' + getSong.name + ' --> Original Album: ' + getSong.album.name + ' --> Preview: ' + getSong.preview_url);
            writeLog(logOutput);

        } else {
            console.log('Damn - no song found or the orange cheetoe in charge broke Spotify! Try again.');
        }
    });
}

//create omdb function
function movieMeUp(param) { 
    //if nothing is passed in from user input, set a default movie to return
    if (param === undefined) {
        param = 'Mr Nobody';
    }
    var queryString = 'http://www.omdbapi.com/?t=' + param + '&y=&plot=short&apikey=trilogy';

    request(queryString, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            output = ('\nMovie Info \n\nTitle: ' + JSON.parse(body)['Title'] + '\n\nRelease Date: ' + JSON.parse(body)['Released'] + '\n\nIMDB Rating: ' + JSON.parse(body)['imdbRating'] + '\n\nProduction Country: ' + JSON.parse(body)['Country'] + '\n\nLanguage: ' + JSON.parse(body)['Language'] + '\n\nSynopsis: ' + JSON.parse(body)['Plot'] + '\n\nActors: ' + JSON.parse(body)['Actors'] + '\n\nRotten Tomatoes Rating: ' + JSON.parse(body)['tomatoRating'] + '\n\nLearn more at Rotten Tomatoes: ' + JSON.parse(body)['tomatoURL'] + '\n');
            logOutput = ('Movie Info: Title: ' + JSON.parse(body)['Title'] + '  -->  Release Date: ' + JSON.parse(body)['Released'] + '  --> IMDB Rating: ' + JSON.parse(body)['imdbRating'] + '  --> Production Country: ' + JSON.parse(body)['Country'] + '  -->  Language: ' + JSON.parse(body)['Language'] + '  --> Synopsis: ' + JSON.parse(body)['Plot'] + '  -->  Actors: ' + JSON.parse(body)['Actors'] + '  -->  Rotten Tomatoes Rating: ' + JSON.parse(body)['tomatoRating'] + '  -->  Learn more at Rotten Tomatoes: ' + JSON.parse(body)['tomatoURL']);
            if (param == 'Mr Nobody') {
                console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
                console.log(output);
                writeLog(logOutput);
            } else {
                console.log(output);
                writeLog(logOutput);
            }
        }
    });
}

//create function to read from random.txt file
function whatever() {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var liriInput = data.split(',');
        var liriRequest = liriInput[0];
        var liriParam = liriInput[1];

        switch (liriRequest) {
            case "my-tweets":
                tweetMeUp();
                break;
            case "spotify-this-song":
                param = liriParam;
                spotifyMeUp();
                break;
            case "movie-this":
                param = liriParam;
                movieMeUp();
                break;
        }
    });
}

//Main function that is executed at runtime
function beamMeUp() {
    switch (command) {
        case 'my-tweets':
            tweetMeUp();
            break;
        case 'spotify-this-song':
            spotifyMeUp(param);
            break;
        case 'movie-this':
            movieMeUp(param);
            break;
        case 'do-what-it-says':
            whatever();
            break;
        default:
            console.log("Dammit Jim, the orange cheetoe broke this thing. Try again!!");
    }

}

//function to write data to log file
var writeLog = function (data) {
    fs.appendFile("log.txt", '\r\n\r\n');

    fs.appendFile("log.txt", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Log file was updated!");
    });
}

//run this thing!
beamMeUp();