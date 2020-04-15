use linq;

insert into guardians(guardian_fname, guardian_lname, guardian_phone, guardian_email, guardian_2nd_email, student_id) 
values('Frank', 'Bob', '2342523', 'fbob245@email.com', 'paosih@apsoih', 1),
('Frank', 'Bob', '2342523', 'fbob245@email.com', 'paosih@apsoih', 2),
('Amy', 'Josh', '343534345', 'ajosh22@email.com', 'oaihsd@asfh', 3),
('Joyce', 'Tom', '23454323245', 'joyce33ok@email.com', 'opasih@aspoidh', 4),
('Samuel', 'Smith', '23452354', 'samsmith@torr.net', 'oiashd@aspodih', 5),
('David', 'Jungle', '2346435', 'DaveJ39595@email.com', 'opaish@aopsih', 6),
('Don', 'Dodds', '234523423', 'quack2345@somewhere.com', 'aosidh@asopid', 7);

SELECT 
    *
FROM
    guardians;