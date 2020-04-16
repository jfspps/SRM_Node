use linq;

SELECT 
    *
FROM
    guardians;

-- This statement lists the guardians details with their son/daughter's details

select guardian_fname, guardian_lname, guardian_email, student_id, student_fname, student_lname from guardians join students on student_id = idStudents;