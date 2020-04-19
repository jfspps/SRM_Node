# LINQ
LINQ is a suite of applications which store and process academic data

__Requirements: Java VM and MySQL__

__Installation__
1. Install both the latest Java VM and MySQL Workbench (community edition)
2. Setup admin account(s) on the server
3. Install LINQ-server and then add users with desired privileges (sample SQL script can be used from the SQL console)
4. Install LINQ-client (bundled with SQLite) on all required machines and connect to LINQ-server over SSH

The local LINQ-client software runs off SQLite, and supports limited local storage and export of teacher's own records (their students' names, assignment related information, grade thresholds, students' marks and cumulative averages of each component). Access to all other data must be sought via a local or remote connection to LINQ-server.