DROP DATABASE IF EXISTS everlist_db;
CREATE DATABASE everlist_db;
USE everlist_db;

-- Create the table plans.
CREATE TABLE list
(
id int NOT NULL AUTO_INCREMENT,
list_item varchar(255) NOT NULL,
PRIMARY KEY (id)
);

-- Insert a set of records.
INSERT INTO list (list_item) VALUES ("This is where we store notes!");