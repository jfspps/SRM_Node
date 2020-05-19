// many thanks to https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/

const express = require('express');
var router = express.Router();
const mysql = require('mysql2');

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
const NodeTableDB = require('../dbscripts/NodetableDB');
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

//Responses to NodeTable requests are defined here

//Development page: template for development, authorisation not required
router.get('/query', ifNotLoggedin, (req,res) => {
    // NodeTableDB.connect();
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

    // Custom SQL query (pass as the third of five parameters, following dbConnection, in Nodetable() below)
    //const query = "SELECT * FROM tblStudents WHERE someThing";

    const nodeTable = new NodeTable(tableQuery, NodeTableDB, tableName, primaryKey, columnsMap);

    nodeTable.output((err, data)=>{
        if (err) {
            console.log(err);
            return;
        }
        // Directly send this data as output to Datatable
        res.send(data);
        // console.log("/query data:\n" + data);
    })
});

//Parents Portal homepage: send parents/guardians the names of their child's names on record
router.get('/parentsPortal', ifNotLoggedin, (req,res) => {
    //retrieve the logged in user's name and email, store it in rows (no other column from 'users' is stored)
    const tableQuery = req.query;
    dbConnection.execute("SELECT `name`, `email` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([NamesEmails]) => {
        console.log("Username: " + NamesEmails[0].name + ", email: " + NamesEmails[0].email);
        //...match their email with "student's ID" and store the id(s) in IDs (can expect >=1 result)
        dbConnection.execute("SELECT `Students_id` FROM `tblGuardians` WHERE `Guardian_email`=?",[NamesEmails[0].email])
        .then(([IDs]) => {
            if(IDs.length === 0){
                console.log("There are no students registered under " + NamesEmails[0].name);
                res.send({
                    draw: '1',
                    recordsTotal: 1,
                    recordsFiltered: 1,
                    data: [ { '0': 'No data on file' } ]
                  });
            } else {
                let onFile = IDs.length;
                
                console.log("Number of students registered under " + NamesEmails[0].name + " : " + onFile);
                //assume up to five students registered under the same Guardian for now...
                //create an array which stores the IDs and assign -1 to all other elements (all primary keys are >0)
                
                let tempIDIndex = [];
                for (i = 0; i < 5; i++){
                    if (i <= onFile -1){
                        tempIDIndex[i] = IDs[i].Students_id;
                    }
                    else {
                        tempIDIndex[i] = -1;
                    }
                }
                // console.log(tempIDIndex);

                let columnsMap = [
                    {
                        db: "CONCAT(Student_fname, ' ', Student_lname)",
                        dt: 0
                    }
                ];
                const primaryKey = "idStudents";

                //currently allow for up to five students to be registered under each Guardian
                let MySQLquery = "SELECT * FROM tblStudents WHERE idStudents IN (?, ?, ?, ?, ?)";
                const query = mysql.format(MySQLquery, [tempIDIndex[0], tempIDIndex[1], tempIDIndex[2], tempIDIndex[3], tempIDIndex[4]]);

                const nodeTable = new NodeTable(tableQuery, NodeTableDB, query, primaryKey, columnsMap);

                nodeTable.output((err, data)=>{
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // Directly send this data as output to Datatable
                    res.send(data);
                    // console.log("/parentsPortal data:\n" + data);
                })
            }
        })               
        .catch(err => {
            console.log("Problem with extracting student's ID using Guardian's email:\n" + err);
        })
    })
    .catch(err => {
        console.log("Problem with extracting name and email address using user ID:\n" + err);
    })
});

//Parents Portal academic records: send parents/guardians the data for students they are registered for
router.get('/parentsQuery', ifNotLoggedin, (req,res) => {
    //get user's email address...
    const tableQuery = req.query; 
    dbConnection.execute("SELECT `email` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {         
        console.log('Email: ' + rows[0].email);
        // ...and match it with the student's Guardian details
        dbConnection.execute("SELECT `Students_id` FROM `tblGuardians` WHERE `Guardian_email`=?",[rows[0].email])
        .then(([rows2]) => {            
            if(rows2.length > 0){
                console.log(rows[0].email + " requested data. Processing...");

                //see get("/parentsPortal") for more details on tempIDIndex and limit of five students
                let onFile = rows2.length;
                let tempIDIndex = [];
                for (i = 0; i < 5; i++){
                    if (i <= onFile -1){
                        tempIDIndex[i] = rows2[i].Students_id;
                    }
                    else {
                        tempIDIndex[i] = -1;
                    }
                }
                // console.log(tempIDIndex);

                // prepares the order in which columns appear (effectively substitutes the SQL query statement)
                // take real care with case sensitivity!
                let columnsMap = [
                        {
                            db: "student_fname",
                            dt: 0
                        },
                        {
                            db: "student_lname",
                            dt: 1
                        },
                        {
                            db: "comments_for_guardian",
                            dt: 2
                        },
                        {
                            db: "assignment_title",
                            dt: 3
                        },
                        {
                            db: "assignment_detail",
                            dt: 4
                        },
                        {
                            db: "max_raw_score",
                            dt: 5
                        },
                        {
                            db: "raw_score",
                            dt: 6
                        }
                    ]
                // our database table name (see /schema/tableviews); can comment this out if custom `query` is needed
                // const tableName = "tempData";

                // NodeTable requires table's primary key to work properly
                const primaryKey = "PK_id";

                // Custom SQL query (pass after the second parameter dbConnection in Nodetable() below)
                // The terminating semicolon is not expected
                const MySQLquery = "SELECT * FROM tempData WHERE idStudents IN (?, ?, ?, ?, ?)";
                const query = mysql.format(MySQLquery, [tempIDIndex[0], tempIDIndex[1], tempIDIndex[2], tempIDIndex[3], tempIDIndex[4]]);

                //either tablename or query is the third parameter, not both
                const nodeTable = new NodeTable(tableQuery, NodeTableDB, query, primaryKey, columnsMap);

                nodeTable.output((err, data)=>{
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // Directly send this data as output to Datatable
                    res.send(data);
                    // console.log("/parentsQuery data:\n" + data);
                })
            } else {
                console.log('No data for this user with email: ' + rows[0].email);
                //send back an empty object
                res.send([{}]);
            }
        })
        .catch(err => {
            console.log("Problem with extracting student's ID using Guardian's email:\n" + err);
        })
    })
    .catch(err => {
        console.log("Problem with extracting name and email address using user ID:\n" + err);
    })
});

//send the router object back to whatever requires this module
module.exports = router;