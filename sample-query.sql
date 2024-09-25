-- create database
CREATE DATABASE hotel;

-- create tables
CREATE TABLE service_type (
    id SERIAL PRIMARY KEY,
    main_name VARCHAR(25) UNIQUE NOT NULL,
    color VARCHAR(15)
)

INSERT INTO service_type (main_name, color)
    VALUES ('room service', 'aqua'), ('kitchen', 'olive'), ('front desk', 'teal')

CREATE TABLE sub_service_type (
    id SERIAL PRIMARY KEY,
    main_service_id INTEGER UNIQUE REFERENCES service_type(id), 
    sub_name VARCHAR(25) NOT NULL,
    UNIQUE (main_service_id, sub_name)
)

-- to alter table to add unique 2 columns value combination
ALTER TABLE sub_service_type
	ADD UNIQUE (main_service_id, sub_name);

INSERT INTO sub_service_type (main_service_id, sub_name)
    VALUES (1, 'towel request'), (2, 'food order'), (3, 'extend stay'), (3, 'enquiry'), (1, 'clean up request')

-- sample join table
SELECT main_service_id, sub_service_type.id, main_name, sub_name
FROM service_type
JOIN sub_service_type
ON service_type.id = sub_service_type.main_service_id
ORDER BY main_name ASC;

CREATE TABLE guest_detail (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(45),
  tel VARCHAR(20) UNIQUE NOT NULL
);

-- sample guest detail
INSERT INTO guest_detail (first_name, last_name, tel)
    VALUES ('james', 'bonds', 60121234567), ('amy', 'tan', 601212345678379878), ('angela', 'yu', 123456789012)

UPDATE guest_detail
	SET tel = '60121234567'
	WHERE id = 1;

CREATE TABLE guest_stay (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(25) NOT NULL, 
    guest_id INTEGER UNIQUE REFERENCES guest_detail(id),
    check_in_d TIMESTAMP WITH TIME ZONE,
    check_out_d TIMESTAMP WITH TIME ZONE,
    UNIQUE (room_number, guest_id, check_in_d)   
)
-- date sample = 19990108	ISO 8601; January 8, 1999 in any mode
-- time sample = 04:05	ISO 8601

INSERT INTO guest_stay (room_number, guest_id, check_in_d, check_out_d)
    VALUES 
    ('01-01', 1, '2024-09-19T14:46', '2024-09-26T15:46'), 
    ('02-02', 2, '2024-09-17T10:46', '2024-09-29T15:46'), 
    ('03-03', 3, '2024-09-20T13:46', '2024-09-22T08:46');
--



CREATE TABLE guest_request (
    id SERIAL PRIMARY KEY,
    request_description VARCHAR(255),
    quantity SMALLINT,
    requested_d TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
    stay_id INTEGER UNIQUE REFERENCES guest_stay(id),
    main_service_id INTEGER UNIQUE REFERENCES service_type(id),
    sub_service_id INTEGER UNIQUE REFERENCES sub_service_type(id)  
)

INSERT INTO guest_request (request_description, quantity, stay_id, main_service_id, sub_service_id)
    VALUES ('need more towel-12', 2, 1, 1, 1),
    ('clean room-12', 2, 2, 1, 5),
    ('order food fried mee-12', 1, 3, 2, 2);

-- more data ainto guest_request table
INSERT INTO guest_request (request_description, stay_id, main_service_id)
    VALUES ('complaint dirty room', 1, 3),
    ('complaint noise', 1, 3),
    ('ask to extend stay', 1, 3);

INSERT INTO guest_request (request_description, quantity, stay_id, main_service_id, sub_service_id)
    VALUES ('need more towel', 10, 2, 1, 1),
    ('clean room', 2, 3, 1, 5),
    ('order food fried mee', 1, 1, 2, 2);

CREATE TABLE request_status (
    id SERIAL PRIMARY KEY,
    acknowledged BOOLEAN,
    ack_d TIMESTAMP WITH TIME ZONE,
    delivered BOOLEAN,
    delivered_d TIMESTAMP WITH TIME ZONE,
    request_id INTEGER UNIQUE REFERENCES guest_request(id)
)


INSERT INTO request_status (acknowledged, delivered, request_id)
    VALUES ('0', '0', 13),
    ('0', '0', 14), ('0', '0', 15), ('0', '0', 16)


-- sample join table
SELECT request_description, main_service_id, sub_service_id, stay_id, delivered
FROM guest_request
JOIN request_status
ON guest_request.id = request_status.request_id

-- join 3 tables
SELECT guest_request.id, request_description, quantity, requested_d, requested_t, 
main_service_id, room_number, acknowledged, delivered
FROM guest_request
INNER JOIN guest_stay 
ON guest_request.stay_id = guest_stay.id
INNER JOIN request_status
ON guest_request.id = request_status.request_id
WHERE main_service_id = 1
ORDER BY guest_request.id ASC;

-- example 2
SELECT guest_request.id requestId, request_description, quantity, requested_d, requested_t, 
main_service_id, room_number, acknowledged, delivered, request_status.id statusId
FROM guest_request
INNER JOIN guest_stay 
ON guest_request.stay_id = guest_stay.id
INNER JOIN request_status
ON guest_request.id = request_status.request_id
WHERE main_service_id = 3 AND delivered = true
ORDER BY guest_request.id ASC;

-- test data---no corresponding request_status---not show
INSERT INTO guest_request (request_description, stay_id, main_service_id)
    VALUES ('complaint 20240911-10', 1, 3),
    ('complaint 20240911-11', 2, 3),
    ('request 20240911-12', 3, 3);

-- test data corresponding data into request_status
INSERT INTO request_status (acknowledged, delivered, request_id)
    VALUES ('0', '0', 1), ('0', '0', 2), ('0', '0', 3),
	('0', '0', 6), ('0', '0', 5), ('0', '0', 4),
	('0', '0', 7), ('0', '0', 8), ('0', '0', 9),
	('0', '0', 10), ('0', '0', 11), ('0', '0', 12),
	('0', '0', 13), ('0', '0', 14), ('0', '0', 15), ('0', '0', 16);

UPDATE request_status
    SET acknowledged = false, delivered = false
    WHERE request_id = 1;

-- set all service request with status false to show up all request in web
UPDATE request_status
    SET acknowledged = false, delivered = false;

-- create food_menu
CREATE TABLE food_menu (
    id SERIAL PRIMARY KEY,
    food_title VARCHAR(40) UNIQUE,
    food_description VARCHAR(300),
    food_type VARCHAR(20),
    price FLOAT
);

