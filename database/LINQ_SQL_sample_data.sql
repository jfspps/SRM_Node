use linq;

-- This script sets up the database with random, fake entries
-- Note the order that these scripts are processed matters since foreign keys must be set after primary keys have been set

insert into students(Student_fname, Student_lname, Student_mid_initials, Student_email, Student_phone)
values('James', 'Bob', 'T', 'jamesbob@email.com', '02973432'),
('Jane', 'Bob', 'L M', 'jane12432@email.com', '534534'),
('Tim', 'Tom', '', 'timetomtam@tim.co.uk', '2039402934'),
('Jake', 'Josh', 'P S', 'whizbang@pop.com', '353453453'),
('Chris', 'Smith', 'O', 'chris@someplace.com', '029347823'),
('Jill', 'Jungle', 'E', 'Jill93@email.net', '230493894'),
('Sam', 'Dodds', 'A', 'samdodds21@threo.net', '123097234');

insert into guardians(guardian_fname, guardian_lname, guardian_phone, guardian_email, guardian_2nd_email, student_id) 
values('Frank', 'Bob', '2342523', 'fbob245@email.com', 'paosih@apsoih', 1),
('Frank', 'Bob', '2342523', 'fbob245@email.com', 'paosih@apsoih', 2),
('Amy', 'Josh', '343534345', 'ajosh22@email.com', 'oaihsd@asfh', 4),
('Joyce', 'Tom', '23454323245', 'joyce33ok@email.com', 'opasih@aspoidh', 3),
('Samuel', 'Smith', '23452354', 'samsmith@torr.net', 'oiashd@aspodih', 5),
('David', 'Jungle', '2346435', 'DaveJ39595@email.com', 'opaish@aopsih', 6),
('Don', 'Dodds', '234523423', 'quack2345@somewhere.com', 'aosidh@asopid', 7);

insert into teachers(Teacher_fname, Teacher_lname, form_group_name, Teacher_work_email, Teacher_phone) VALUES
('Edward', 'Jones', 'EJ7', 'edwardj@someschool.com', '2342345'),
('Emily', 'Ford', 'EF8', 'emilyf@someschool.com', '2354234');

insert into subjects(subject_title) values
('Math'), ('English'), ('Science');

insert into form_group(teacher_id, student_id) values
(1, 1), (1, 3), (1, 5), (1, 7),
(2, 2), (2, 4), (2, 6);

insert into subjects_teachers_group(subject_class_name, subject_id, teacher_id) values
('Mathtastic', 1, 2), ('Englooosh', 2, 1);

insert into students_junc_subjects(student_id, subject_id) values
(1, 1), (2, 1), (3, 1), (4, 2), (5, 2), (6, 2), (7, 2);

insert into academic_class(subjects_teachers_group_id, student_id)
values(1, 1), (1, 2), (1, 3), (2, 4), (2, 5), (2, 6), (2, 7);

insert into guardians_addresses(first_line, county_state, postcode_zipcode, country, guardian_id) 
values('11 Hope St', 'London', 'EJ6', 'UK', 1),
('11 Hope St', 'London', 'EJ6', 'UK', 2),
('104 Canal avenue', 'Lancs', 'dunno', 'UK', 3),
('Flat 8A Block 3, somewhere', 'Hunts', 'tbc', 'UK', 4),
('Cheddar, Alders Grove, Inverness', 'Inverness', 'dunno2', 'UK', 5),
('No. 88, Embers Way, Leamington', 'Warwickshire', 'FS33', 'UK', 6),
('All Saints, Torquay Way, Torquay', 'Devonshire', 'DV73', 'UK', 7);

insert into assignments_info(assignment_title, assignment_info, max_raw_score, type_of_assessment) 
values('The makings of King Arthur', 'An essay focusing on something', 25, 'C'),
('Taming the shrew', 'Comparing film and book', 32, 'C'),
('Prep test for Calc 1', 'prep test', 70, 'T'),
('Calc 1 exam', 'end of term exam', 70, 'E');

insert into assignments_sub_by_a_teacher(assignment_entry_date, add_to_average, assignment_id, teacher_id)
values('2020-07-27', 1, 1, 1),
('2020-07-28', 1, 2, 1),
('2020-07-27', 1, 3, 2),
('2020-07-28', 1, 4, 2);

insert into student_assignments(assignment_id, raw_score, student_id) 
values(1, 20, 4), (1, 21, 5), (1, 18, 6), (1, 19, 7),
(2, 25, 4), (2, 27, 5), (2, 20, 6), (2, 30, 7),
(3, 55, 1), (3, 40, 2), (3, 60, 3),
(4, 60, 1), (4, 45, 2), (4, 66, 3);

insert into grading_groups(assignments_id) values(1), (2), (3), (4);

insert into grade_thresholds(Grading_group_id, Highest_raw_threshold, High1_raw, High2_raw, High3_raw, Lowest_raw)
values (1, 23, 20, 18, 15, 13), (2, 33, 30, 28, 26, 23), (3, 65, 60, 55, 50, 45), (4, 65, 60, 55, 50, 45);

insert into letter_grade_chars(grading_group_id, Highest_char, High1_char, High2_char, High3_char, Lowest_char)
values (1, 'A', 'B', 'C', 'D', 'E'), (2, 'A', 'B', 'C', 'D', 'E'), (3, 'a', 'b', 'c', 'd', 'e'), (4, 'a', 'b', 'c', 'd', 'e');

