--
-- PostgreSQL database dump
--

\restrict Ec4NP34meANWEig5i5VQcKAbCDzlSS3Np0FMPQgG0SJ0WZ0FwzbFnjZRGCFM2fF

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-15 07:20:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16792)
-- Name: email_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_notifications (
    id integer NOT NULL,
    user_id integer,
    event_id integer,
    email_type character varying(50) NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'sent'::character varying
);


ALTER TABLE public.email_notifications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16791)
-- Name: email_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 225
-- Name: email_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_notifications_id_seq OWNED BY public.email_notifications.id;


--
-- TOC entry 220 (class 1259 OID 16742)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    location character varying(255),
    date timestamp without time zone NOT NULL,
    organizer_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16741)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 224 (class 1259 OID 16777)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    registration_id integer,
    stripe_payment_id character varying(255),
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16776)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 223
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 222 (class 1259 OID 16757)
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    event_id integer,
    user_id integer,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16756)
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO postgres;

--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 221
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- TOC entry 218 (class 1259 OID 16731)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['organizer'::character varying, 'attendee'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16730)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4772 (class 2604 OID 16795)
-- Name: email_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_notifications ALTER COLUMN id SET DEFAULT nextval('public.email_notifications_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 16745)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 16780)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 16760)
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 16734)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4950 (class 0 OID 16792)
-- Dependencies: 226
-- Data for Name: email_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_notifications (id, user_id, event_id, email_type, sent_at, status) FROM stdin;
\.


--
-- TOC entry 4944 (class 0 OID 16742)
-- Dependencies: 220
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, location, date, organizer_id, created_at) FROM stdin;
11	High On The Holyghost	Praise, Worship and Word	Black Star Centre, Accra	2025-11-22 10:00:00	9	2025-10-14 07:28:15.766865
12	144 Hours Of Praise	A Praise and Worship Concert for 6 days.	Logos Rhema	2025-10-20 18:00:00	9	2025-10-14 07:29:10.44734
13	ADEC 2025	Annual Destiny Empowerment Conference, this is a yearly program of the church Mountain Of Destiny Empowerment Ministry.	Opposite Reg-Emmanuel Building, Labadi, Accra	2025-10-31 17:00:00	9	2025-10-14 07:30:38.891101
\.


--
-- TOC entry 4948 (class 0 OID 16777)
-- Dependencies: 224
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, registration_id, stripe_payment_id, amount, currency, status, created_at) FROM stdin;
\.


--
-- TOC entry 4946 (class 0 OID 16757)
-- Dependencies: 222
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrations (id, event_id, user_id, registered_at) FROM stdin;
8	11	10	2025-10-14 07:31:20.508036
9	12	10	2025-10-14 07:40:02.734378
\.


--
-- TOC entry 4942 (class 0 OID 16731)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, email, password, role, created_at) FROM stdin;
9	Segun	Odumeso	segunodumeso@hotmail.com	$2a$10$LNssXjkjqAdHZgpSlvH5cOw6qcF3I6ZBzMsZelL4zVRPg78vNSVGq	organizer	2025-10-14 07:26:59.797869
10	Test	User	testuser@example.com	$2a$10$xIabviGPUowwdW9NQkPhQupsYxJtQAycqtgXZFeOpUSj8gMdi5Vee	attendee	2025-10-14 07:31:11.643721
\.


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 225
-- Name: email_notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_notifications_id_seq', 1, false);


--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 219
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 13, true);


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 223
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 221
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 9, true);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- TOC entry 4789 (class 2606 OID 16799)
-- Name: email_notifications email_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16750)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 16785)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4783 (class 2606 OID 16765)
-- Name: registrations registrations_event_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_event_id_user_id_key UNIQUE (event_id, user_id);


--
-- TOC entry 4785 (class 2606 OID 16763)
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 16740)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4779 (class 2606 OID 16738)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 16805)
-- Name: email_notifications email_notifications_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 4795 (class 2606 OID 16800)
-- Name: email_notifications email_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_notifications
    ADD CONSTRAINT email_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4790 (class 2606 OID 16751)
-- Name: events events_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id);


--
-- TOC entry 4793 (class 2606 OID 16786)
-- Name: payments payments_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_registration_id_fkey FOREIGN KEY (registration_id) REFERENCES public.registrations(id);


--
-- TOC entry 4791 (class 2606 OID 16766)
-- Name: registrations registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 4792 (class 2606 OID 16771)
-- Name: registrations registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-10-15 07:20:22

--
-- PostgreSQL database dump complete
--

\unrestrict Ec4NP34meANWEig5i5VQcKAbCDzlSS3Np0FMPQgG0SJ0WZ0FwzbFnjZRGCFM2fF

