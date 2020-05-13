const express = require('express');
var router = express.Router();

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
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

router.get('/parentspage', ifNotLoggedin, (req,res) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {          
            res.render('parentspage',{
                name : rows[0].name
            })
    });
});

router.get('/development', ifNotLoggedin, (req,res) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {          
            res.render('development',{
                name : rows[0].name
            })
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

router.get('/parentsquery', ifNotLoggedin, (req,res) => {
    // console.log("Parents' query received");
    // prepare the temporary table from a view (tempData should be created at installation)
    // the table tempData would be created by school staff and only returned here

    dbConnection.query('SELECT student_fname, student_lname, comments_for_guardian, assignment_title, assignment_detail, max_raw_score, raw_score FROM tempData').then((rows)=> {
        
        // //overwrite a file if it exists, create one if it doesn't
        // fs.writeFile('./JSONs/test.json', JSON.stringify(rows), function (err) {
        //     if (err) throw err;
        //     console.log('Saved!');
        //   });

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
        // our database table name
        const tableName = "tempData";
    
        // NodeTable requires table's primary key to work properly
        const primaryKey = "assignment_title";
    
        // Custom SQL query (pass after the second parameter dbConnection in Nodetable() below)
        // const query = "SELECT student_fname, student_lname, comments_for_guardian, raw_score, assignment_title, assignment_detail, max_raw_score, FROM tblStudents JOIN tblStudent_assignments ON idStudents = tblStudent_assignments.students_id JOIN tblAssignments_info ON idAssignments_info = tblStudent_assignments.assignments_info_id JOIN tblGrading_groups ON tblGrading_groups.assignments_info_id = idAssignments_info JOIN tblGrade_thresholds ON grade_thresholds_id = idGrade_thresholds JOIN tblLetter_grade_chars ON letter_grade_chars_id = idLetter_grade_chars;";
    
        const nodeTable = new NodeTable(tableQuery, dbConnection, tableName, primaryKey, columnsMap);
    
        nodeTable.output((err, data)=>{
            if (err) {
                console.log(err);
                return;
            }
            // Directly send this data as output to Datatable
            res.send(data)
        })
    })   
});

//send the router object back to whatever requires this module
module.exports = router;