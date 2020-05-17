// many thanks to https://newcodingera.com/datatables-server-side-processing-using-nodejs-mysql/

const express = require('express');
var router = express.Router();

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
const NodeTableDB = require('../dbscripts/NodetableDB');
const bodyParser = require('body-parser');
const fs = require('fs');

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

router.get('/parentsquery', ifNotLoggedin, (req,res) => {
    //get user's email address...
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
                //prepares the order in which columns appear (effectively substitutes the SQL query statement)
                var tableQuery = req.query; 
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
                        },
                        {
                            db: "idStudents",
                            dt: 7
                        },
                        {
                            db: "PK_id",
                            dt: 8
                        }
                    ]
                // our database table name (see /schema/tableviews); comment this out if custom query is needed
                const tableName = "tempData";

                // NodeTable requires table's primary key to work properly
                const primaryKey = "PK_id";

                // Custom SQL query (pass after the second parameter dbConnection in Nodetable() below)
                // The terminating semicolon is not expected
                const query = "SELECT student_fname, student_lname, comments_for_guardian, assignment_title, assignment_detail, max_raw_score, raw_score, idStudents, PK_id FROM tempData WHERE raw_score > 29";

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

//send the router object back to whatever requires this module
module.exports = router;