use linq;
drop procedure if exists list_data;

delimiter //

create procedure list_data()
begin
	SELECT 
		idStudents,
		Subject_class_name,
		student_fname,
		student_lname,
		student_email,
		Assignment_title,
		raw_score,
		CONCAT(ROUND(100 * (Raw_score / max_raw_score), 1), '%') AS 'percentage'
	FROM
		students
			JOIN
		academic_class ON idStudents = academic_class.Student_id
			JOIN
		subjects_teachers_group ON Subjects_Teachers_group_id = idSubjects_Teachers_group
			JOIN
		student_assignments ON idStudents = student_assignments.Student_id
			JOIN
		assignments_info ON idAssignments_info = student_assignments.Assignment_id
        WHERE
		subjects_teachers_group_id = 1
	order BY assignment_title;
end//