use linq;

select * from academic_class;

SELECT 
    Student_fname,
    Student_lname,
    Subjects_Teachers_group_id,
    Subject_class_name
FROM
    students
        JOIN
    academic_class ON student_id = idStudents
        JOIN
    subjects_teachers_group ON Subjects_Teachers_group_id = idSubjects_Teachers_group;