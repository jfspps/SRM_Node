use linq;

insert into students_junc_subjects(student_id, subject_id) values
(1, 1), (2, 1), (3, 1), (4, 2), (5, 2), (6, 2), (7, 2);

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