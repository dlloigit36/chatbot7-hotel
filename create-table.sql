-- Table: public.guest_detail

-- DROP TABLE IF EXISTS public.guest_detail;

CREATE TABLE IF NOT EXISTS public.guest_detail
(
    id integer NOT NULL DEFAULT nextval('guest_detail_id_seq'::regclass),
    first_name character varying(45) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(45) COLLATE pg_catalog."default",
    tel character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT guest_detail_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.guest_detail
    OWNER to postgres;

-- Table: public.service_type

-- DROP TABLE IF EXISTS public.service_type;

CREATE TABLE IF NOT EXISTS public.service_type
(
    id integer NOT NULL DEFAULT nextval('service_type_id_seq'::regclass),
    main_name character varying(25) COLLATE pg_catalog."default" NOT NULL,
    color character varying(15) COLLATE pg_catalog."default",
    CONSTRAINT service_type_pkey PRIMARY KEY (id),
    CONSTRAINT service_type_main_name_key UNIQUE (main_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.service_type
    OWNER to postgres;

-- Table: public.guest_stay

-- DROP TABLE IF EXISTS public.guest_stay;

CREATE TABLE IF NOT EXISTS public.guest_stay
(
    id integer NOT NULL DEFAULT nextval('guest_stay_id_seq'::regclass),
    room_number character varying(25) COLLATE pg_catalog."default" NOT NULL,
    guest_id integer,
    check_in_d timestamp with time zone,
    check_out_d timestamp with time zone,
    CONSTRAINT guest_stay_pkey PRIMARY KEY (id),
    CONSTRAINT guest_stay_guest_id_fkey FOREIGN KEY (guest_id)
        REFERENCES public.guest_detail (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.guest_stay
    OWNER to postgres;

-- Table: public.guest_request

-- DROP TABLE IF EXISTS public.guest_request;

CREATE TABLE IF NOT EXISTS public.guest_request
(
    id integer NOT NULL DEFAULT nextval('guest_request_id_seq'::regclass),
    request_description character varying(255) COLLATE pg_catalog."default",
    quantity smallint,
    stay_id integer,
    main_service_id integer,
    requested_d timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT guest_request_pkey PRIMARY KEY (id),
    CONSTRAINT guest_request_main_service_id_fkey FOREIGN KEY (main_service_id)
        REFERENCES public.service_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT guest_request_stay_id_fkey FOREIGN KEY (stay_id)
        REFERENCES public.guest_stay (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.guest_request
    OWNER to postgres;

-- Table: public.request_status

-- DROP TABLE IF EXISTS public.request_status;

CREATE TABLE IF NOT EXISTS public.request_status
(
    id integer NOT NULL DEFAULT nextval('request_status_id_seq'::regclass),
    acknowledged boolean,
    ack_d timestamp with time zone,
    delivered boolean,
    delivered_d timestamp with time zone,
    request_id integer,
    CONSTRAINT request_status_pkey PRIMARY KEY (id),
    CONSTRAINT request_status_request_id_key UNIQUE (request_id),
    CONSTRAINT request_status_request_id_fkey FOREIGN KEY (request_id)
        REFERENCES public.guest_request (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request_status
    OWNER to postgres;

-- Table: public.food_menu

-- DROP TABLE IF EXISTS public.food_menu;

CREATE TABLE IF NOT EXISTS public.food_menu
(
    id integer NOT NULL DEFAULT nextval('food_menu_id_seq'::regclass),
    food_title character varying(40) COLLATE pg_catalog."default",
    food_description character varying(300) COLLATE pg_catalog."default",
    food_type character varying(20) COLLATE pg_catalog."default",
    price double precision,
    CONSTRAINT food_menu_pkey PRIMARY KEY (id),
    CONSTRAINT food_menu_food_title_key UNIQUE (food_title)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.food_menu
    OWNER to postgres;

