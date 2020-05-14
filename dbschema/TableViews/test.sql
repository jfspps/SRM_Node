DROP TABLE tempData; 

CREATE TABLE tempData AS SELECT idStudents,
    student_fname,
    student_lname,
    comments_for_guardian,
    assignment_title,
    assignment_detail,
    max_raw_score,
    raw_score FROM
    vw_Students_assignments_grades;

ALTER TABLE tempData ADD COLUMN PK_id INT;

ALTER TABLE tempData MODIFY COLUMN PK_id INT auto_increment PRIMARY KEY;

-- SELECT 
--     student_fname,
--     student_lname,
--     comments_for_guardian,
--     assignment_title,
--     assignment_detail,
--     max_raw_score,
--     raw_score
-- FROM
--     tempData
-- WHERE
--     idStudents = 1;