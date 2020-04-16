use linq;

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