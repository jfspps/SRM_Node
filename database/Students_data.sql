use linq;

insert into students(Student_fname, Student_lname, Student_mid_initials, Student_email, Student_phone)
values('James', 'Bob', 'T', 'jamesbob@email.com', '02973432'),
('Jane', 'Bob', 'L M', 'jane12432@email.com', '534534'),
('Tim', 'Tom', '', 'timetomtam@tim.co.uk', '2039402934'),
('Jake', 'Josh', 'P S', 'whizbang@pop.com', '353453453'),
('Chris', 'Smith', 'O', 'chris@someplace.com', '029347823'),
('Jill', 'Jungle', 'E', '', '230493894'),
('Sam', 'Dodds', 'A', 'samdodds21@threo.net', '123097234');

SELECT 
    *
FROM
    students;