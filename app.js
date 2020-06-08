var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var request = require("request");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("search");
})

app.get("/results", function(req, res){
    var searchTerm = req.query.searchTerm;
    if(searchTerm === "" || searchTerm === undefined){
        res.render("movies-not-found");
    }
    var url = "https://omdbapi.com/?s=" + searchTerm + "&apikey=thewdb";
	request(url, function(error, response, body){
        if(error){
            console.log(error);
        }
        if(response.statusCode == 404){
            console.log("No films with that name");
            res.render("movies-not-found");
        }
		if(!error && response.statusCode == 200){
			var movieData = JSON.parse(body);
			res.render("results", {movieData:movieData, searchTerm:searchTerm});
		}
	})
})

app.get("*", function(req, res){
    res.render("movies-not-found");
})

app.listen(3000, function(){
	console.log("server started - film search app running");
})
