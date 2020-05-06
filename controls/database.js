const mysql = require('mysql2');
const dbConnection = mysql.createPool({
    host     : 'localhost',
    user     : 'SRM_admin',        
    password : 'admin02passWORD&3',    
    database : 'SRM'      
}).promise();
module.exports = dbConnection;