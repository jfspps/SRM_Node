//many thanks to https://www.w3jar.com/node-js-login-and-registration-system-with-express-js-and-mysql/ for help

//Express-Validator for validating form data
//Cookie-Session for handling Session
//Bcrypt for hashing the user’s password

const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./dbscripts/database');
const { body, validationResult } = require('express-validator');

//set Express and views folder for EJS files
const app = express();
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

//set cookie session middleware ('session' is the literal used throughout)
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  3600 * 1000 // 1hr
}));

// Defines routing functions ifNotLoggedIn and ifLoggedIn
// Logged in users are sent to the home page, otherwise their are sent to the login page
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('login');
    }
    next(); //continue with subsequent callbacks
}

const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/home');
    }
    next();
}

//Routing --------------------------------------------------------------------------------------

app.get('/', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT `name` FROM `users` WHERE `id`=?",[req.session.userID])
    .then(([rows]) => {
        res.render('home',{
            //pass the row (should only be one, hence [0]) 'name' field to home.ejs 'name' attribute
            name:rows[0].name
        });
    });
});

// User registration page
app.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    //check if EJS form's user_email is a valid format then compare with SQL db records
    body('user_email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            //if the same email is on the db then it is passed to rows array and eventually terminates the async Promise
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true; 
        });
    }),
    body('user_name','Username is Empty!').trim().not().isEmpty(),
    body('user_pass','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {user_name, user_pass, user_email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcrypt)
        bcrypt.hash(user_pass, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            dbConnection.execute("INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",[user_name,user_email, hash_pass])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // RENDERING login PAGE WITH VALIDATION ERRORS
        res.render('login',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});

// User login page
app.post('/', ifLoggedin, [
    body('user_email').custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
            }
            return Promise.reject('Invalid Email Address!');
        });
    }),
    body('user_pass','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[user_email])
        .then(([rows]) => {
            // console.log(rows[0].password);
            bcrypt.compare(user_pass, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/');
                }
                else{
                    res.render('login',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // RENDERING login PAGE WITH LOGIN VALIDATION ERRORS
        res.render('login',{
            login_errors:allErrors
        });
    }
});


// User logout routing
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});
// END OF LOGOUT

// External routing
app.use(require('./routes/dev'));
app.use(require('./routes/testing'));

//leave this generic 404 last
app.get('*', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1> <p>To login click <a href="/">here</a>.</p>');
});

app.listen(8080, () => console.log("Connected to SRM..."));
