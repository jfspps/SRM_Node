CREATE VIEW `vw_Subjects_available` AS
select * from tblSubjects left join tblstudents_subjects on idSubjects = tblStudents_Subjects.subjects_id;