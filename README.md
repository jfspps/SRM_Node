# LINQ
LINQ is a suite of applications which store and process academic data

__Requirements: Java VM and MySQL__

__Installation__
1. Install both the latest Java VM and MySQL Workbench (community edition) on the server
2. Setup admin account(s) on the MySQL server and perform additional security checks (removing defaults)
3. Install LINQ-server and then add users with necessary privileges (sample SQL script, with instructions, can be used directly from the SQL console)
4. Install LINQ-client (bundled with SQLite) on all required machines, register (or login) and connect to LINQ-server over SSL

The local LINQ-client software runs off SQLite, and supports limited local storage and export of teacher's own records (their students' names, assignment related information, grade thresholds, students' marks and cumulative averages of each component). Access to all other data must be sought via a local or remote connection to LINQ-server.
