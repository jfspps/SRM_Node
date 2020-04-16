use linq;

select * from guardians_addresses;

select guardian_fname, guardian_lname, first_line, country from guardians_addresses join guardians on Guardian_id = idGuardians;