const express = require('express');
var router = express.Router();

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../dbscripts/database');
const bodyParser = require('body-parser');

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

//the Homepage (which returns a list of students names for whom they are registered under) is handled by get("/"); see app.js

//running /parentspage triggers the /parentsQuery GET command (get all student records for whom they are registered under)
router.get('/parentspage', ifNotLoggedin, (req,res) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {          
            res.render('parentspage',{
                name : rows[0].name
            })
    });
});

//running /development triggers the /query GET command (generic list of all students' names and email addresses)
router.get('/development', ifNotLoggedin, (req,res) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {          
            res.render('development',{
                name : rows[0].name
            })
    });
});

//send the router object back to whatever requires this module
module.exports = router;