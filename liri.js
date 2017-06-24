

var keys = require('./keys');
var twitter = require('Twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");
var colors = require('colors');

console.log("liri is starting...".rainbow);
//console.log("The bot is starting...");
//console.log("Keys: ", keys);

var T = new twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

var value = process.argv[2];
var query1 = process.argv[3];
var movieName2 = [];

//=======================================================================================
//Writing to a file 
function myLog(message='', log2Console=true) {
	if (log2Console) {
		console.log(message);
	}
	//write to a file
	message = message + '\n';
	fs.appendFile('log.txt', message, function(err) {
		if (err) {
    		console.log(err);
  		}
	});

}

// myLog();
// myLog('dskjfhaskjf');
// myLog('asdfas', false);


//=======================================================================================

function liriInfo() {
	//myLog("Testing......");
	console.log("========================================================================")
	console.log("LIRI is a Language Interpretation and Recognition Interface. ".bold + 
		"LIRI is a command line node app that takes in parameters and gives you back data.".bold);
	console.log("------------------------------------------------------------------------");
	console.log("liri.js can take the following commands:".italic.black.bgWhite);
	console.log("------------------------------------------------------------------------");
	console.log('my-tweets'.green.bold,  "displays your latest tweets");
	console.log('spotify-this-song'.green.bold, "followed by the song name displays track/artist/album");
	console.log('movie-this'.green.bold, "followed by movie name displays movie details...like year released, actors, plot etc...");
	console.log('do-what-it-says'.green.bold, "reads file and executes the command to give results," + 
		"specifically info about song 'I like it this way'");
	console.log("------------------------------------------------------------------------");
	console.log('LIRI'.green.bold,  "also writes command and data to a text file log.txt");
	console.log("========================================================================")
}
if(!value)
liriInfo();


//=======================================================================================

function myTweets() {

	var params = {
		q: 'jsansk',
		count: 5
	};

	T.get('search/tweets', params, gotData);

	function gotData(error, data, response) {
		//console.log(data);
		var tweets = data.statuses;
		console.log("Your recent tweets are:".bgWhite.red);
		myLog('my-tweets', false);
		for (var i=0; i<tweets.length; i++)
		{
			//console.log(tweets[i].text + ' published on '.magenta + tweets[i].created_at);
			myLog(tweets[i].text + ' published on '.magenta + tweets[i].created_at);
  		}
	}
} //end of function

//at the commandline, when user gives 3rd argument 'my-tweets'
if(value === 'my-tweets') 
	myTweets();
else
	console.log("You did not want tweets!!".america);


//=======================================================================================
var displaySpotifyResults = function (err, data){
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
 		else {
 			//var temp = 'spotify-this-song ' + query1;
 			//myLog(temp, false);
 			var songInfo = data.tracks.items;
 			for (var i = 0; i< data.tracks.items.length; i++) {
	    		myLog(">>>>>Artist: ".bold.blue + songInfo[i].artists[0].name)
	            myLog("Song Name: ".bold.blue + songInfo[i].name)
	            myLog("Album Name: ".bold.blue + songInfo[i].album.name)
	            myLog("Preview Link: ".bold.blue + songInfo[i].preview_url) 
	            myLog("===========================================================")
        	} //end-of-for loop
 		} //end of else part
	}; //end of spotify search function



function spotifyThisSong(){
	
 	//If no song is provided, "The Sign" by Ace of Base is chosen as deafult
 	if(query1) {
 		
 		spotify.search({type: 'track', query: query1}, displaySpotifyResults);
 	}
 	else {
 			query1 = 'The Sign'; 
 			spotify.search({type:'track', query: query1} ,displaySpotifyResults);	
 	}

} // end of function

//at the commandline, when user gives 3rd argument 
if(value === 'spotify-this-song') 
	spotifyThisSong();
else
	console.log("You dint request for song detials...".america);

//=======================================================================================
//OMDB API

function movieThis(){
	if(process.argv.length > 3){
		for(var i = 3; i< process.argv.length; i++)
			movieName2 += process.argv[i]+'+';
		}
	else
		movieName2 = 'Mr. Nobody';

	//console.log("Movie Name: ", movieName2);
	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName2 + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body){

		if (!error && response.statusCode === 200) {

			var temp = 'movie-this ' + movieName2;
			myLog(temp, false);

    	// Parse the body of the site and recovering the results
    		myLog("==========================================================");
	    	myLog("The movie title is:".bold.underline + JSON.parse(body).Title);
		    myLog("The movie's release date is:".bold.underline + JSON.parse(body).Released);
		    myLog("IMDB Rating is:".bold.underline + JSON.parse(body).imdbRating);
		    myLog("Country[ies]:".bold.underline+ JSON.parse(body).Country);
		    myLog("The movie Language is:".bold.underline + JSON.parse(body).Language);
		    myLog("The movie plot is:".bold.underline+ JSON.parse(body).Plot);
		    myLog("The movie actors are:".bold.underline+ JSON.parse(body).Actors);
		    myLog("The rotten tomatoes website:".bold.underline + 'https://www.rottentomatoes.com/');
		    myLog("===========================================================");
  	}
}); //end of request

}

if(value === 'movie-this')
	movieThis();
else 
	console.log("You dint ask for a movie...Maybe next time!".america);

//============================================================================================
//reading from file system

function doWhatItSays(){
	
	myLog('do-what-it-says', false);
	fs.readFile("random.txt", "utf-8", function(error, data){
		if (error)
			return console.log(error);
	
		//console.log(data);
		var dataArr = data.split(",");
		
		//console.log(dataArr);

		// for(var i=0; i<dataArr.length; i++) {
		// 	//console.log(dataArr[i]);
		// 	process.argv[3] = dataArr[i];
		// 	process.argv[4] = dataArr[++i];
		// }
		if(dataArr[0] === 'spotify-this-song') {
			query1 = dataArr[1];
			//console.log(query1);
			spotifyThisSong();
		}

	}); //end of read file
}

//if user gives 3rd commandline argument as 'do-what-it-says'
if(value === 'do-what-it-says')
	doWhatItSays();
else
	console.log("You did not request 'do-what-it-says'".america);

//=======================================================================================

