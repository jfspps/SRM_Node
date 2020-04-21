CREATE VIEW `vw_Subjects_available_with_students` AS
    SELECT 
        *
    FROM
        tblSubjects
            LEFT JOIN
        tblstudents_subjects ON idSubjects = tblStudents_Subjects.subjects_id
            LEFT JOIN
        tblStudents ON tblStudents_Subjects.students_id = idStudents;