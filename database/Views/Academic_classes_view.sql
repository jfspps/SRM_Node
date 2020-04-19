CREATE VIEW `vw_Academic_classes` AS
    SELECT 
        *
    FROM
        tblSubjects_Teachers_groups
            JOIN
        tblTeachers ON tblSubjects_teachers_groups.teachers_id = idTeachers
            RIGHT JOIN
        tblSubjects ON tblSubjects_teachers_groups.subjects_id = idSubjects;