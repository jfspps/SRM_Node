use linq;

SELECT 
    idStudents,
    student_fname,
    student_lname,
    raw_score,
    Max_raw_score,
    assignment_title,
    case when raw_score >= Highest_raw_threshold then Highest_char
    when raw_score >= High1_raw then High1_char
    when raw_score >= High2_raw then High2_char
    when raw_score >= High3_raw then High3_char
    when Raw_score >= High4_raw then High4_char
    else 'U'
    end as 'Grade'
FROM
    student_assignments
        JOIN
    students ON Student_id = idStudents
        JOIN
    assignments_info ON Assignment_id = idAssignments_info
        JOIN
    grading_groups ON Assignments_id = idAssignments_info
        JOIN
    letter_grade_chars ON letter_grade_chars.Grading_group_id = idGrading_groups
        JOIN
    grade_thresholds ON grade_thresholds.Grading_group_id = idGrading_groups;