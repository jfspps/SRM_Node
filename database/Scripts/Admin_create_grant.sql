-- this may need removing on first run since an error is given if DROP fails
DROP USER 'SRM_admin'@'localhost';

USE SRM;
-- CREATE USER username IDENTIFIED BY password

-- add the SRM-server admin (change the password as desired)
-- it is strongly advised to specifiy the host, either locally with @localhost or remotely, with @ip_address_of_server

CREATE USER 'SRM_admin'@'localhost' IDENTIFIED BY 'adminpassword';

-- grant privileges to the administrator (perform queries, and edit records) and allow the administrator to grant the same privileges to other users

GRANT SELECT, INSERT, UPDATE, DELETE ON linq.* TO 'SRM_admin'@'localhost' WITH GRANT OPTION;