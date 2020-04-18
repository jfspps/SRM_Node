CREATE VIEW `Students_personal_data` AS
    SELECT 
        *
    FROM
        tblStudents
            JOIN
        tblGuardians ON idStudents = tblGuardians.students_id
            JOIN
        tblGuardians_addresses ON Guardians_id = idGuardians;