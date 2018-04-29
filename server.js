// Import Required Modules
var bodyParser = require('body-parser');
var express = require("express");
var mysql = require("mysql");
var exphbs = require("express-handlebars");
var app = express();
require("dotenv").config();

// Adds Port
PORT = process.env.PORT || 8080;

// SQL Database Conection
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.SQL_KEY,
    database: process.env.SQL_DB
  });

// Send Notice That SQL Can Connect
connection.connect(function(err){
    if(err){
        throw err;
    } else{
        console.log("SQL Connected As ID: ", connection.threadId);
    }
});

// Sets Up Express Data Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sets Up View Engine For Handelbars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set Up Static Files
app.use(express.static("public"));

// Routes - Get, Post, Put, & Delete
app.get("/", function(req, res){
    var sqlQuery = "SELECT * FROM list";
    connection.query(sqlQuery, function(err, data){
        if(err){
            console.log(err);
            return res.status(500).end();
        } else{
            res.status(200);
            res.render("index", {list: data} );
        };
    });   
});

app.post("/update", function(req, res){
    var sqlQuery = "INSERT INTO list (list_item) VALUES (?)";
    connection.query(sqlQuery,[req.body.newItem],function(err, data){
        if(err){
            console.log(err);
            return res.status(500).end();
        } else {
            console.log("Added Item: ", req.body);
            res.json({ id: data.insertId });
        };
    });
});

app.put("/update/:id", function(req, res){
    console.log("Got Put Request", req.params.id);
    var sqlQuery = "UPDATE list SET list_item = ? WHERE id = ?";
    connection.query(sqlQuery,[req.body.updateItem, req.params.id],function(err, data){
        if(err){
            console.log(err);
            return res.status(500).end();
        } else {
            console.log("Updated Item: ", req.params.id, req.body.updateItem);
            res.json({ id: data.insertId });
        };
    });
});

app.delete("/update/:id", function(req, res){
    console.log(req.params.id);
    var sqlQuery = "DELETE FROM list WHERE id = ?"
    connection.query(sqlQuery,[req.params.id],function(err, data){
        if(err){
            console.log(err);
            res.status(500).end(); 
        }; 
        console.log("Deleted: ", data);
        res.status(200).end();
    });
});

// Stars The Server Listen
app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
  