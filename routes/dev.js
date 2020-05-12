const express = require('express');
var router = express.Router();

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
const bodyParser = require('body-parser');

//needed to handle server side MySQL
const NodeTable = require("nodetable");

const app = express();
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname,'./views'));
app.set('view engine','ejs');

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

//exchange json
app.use(bodyParser.json());

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(403).send('<h1>Access denied</h1> <p>Please login from the <a href="/">home page</a> to gain access</p>');
    }
    next();
}

//Routing --------------------------------------------------------------------------------------

router.get('/development', ifNotLoggedin, (req,res) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {          
            res.render('development',{
                name : rows[0].name
            });
    });
});

router.get('/query', ifNotLoggedin, (req,res) => {
    console.log('Query received');    
    var tableQuery = req.query;
    //prepares the order in which columns appear (effectively substitutes the SQL query statement)
    let columnsMap = [
            {
                db: "Student_fname",
                dt: 0
            },
            {
                db: "Student_lname",
                dt: 1
            },
            {
                db: "Student_email",
                dt: 2
            }
        ]
    // our database table name
    const tableName = "tblStudents";

    // NodeTable requires table's primary key to work properly
    const primaryKey = "idStudents";

    // Custom SQL query (pass after the second parameter dbConnection in Nodetable() below)
    //const query = "SELECT * FROM tblStudents WHERE someThing";

    const nodeTable = new NodeTable(tableQuery, dbConnection, tableName, primaryKey, columnsMap);

    nodeTable.output((err, data)=>{
        if (err) {
            console.log(err);
            return;
        }
        // Directly send this data as output to Datatable
        res.send(data)
    })
});

//send the router object back to whatever requires this module
module.exports = router;