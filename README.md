# Student Record Management SRM #
This project is a skeleton to the frontend of SRM (student record management). The main program, which was initially planned to be developed with Node, Datatables, and MySQL, is now being developed in Spring 5. The Java based repo is [here](https://github.com/jfspps/SRM-Spring).

__Frameworks and tools: NodeJS 13 and MySQL 8__

__Installation__

1. Clone the repo and then `npm install` in `/SRM`.
2. FYI, Datatables, Bootstrap and JQuery are referenced by CDNs (see `/partials`).
3. Ensure that MySQL 8 (or above) is installed and passwords set to MEDIUM (Linux Mint users can go [here](https://medium.com/@shivraj.jadhav82/mysql-setup-on-linux-mint-948470115d5))
4. Either rebuild SRM db by forward engineering in MySQL workbench or by running the [script](./dbschema/SRM_SQL_build.sql). When building the db for the first time, comment out (--) the `DROP USER 'SRM_admin'@'localhost';` statement (MySQL flags an error if the user does not already exist on the db).
5. Build the tempData table by running the script /dbschema/TableViews/test.sql. This is intended to be a temporary step (eventually provided by a Java based backend).
6. Run `node app.js` from /SRM.
7. Register and login under any details for basic access. Register using one of the parents' login details (e.g. fbob245@email.com from the [bootstrap script](./dbSchema/Scripts/Populate_tables.sql)) with any name and password, and then login to access examples of student data.

## Development stages ##

### Parents' portal (NodeJS) ###

1. MySQL schema design and preparation
2. NodeJS connections and simple record extraction via console

3. Teacher authentication and authorisation testing

Use the currently populated tables to verify students results processing the following:

1. Averages by component (homework, test, mock exams, coursework etc.)
2. Mapping to percentage uniform marks (PUM)
3. Letter grade assignment (comparison between two SQL tables)

Construct NodeJS SQL statements and error handling functions.

#### Bootstrap 4 interface ####

1. Display pages, showing all columns:
   a. Personal data and school admin entry page
   b. Assignment info entry page
   c. Grade threshold entry page
2. Display pages, with options to select specific columns
3. More display pages, showing all columns and then with options (as before), for the processing of students' results.
		
#### Parents' portal MySQL notes ####

Due to MySQL foreign key constraints, the following tables should be populated in the order:

1. Students
2. (In no particular order) Guardians, Subjects and Teachers
3. (In no particular order) Guardians_addresses, Subject_Subjects, Form_groups, Subject_Teachers_groups and Student_reports
4. Academic_classes

When the pastoral and academic plans are entered, teachers can then begin entering assignments related data:

4. Assignments_info
5. (In no particular order) Assignments_teacher_info, Grade_thresholds, Letter_grade_chars and  Student_Assignments
6. Grading Groups
