use linq;

insert into form_group(teacher_id, student_id) values
(1, 1), (1,3), (1,5), (1,7),
(2,2), (2,4), (2,6);

SELECT 
    *
FROM
    form_group;

-- This lists students by form group:
SELECT 
    student_fname, student_lname, teacher_lname, form_group_name
FROM
    students
        JOIN
    form_group ON student_id = idStudents
        JOIN
    teachers ON teacher_id = idteachers
ORDER BY teacher_id , student_lname;