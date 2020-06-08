# SRM #
SRM (student record management) is a suite of applications which store and process academic data

__Frameworks and tools: NodeJS 13, MySQL 8, Java 11 and Spring MVC 5__

__Installation__

1. Clone the repo and then `npm install` in `/SRM`.
2. FYI, Datatables, Bootstrap and JQuery are referenced by CDNs (see `/partials`).
3. Ensure that MySQL 8 (or above) is installed and passwords set to MEDIUM (Linux Mint users can go [here](https://medium.com/@shivraj.jadhav82/mysql-setup-on-linux-mint-948470115d5))
4. Either rebuild SRM db by forward engineering in MySQL workbench or by running the script `/dbschema/SRM_SQL_build.sql`. When building the db for the first time, comment out (--) the `DROP USER 'SRM_admin'@'localhost';` statement (MySQL flags an error if the user does not already exist on the db).
5. Build the tempData table by running the script /dbschema/TableViews/test.sql. This is intended to be a temporary step, until the Java backend is built.
6. Run `node app.js` from /SRM.
7. Register and login under any details for basic access. Register using one of the parents' login details (e.g. fbob245@email.com from /dbSchema/Scripts/Populate_tables.sql) with any password, and then login to access student data.

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

#### Bootstrap 4 interface####

1. Display pages, showing all columns:
   a. Personal data and school admin entry page
   b. Assignment info entry page
   c. Grade threshold entry page
2. Display pages, with options to select specific columns
3. More display pages, showing all columns and then with options (as before), for the processing of students' results.*
		
Group the individual pages together with a uniform theme and flow.

#### Student record and data-entry (Java and Spring) TODO ####

1. Personal data-entry and verification (check for duplication and NULL)
   a. Students' personal details
   b. Guardians personal details
   c. How SRM responds when either records are updated or deleted

2. Teacher data-entry and verification (check for duplication and NULL)
   a. Teacher work details
   b. Subjects on offer (including those not taken by any student)
   c. How SRM responds when either records are updated or deleted

3. Academic classes data-entry and verification (check for duplication and NULL)
   a. Assigning students and teachers to specific classes
   b. How SRM responds when either records are updated or deleted

#### Handling of assignment and threshold data entry TODO ####
	
1. Assignment info data-entry and verification (check for duplication and NULL)
   a. Components of all types
   b. Couple assignment info with teachers
   c. How SRM responds when either records are updated or deleted
	
2. Student assignment info (raw scores) upload and verification. How SRM responds when either records are updated or deleted.

#### Handling of processing of students' scores TODO ####

1. Percentage deduction of individual scores and then grade threshold mapping.
2. Averages of percentages by component type
3. Comparison of individual student's percentage to a class average
4. PUM mapping of individual scores
5. Overall, end-of-year scores based on weighted component scores
	
#### Error-checking and feedback TODO ####

1. Entering raw scores > max_raw score
2. Entering unexpected data types: input 'A' instead of MySQL INT
3. Teachers student data of other teachers
4. Not entering any student results for a previous assignment

#### User login page TODO ####

Apply the MySQL statements developed earlier and build a welcome page

#### Microsoft Excel XLSX export TODO #####

Develop Spring MVC interface with JExcel or jxls (for example) to display, on the first worksheet:

+ Student name
+ Student email address
+ Assignment info, raw score, percentage and letter grade
+ Class average

On a second worksheet:

+ Student name
+ Assignment info
+ Difference between student average and class average (with colour code)
+ Standard deviation

On the third worksheet:

+ Student name
+ Cumulative average by component
+ Overall cumulative average and grade

Develop the worksheet further so that the user can select which elements to print and on which worksheet. See how the font size and number of characters influences the cell size...

#### Other database-independent settings to save on SRM-server TODO ####

Save above settings to a separate table in SRM? Need to also store:

+ Academic term or semester start dates, including the start date of the following year (SRM will default to one year after the first start date if not entered)
+ Logging of MySQL access

Most of the main objectives would be fulfilled at this stage. Future ideas include:

+ Use of D3 to display trends with data
+ Parents/Guardians web portal
+ Automated student report generator

#### MySQL db notes ####

Due to MySQL foreign key constraints, the following tables should be populated in the order:

1. Students
2. (In no particular order) Guardians, Subjects and Teachers
3. (In no particular order) Guardians_addresses, Subject_Subjects, Form_groups, Subject_Teachers_groups and Student_reports
4. Academic_classes

When the pastoral and academic plans are entered, teachers can then begin entering assignments related data:

4. Assignments_info
5. (In no particular order) Assignments_teacher_info, Grade_thresholds, Letter_grade_chars and  Student_Assignments
6. Grading Groups
