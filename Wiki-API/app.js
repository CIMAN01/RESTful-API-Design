// a RESTful API creation called Wiki-API

// use POSTMAN for requests  

// and refer to: https://www.w3schools.com/tags/ref_urlencode.ASP
// for html url encoding (i.e. %20 for spaces in url)


// create a listening port
const port = 3000;

// require modules (packages)
const https = require("https"); // https
const { dirname } = require("path"); // path
const _ = require("lodash"); // lodash
const ejs = require("ejs"); // ejs
const mongoose = require("mongoose"); // mongoose
const express = require("express"); // express

// create a new application that uses express
const app = express();

// set view engine to use EJS templating 
app.set("view engine", "ejs"); // a path to views folder containing ejs files

// parse the URL-encoded body of requests
app.use(express.urlencoded({extended: true})); 
// use public folder to store static files (such as images and css code) 
app.use(express.static("public")); 


// allow mongoose to connect to a local mongoDB instance (WikiDB)
mongoose.connect("mongodb://localhost:27017/WikiDB",  
                    {useNewUrlParser: true, useUnifiedTopology: true}); 


// create a new (article) Schema that contains a title and content fields
const articleSchema = {
    title: String,
    content: String
}; 

// create a new (article) Model using the Schema to define the "articles" collection
const Article = mongoose.model("Article", articleSchema); // "Article" becomes "articles"



////////////////////////////// Target All Articles //////////////////////////////////

// chained route handler for a route path -> app.route().get().post().delete();
app.route("/articles")
// read all articles in the db collection via the API by targeting the path
.get(function(req, res) { // http GET request method -> READ
    // find all the articles in the articles collection and
    Article.find(function(err, foundArticles) { // function(err, results)
        // if no errors
        if(!err) {
            // send found articles as a response to client
            res.send(foundArticles);
        }
        // or if any errors 
        else { 
            // send those errors to client side
            res.send(err);
        }
    });  
})
// read all articles in the db collection via the API by targeting the path
.post(function(req, res) { // http POST request method -> CREATE
    // create a new Article in the database collection 
    const newArticle = new Article({ // a new Article Document
        title: req.body.title,     // make a post request via postman:
        content: req.body.content // body -> key/value -> x-www-form-urlencoded
    });
    // save the new article to the database
    newArticle.save(function(err) { 
        // handle errors with a callback function
        if(!err) {
            // send a message to client if succcessful 
            res.send("Successfully added a new article.");
        }
        // or if unsuccessful 
        else {
            // send an error message 
            res.send(err);
        }
    }); 
})
// delete all articles in the db collection via API by targeting the path
.delete(function(req, res) { // http DELETE request method -> DELETE
    // delete all articles from database collection
    Article.deleteMany(function(err) { 
        // handle errors with a callback function
        if(!err) {
            // send a message to client if succcessful 
            res.send("Successfully deleted all articles.");
        }
        // or if unsuccessful
        else {
            // send an error message  
            res.send(err);
        }
    });
});


////////////////////////////// Target Specific Articles //////////////////////////////

// chained route handler for a route path
app.route("/articles/:articleTitle")
// read a specific article in the db collection via the API by targeting the path
.get(function(req, res) { // http DELETE request method -> DELETE
    // find the document that has the search parameters (url) requested by the client
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        // if article with a matching title is found
        if(foundArticle) {
            // send back the found article to client from server
            res.send(foundArticle)
        }
        // if a match was not found 
        else {
            // send a message back to client  
            res.send("No articles matching that title was found.");
        }
    }); 
})
// replace a specific article in the db collection via the API by targeting the path
.put(function(req, res) { // http PUT request method -> UPDATE (replaces an entire resource)
    // search articles collection and update a specific article
    Article.updateOne(
        // look for a title that matches the title requested by the client inside url parameter
        {title: req.params.articleTitle}, 
        // body parse the title and content data that has been changed
        {title: req.body.title, content: req.body.content}, // replace title and content
        // by default Mongoose prevents properties from being overwritten 
        {overwrite: true}, // instruct Mongoose to suppress the $set operation
        // handle errors with a callback function
        function(err) { 
            // if there are no errors
            if(!err) {
                // send a message to client  
                res.send("Successfully replaced the selected article.");
            }
            // or if there are errors 
            else {
                // send an error message 
                res.send(err);
            }
        }
    );
}) 
// update a specific article in the db collection via the API by targeting the path
.patch(function(req, res) { // http PATCH request method -> UPDATE (replaces a part of the resource)
    // search articles collection and patch or update a specific article
    Article.updateOne(
        // look for a title that matches the title requested by the client inside url parameter
        {title: req.params.articleTitle},
        // tell mongoDB to update only the relevant fields with the new values
        {$set: req.body}, // body parses the request into a javascript object
        // handle errors with a callback function
        function(err) { 
            // if there are no errors
            if(!err) {
                // send a message to client  
                res.send("Successfully updated the selected article.");
            }
            // or if there are errors 
            else {
                // send an error message 
                res.send(err);
            }
        }  
    );
})
// delete an article in db collection via API by targeting the path
.delete(function(req, res) { // http DELETE request method -> DELETE
    // delete all articles from database collection
    Article.deleteOne(
         // look for a title that matches the title requested by the client inside url parameter 
        {title: req.params.articleTitle},
         // handle errors with a callback function
        function(err) { 
            // handle errors with a callback function
            if(!err) {
                // send a message to client if succcessful 
                res.send("Successfully deleted the selected article.");
            }
            // or if unsuccessful 
            else {
                // send an error message
                res.send(err);
            }
        }
    );
});


// port listening 
app.listen(port, function() {
    console.log("Server started on port 3000");
  });
  