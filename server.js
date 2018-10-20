// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Pulling our Note and Article.js models
var Note = require("./models/note.js");
var Article = require("./models/article.js");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Handlebars.
var exphbs = require("express-handlebars");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

const PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

//Using morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));


// Serve static content
app.use(express.static("public"));

//Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/scraper_controller.js");

app.use("/", routes);

mongoose.connect(  
	process.env.MONGODB_URI || "mongodb://heroku_q5pkxkl1:smpei6n9m46kg@ds137263.mlab.com:37263/heroku_q5pkxkl1",
  {
    useMongoClient: true
  }
);

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on PORT " + PORT);
});