--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-09-27 21:13:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

-- CREATE SCHEMA public;


-- ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16747)
-- Name: food_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_menu (
    id integer NOT NULL,
    food_title character varying(40),
    food_description character varying(300),
    food_type character varying(20),
    price double precision
);


ALTER TABLE public.food_menu OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16746)
-- Name: food_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.food_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.food_menu_id_seq OWNER TO postgres;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 227
-- Name: food_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.food_menu_id_seq OWNED BY public.food_menu.id;


--
-- TOC entry 220 (class 1259 OID 16654)
-- Name: guest_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guest_detail (
    id integer NOT NULL,
    first_name character varying(45) NOT NULL,
    last_name character varying(45),
    tel character varying(20)
);


ALTER TABLE public.guest_detail OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16653)
-- Name: guest_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guest_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_detail_id_seq OWNER TO postgres;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 219
-- Name: guest_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guest_detail_id_seq OWNED BY public.guest_detail.id;


--
-- TOC entry 224 (class 1259 OID 16691)
-- Name: guest_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guest_request (
    id integer NOT NULL,
    request_description character varying(255),
    quantity smallint,
    stay_id integer,
    main_service_id integer,
    requested_d timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.guest_request OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16690)
-- Name: guest_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guest_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_request_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 223
-- Name: guest_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guest_request_id_seq OWNED BY public.guest_request.id;


--
-- TOC entry 222 (class 1259 OID 16677)
-- Name: guest_stay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guest_stay (
    id integer NOT NULL,
    room_number character varying(25) NOT NULL,
    guest_id integer,
    check_in_d timestamp with time zone,
    check_out_d timestamp with time zone
);


ALTER TABLE public.guest_stay OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16676)
-- Name: guest_stay_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.guest_stay_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guest_stay_id_seq OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 221
-- Name: guest_stay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.guest_stay_id_seq OWNED BY public.guest_stay.id;


--
-- TOC entry 226 (class 1259 OID 16726)
-- Name: request_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request_status (
    id integer NOT NULL,
    acknowledged boolean,
    ack_d timestamp with time zone,
    delivered boolean,
    delivered_d timestamp with time zone,
    request_id integer
);


ALTER TABLE public.request_status OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16725)
-- Name: request_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.request_status_id_seq OWNER TO postgres;

--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 225
-- Name: request_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_status_id_seq OWNED BY public.request_status.id;


--
-- TOC entry 216 (class 1259 OID 16631)
-- Name: service_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_type (
    id integer NOT NULL,
    main_name character varying(25) NOT NULL,
    color character varying(15)
);


ALTER TABLE public.service_type OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16630)
-- Name: service_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_type_id_seq OWNER TO postgres;

--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 215
-- Name: service_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_type_id_seq OWNED BY public.service_type.id;


--
-- TOC entry 218 (class 1259 OID 16640)
-- Name: sub_service_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sub_service_type (
    id integer NOT NULL,
    main_service_id integer,
    sub_name character varying(25) NOT NULL
);


ALTER TABLE public.sub_service_type OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16639)
-- Name: sub_service_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sub_service_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sub_service_type_id_seq OWNER TO postgres;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 217
-- Name: sub_service_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sub_service_type_id_seq OWNED BY public.sub_service_type.id;


--
-- TOC entry 3283 (class 2604 OID 16750)
-- Name: food_menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_menu ALTER COLUMN id SET DEFAULT nextval('public.food_menu_id_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 16657)
-- Name: guest_detail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_detail ALTER COLUMN id SET DEFAULT nextval('public.guest_detail_id_seq'::regclass);


--
-- TOC entry 3280 (class 2604 OID 16694)
-- Name: guest_request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_request ALTER COLUMN id SET DEFAULT nextval('public.guest_request_id_seq'::regclass);


--
-- TOC entry 3279 (class 2604 OID 16680)
-- Name: guest_stay id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_stay ALTER COLUMN id SET DEFAULT nextval('public.guest_stay_id_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 16729)
-- Name: request_status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status ALTER COLUMN id SET DEFAULT nextval('public.request_status_id_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 16634)
-- Name: service_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_type ALTER COLUMN id SET DEFAULT nextval('public.service_type_id_seq'::regclass);


--
-- TOC entry 3277 (class 2604 OID 16643)
-- Name: sub_service_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_service_type ALTER COLUMN id SET DEFAULT nextval('public.sub_service_type_id_seq'::regclass);


--
-- TOC entry 3303 (class 2606 OID 16754)
-- Name: food_menu food_menu_food_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_menu
    ADD CONSTRAINT food_menu_food_title_key UNIQUE (food_title);


--
-- TOC entry 3305 (class 2606 OID 16752)
-- Name: food_menu food_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_menu
    ADD CONSTRAINT food_menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3293 (class 2606 OID 16659)
-- Name: guest_detail guest_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_detail
    ADD CONSTRAINT guest_detail_pkey PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 16696)
-- Name: guest_request guest_request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_request
    ADD CONSTRAINT guest_request_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 16682)
-- Name: guest_stay guest_stay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_stay
    ADD CONSTRAINT guest_stay_pkey PRIMARY KEY (id);


--
-- TOC entry 3299 (class 2606 OID 16731)
-- Name: request_status request_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status
    ADD CONSTRAINT request_status_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 16733)
-- Name: request_status request_status_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status
    ADD CONSTRAINT request_status_request_id_key UNIQUE (request_id);


--
-- TOC entry 3285 (class 2606 OID 16638)
-- Name: service_type service_type_main_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_type
    ADD CONSTRAINT service_type_main_name_key UNIQUE (main_name);


--
-- TOC entry 3287 (class 2606 OID 16636)
-- Name: service_type service_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_type
    ADD CONSTRAINT service_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3289 (class 2606 OID 16647)
-- Name: sub_service_type sub_service_type_main_service_id_sub_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_service_type
    ADD CONSTRAINT sub_service_type_main_service_id_sub_name_key UNIQUE (main_service_id, sub_name);


--
-- TOC entry 3291 (class 2606 OID 16645)
-- Name: sub_service_type sub_service_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_service_type
    ADD CONSTRAINT sub_service_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3308 (class 2606 OID 16702)
-- Name: guest_request guest_request_main_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_request
    ADD CONSTRAINT guest_request_main_service_id_fkey FOREIGN KEY (main_service_id) REFERENCES public.service_type(id);


--
-- TOC entry 3309 (class 2606 OID 16697)
-- Name: guest_request guest_request_stay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_request
    ADD CONSTRAINT guest_request_stay_id_fkey FOREIGN KEY (stay_id) REFERENCES public.guest_stay(id);


--
-- TOC entry 3307 (class 2606 OID 16685)
-- Name: guest_stay guest_stay_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guest_stay
    ADD CONSTRAINT guest_stay_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.guest_detail(id);


--
-- TOC entry 3310 (class 2606 OID 16734)
-- Name: request_status request_status_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request_status
    ADD CONSTRAINT request_status_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.guest_request(id);


--
-- TOC entry 3306 (class 2606 OID 16648)
-- Name: sub_service_type sub_service_type_main_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sub_service_type
    ADD CONSTRAINT sub_service_type_main_service_id_fkey FOREIGN KEY (main_service_id) REFERENCES public.service_type(id);


-- Completed on 2024-09-27 21:13:13

--
-- PostgreSQL database dump complete
--

