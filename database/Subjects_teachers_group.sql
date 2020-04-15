use linq;

insert into subjects_teachers_group(subject_class_name, subject_id, teacher_id) values
('Mathtastic', 1, 2), ('Englooosh', 2, 1);

SELECT 
    *
FROM
    subjects_teachers_group;

-- this lists teachers and the subjects they teach:
SELECT 
    subject_title,
    subject_class_name,
    teacher_fname,
    teacher_lname
FROM
    subjects
        JOIN
    subjects_teachers_group ON idSubjects = subject_id
        JOIN
    teachers ON teacher_id = idTeachers;