CREATE VIEW `Academic_classes_with_students` AS
    SELECT 
        *
    FROM
        tblStudents
            JOIN
        tblacademic_classes ON idStudents = tblacademic_classes.students_id
            JOIN
        tblSubjects_Teachers_groups ON subjects_teachers_groups_id = idSubjects_teachers_group
            JOIN
        tblTeachers ON tblSubjects_teachers_groups.teachers_id = idTeachers
            JOIN
        tblSubjects ON tblSubjects_teachers_groups.subjects_id = idSubjects;