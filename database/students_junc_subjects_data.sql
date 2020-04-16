use linq;

SELECT 
    *
FROM
    students_junc_subjects;

-- this lists students and the subjects they study

SELECT 
    student_fname, student_lname, subject_title
FROM
    students
        JOIN
    students_junc_subjects ON idStudents = student_id
        JOIN
    subjects ON subject_id = idsubjects;