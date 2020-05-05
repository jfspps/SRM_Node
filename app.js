//thanks and appreciation to https://github.com/passport/express-4.x-local-example for much guidance here

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var controls = require('./controls');
var mysql = require('mysql');

//Configure MySQL ------------------------------------------------------------------------------------
//establish connections and routing (remember to ALTER USER 'course'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pass&_202LINQ' and 'flush privileges' if needed)

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'SRM_admin',
  password : 'admin02passWORD&3',
  database : 'SRM'
});

// MySQL workbench does not appear to permit new user creation, so via the CLI, use
// CREATE USER 'SRM_admin' IDENTIFIED BY 'insertPassword';
// GRANT ALL ON SRM.* TO 'SRM_admin'@'localhost';

//Configure Passport ---------------------------------------------------------------------------------

// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    controls.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.

// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  controls.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


// Configure Express ------------------------------------------------------------------------------------------
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
  function(req, res) {
    // res.send("Connection to SRM established...");
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    var queryString = "SELECT count(*) AS count FROM tblStudents";
    var errorString = "Could not find students on the database";

    connection.query(queryString, function(error, results){
      if (error){
          console.log(errorString);
          throw error;
      };
      //use count from the SQL statement AS count:
      // res.send("There are " + results[0].count + " students on the database");
      res.render('profile', { user: req.user, studentCount: results[0].count });
    });
});

app.listen(8080, function(){
    console.log("Listening to port 8080");
});