-- sample guest detail
INSERT INTO guest_detail (first_name, last_name, tel)
    VALUES ('james', 'bonds', 60121234567), ('amy', 'tan', 601212345678379878), ('angela', 'yu', 123456789012)

-- sample guest_request
INSERT INTO guest_request (request_description, quantity, stay_id, main_service_id)
    VALUES ('need more towel-1', 2, 1, 1),
    ('clean room-2', 2, 2, 1),
    ('order food fried mee-3', 1, 3, 2);

-- more data into guest_request table
INSERT INTO guest_request (request_description, stay_id, main_service_id)
    VALUES ('complaint dirty room-4', 1, 3),
    ('complaint noise-5', 1, 3),
    ('ask to extend stay-6', 1, 3);

INSERT INTO guest_request (request_description, quantity, stay_id, main_service_id)
    VALUES ('need more towel-7', 2, 1, 1),
    ('clean room-8', 2, 2, 1),
    ('order food fried mee-9', 1, 3, 2);

INSERT INTO guest_request (request_description, quantity, stay_id, main_service_id)
    VALUES ('need more towel-10', 10, 2, 1),
    ('clean room-11', 2, 3, 1),
    ('order food fried mee-12', 1, 1, 2);

-- test data corresponding data into request_status
INSERT INTO request_status (acknowledged, delivered, request_id)
    VALUES ('0', '0', 1), ('0', '0', 2), ('0', '0', 3),
	('0', '0', 4), ('0', '0', 5), ('0', '0', 6),
	('0', '0', 7), ('0', '0', 8), ('0', '0', 9),
	('0', '0', 10), ('0', '0', 11), ('0', '0', 12);
	


