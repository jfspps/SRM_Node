const express = require('express');
var router = express.Router();

const path = require('path');
const cookieSession = require('cookie-session');
const dbConnection = require('../controls/database');

// //set Express and views folder for EJS files
const app = express();
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname,'./views'));
app.set('view engine','ejs');

//set cookie session middleware ('session' is the literal used throughout)
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

// Defines routing behaviour re. ifNotLoggedIn and ifLoggedIn
// Pass ifLoggedin to ensure a page only renders ifLoggedin = true (see root for example)
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(403).send('<h1>Access denied</h1> <p>Please login from the <a href="/">home page</a> to gain access</p>');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/home');
    }
    next();
}

//Routing --------------------------------------------------------------------------------------

router.get('/testing', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('testing',{
            //pass the row (should only be one, hence [0]) name field to home.ejs name attribute
            name:rows[0].name
        });
    });
});

router.get('/testing/p1', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('testingP1',{
            //pass the row (should only be one, hence [0]) name field to home.ejs name attribute
            name:rows[0].name
        });
    });
});

router.get('/testing/p2', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('testingP2',{
            //pass the row (should only be one, hence [0]) name field to home.ejs name attribute
            name:rows[0].name
        });
    });
});

router.get('/listStudents', function(req, res){
    var queryString = "SELECT Student_fname, Student_lname, Student_email FROM tblStudents";

    var temp;
    dbConnection.execute(queryString).then(([rows]) =>
    rows.forEach(element => {
        console.log(element);
        })
    );
    res.send('Done');
});

//send the router object back to whatever requires this module
module.exports = router;