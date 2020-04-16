use linq;

SELECT 
    *
FROM
    subjects_teachers_group;

-- this lists teachers and the subjects they teach:
SELECT 
	idSubjects_Teachers_group,
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