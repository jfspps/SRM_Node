var express = require('express');
var mysql = require('mysql');
var ejs = require('ejs');
var bodyparser = require('body-parser');

var app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
// app.use(express.static(__dirname + '/public'));

//establish connections and routing (remember to ALTER USER 'course'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pass&_202LINQ' and 'flush privileges' if needed)

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'SRM_admin',
    password : 'admin02passWORD&3',
    database : 'SRM'
});

// MySQL workbench does not appear to permit new user creation, so via the CLI, use
// CREATE USER 'SRM_admin' IDENTIFIED BY 'adminpassword';
// GRANT SELECT, INSERT, UPDATE, DELETE ON SRM.* TO 'SRM_admin'@'localhost' WITH GRANT OPTION

app.get("/", function(req, res){
    res.send("SRM_admin connected to Student Record Management SRM");
});

app.get("/connect", function(req, res){
    var queryString = "SELECT count(*) AS count FROM tblStudents";
    var errorString = "Could not find students on the database";

    connection.query(queryString, function(error, results){
        if (error){
            console.log(errorString);
            throw error;
        };
        //use count from the SQL statement AS count:
        res.send("There are " + results[0].count + " students on the database");
        // res.render("students", {data: results[0].count});
    }); 
});

app.listen(8080, function(){
    console.log("Listening to port 8080");
});