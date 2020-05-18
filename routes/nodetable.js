// many thanks to https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/

const express = require('express');
var router = express.Router();
const mysql = require('mysql2');

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
const NodeTableDB = require('../dbscripts/NodetableDB');
const bodyParser = require('body-parser');
// const fs = require('fs');

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

//template for developers
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
        res.send(data)
    })
});

//send parents their own child's data only
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
                // NodeTableDB.connect();
                console.log('Data located for this user');
                console.log('Student id: ' + rows2[0].Students_id)
                    // //overwrite a file if it exists, create one if it doesn't
                    // fs.writeFile('./JSONs/test.json', JSON.stringify(rows), function (err) {
                    //     if (err) throw err;
                    //     console.log('Saved!');
                    //   });
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
                const tableName = "tempData";

                // NodeTable requires table's primary key to work properly
                const primaryKey = "PK_id";

                // Custom SQL query (pass after the second parameter dbConnection in Nodetable() below)
                // The terminating semicolon is not expected
                // const query = "SELECT * FROM tempData WHERE student_fname LIKE ?", [firstName];
                const MySQLquery = "SELECT * FROM tempData WHERE idStudents = ?";
                var query = mysql.format(MySQLquery, [rows2[0].Students_id]);

                //either tablename or query is the third parameter, not both
                const nodeTable = new NodeTable(tableQuery, NodeTableDB, query, primaryKey, columnsMap);

                nodeTable.output((err, data)=>{
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // console.log(data);
                    // Directly send this data as output to Datatable
                    res.send(data)
                })
            } else {
                console.log('No data for this user with email: ' + rows[0].email);
                //send back an empty object
                res.send([{}]);
            }
        // }).catch((err) => {
        //     if (err) console.log(err);
        })
    })
});

//send parents the names of their child's names on record
router.get('/parentsPortal', ifNotLoggedin, (req,res,next) => {
    //retrieve the logged in user's name and email, store it in rows (no other column from 'users' is stored)
    const tableQuery = req.query; 
    dbConnection.execute("SELECT `name`, `email` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([NamesEmails]) => {
        console.log("Username: " + NamesEmails[0].name + ", email: " + NamesEmails[0].email);
        //...match their email with "student's ID" and store the id(s) in rows2 (can expect >=1 result)
        dbConnection.execute("SELECT `Students_id` FROM `tblGuardians` WHERE `Guardian_email`=?",[NamesEmails[0].email])
        .then(([IDs]) => {
            if(IDs.length === 0){
                console.log("Number of students registered under " + NamesEmails[0].name + " : " + IDs.length);
                res.send({
                    draw: '1',
                    recordsTotal: 1,
                    recordsFiltered: 1,
                    data: [ { '0': 'No data on file' } ]
                  });
            } else {
                console.log("Number of students registered under " + NamesEmails[0].name + " : " + IDs.length);
                let columnsMap = [
                    {
                        db: "Student_fname",
                        dt: 0
                    }
                ];
                const primaryKey = "idStudents";

                //currently allow for up to five students to be registered under each Guardian
                const MySQLquery = "SELECT * FROM tblStudents WHERE idStudents = ?";
                var query = mysql.format(MySQLquery, [IDs[0].Students_id]);

                const nodeTable = new NodeTable(tableQuery, NodeTableDB, query, primaryKey, columnsMap);

                nodeTable.output((err, data)=>{
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // console.log(data);
                    // Directly send this data as output to Datatable
                        res.send(data)
                })
            }
        })               
        .catch(err => {
            console.log("Problem with username and email retrieval:\n" + err);
        })
    })
    .catch(err => {
        console.log("Problem with user ID:\n" + err);
    })
});

//send the router object back to whatever requires this module
module.exports = router;