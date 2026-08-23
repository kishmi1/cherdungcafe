--
-- PostgreSQL database dump
--

\restrict 0BJX0ll9XAbE1C8pWEJkvPfMPgoDITO5XNtQnQqV1LjtOHSaHeUccukS6qwvU41

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BlogStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BlogStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED'
);


ALTER TYPE public."BlogStatus" OWNER TO postgres;

--
-- Name: EnquiryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnquiryStatus" AS ENUM (
    'NEW',
    'IN_PROGRESS',
    'RESOLVED'
);


ALTER TYPE public."EnquiryStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'EDITOR'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BlogPost" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "coverImage" text,
    category text,
    tags text[],
    status public."BlogStatus" DEFAULT 'DRAFT'::public."BlogStatus" NOT NULL,
    "metaTitle" text,
    "metaDescription" text,
    "readTime" integer,
    "authorId" integer NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."BlogPost" OWNER TO postgres;

--
-- Name: BlogPost_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."BlogPost_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."BlogPost_id_seq" OWNER TO postgres;

--
-- Name: BlogPost_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."BlogPost_id_seq" OWNED BY public."BlogPost".id;


--
-- Name: Enquiry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enquiry" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    type text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status public."EnquiryStatus" DEFAULT 'NEW'::public."EnquiryStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Enquiry" OWNER TO postgres;

--
-- Name: EnquiryReply; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EnquiryReply" (
    id integer NOT NULL,
    "enquiryId" integer NOT NULL,
    message text NOT NULL,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EnquiryReply" OWNER TO postgres;

--
-- Name: EnquiryReply_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."EnquiryReply_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."EnquiryReply_id_seq" OWNER TO postgres;

--
-- Name: EnquiryReply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."EnquiryReply_id_seq" OWNED BY public."EnquiryReply".id;


--
-- Name: Enquiry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Enquiry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Enquiry_id_seq" OWNER TO postgres;

--
-- Name: Enquiry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Enquiry_id_seq" OWNED BY public."Enquiry".id;


--
-- Name: GalleryImage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GalleryImage" (
    id integer NOT NULL,
    url text NOT NULL,
    caption text,
    category text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GalleryImage" OWNER TO postgres;

--
-- Name: GalleryImage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GalleryImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GalleryImage_id_seq" OWNER TO postgres;

--
-- Name: GalleryImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GalleryImage_id_seq" OWNED BY public."GalleryImage".id;


--
-- Name: MenuItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MenuItem" (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    image text,
    price text NOT NULL,
    category text,
    "isPopular" boolean DEFAULT false NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MenuItem" OWNER TO postgres;

--
-- Name: MenuItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MenuItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MenuItem_id_seq" OWNER TO postgres;

--
-- Name: MenuItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MenuItem_id_seq" OWNED BY public."MenuItem".id;


--
-- Name: Offer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Offer" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    image text,
    discount text,
    "promoCode" text,
    "startsAt" timestamp(3) without time zone NOT NULL,
    "endsAt" timestamp(3) without time zone NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    terms text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Offer" OWNER TO postgres;

--
-- Name: Offer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Offer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Offer_id_seq" OWNER TO postgres;

--
-- Name: Offer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Offer_id_seq" OWNED BY public."Offer".id;


--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon text DEFAULT 'coffee'::text NOT NULL,
    image text,
    "priceNote" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Service_id_seq" OWNER TO postgres;

--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Service_id_seq" OWNED BY public."Service".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'EDITOR'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: BlogPost id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost" ALTER COLUMN id SET DEFAULT nextval('public."BlogPost_id_seq"'::regclass);


--
-- Name: Enquiry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enquiry" ALTER COLUMN id SET DEFAULT nextval('public."Enquiry_id_seq"'::regclass);


--
-- Name: EnquiryReply id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EnquiryReply" ALTER COLUMN id SET DEFAULT nextval('public."EnquiryReply_id_seq"'::regclass);


--
-- Name: GalleryImage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GalleryImage" ALTER COLUMN id SET DEFAULT nextval('public."GalleryImage_id_seq"'::regclass);


--
-- Name: MenuItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuItem" ALTER COLUMN id SET DEFAULT nextval('public."MenuItem_id_seq"'::regclass);


--
-- Name: Offer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Offer" ALTER COLUMN id SET DEFAULT nextval('public."Offer_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service" ALTER COLUMN id SET DEFAULT nextval('public."Service_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BlogPost" (id, title, slug, excerpt, content, "coverImage", category, tags, status, "metaTitle", "metaDescription", "readTime", "authorId", "publishedAt", "createdAt", "updatedAt") FROM stdin;
5	The Secret Behind a Great Cup of Coffee	the-secret-behind-a-great-cup-of-coffee	Great coffee starts with quality ingredients, fresh beans, and careful preparation. Discover what makes a cup of coffee truly special.	<p>A great cup of coffee begins long before it reaches your table. The quality of the beans, freshness of the ingredients, brewing method, and attention to detail all play an important role.</p><p>Freshly roasted coffee beans provide better aroma and flavor. The right grind size is equally important because it affects how quickly water extracts flavor from the coffee.</p><p>Temperature also matters. Water that is too hot can create a bitter taste, while water that is too cool may produce a weak and flat cup.</p><p>At Cherdung Café, we focus on creating balanced and enjoyable coffee for every guest. From the first aroma to the final sip, every detail matters.</p><p></p>	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787467292/blog/mxmxhzeobltphdwza5vj.jpg	Recipes	{}	PUBLISHED	The Secret Behind Great Coffee | Cherdung Café	Discover the simple secrets behind a delicious cup of coffee, from fresh beans to careful preparation.	5	1	2026-08-23 06:42:23.397	2026-08-23 06:42:23.415	2026-08-23 06:42:23.415
4	How to Choose the Perfect Coffee for Your Taste	how-to-choose-the-perfect-coffee-for-your-taste	Not sure which coffee suits your taste? Discover simple tips to choose the right coffee based on flavor, strength, and brewing style.	<p>Coffee is more than just a morning drink. Every coffee has its own flavor, aroma, and character. Whether you enjoy something strong and bold or smooth and creamy, understanding your preferences can help you choose the perfect cup.</p><p>If you prefer a rich and intense flavor, espresso-based drinks such as Americano or espresso are a great choice. For a smoother and creamier experience, cappuccino and latte are popular options.</p><p>The brewing method also affects the final taste. Freshly ground coffee, the right water temperature, and proper brewing time can make a noticeable difference.</p><p>At Cherdung Café, we believe every coffee break should be enjoyable. Take your time, explore different flavors, and find the coffee that feels just right for you.</p><p></p>	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787368890/blog/p8nnsgoocn1tca6xd1sd.jpg	Coffee Tips	{}	PUBLISHED	How to Choose the Perfect Coffee | Cherdung Café	Learn simple tips for choosing the perfect coffee based on flavor, strength, and brewing style at Cherdung Café.	5	1	2026-08-23 06:44:32.934	2026-08-22 03:24:34.021	2026-08-23 06:44:32.946
6	Making Your Special Moments Memorable at Cherdung Café	making-your-special-moments-memorable-at-cherdung-caf	From birthdays and celebrations to small gatherings, Cherdung Café provides a comfortable space for creating special memories.	<p>Special moments become even better when shared with the people you care about. Cherdung Café provides a comfortable and welcoming environment for birthdays, small celebrations, gatherings, and other memorable occasions.</p><p>Our café offers a relaxed atmosphere where guests can enjoy delicious food and beverages while spending quality time together.</p><p>Whether you are planning a simple birthday gathering or a small get-together with friends and family, our team is ready to help make the occasion enjoyable.</p><p>For event enquiries and arrangements, get in touch with Cherdung Café and let us help you plan your next gathering.</p><p></p>	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787467622/blog/uodsayqswlkcv6rnkep6.jpg	Events	{}	PUBLISHED	Events & Celebrations at Cherdung Café	 Celebrate birthdays, gatherings, and special moments at Cherdung Café with delicious food and a comfortable atmosphere.	3	1	2026-08-23 06:48:03.83	2026-08-23 06:48:03.831	2026-08-23 06:48:03.831
7	Small Choices, A Better Tomorrow	small-choices-a-better-tomorrow	Discover how simple and responsible choices can help create a more sustainable café experience for everyone.	<p>Sustainability starts with small choices. From reducing unnecessary waste to using resources responsibly, everyday actions can make a meaningful difference.</p><p>At Cherdung Café, we believe creating a welcoming café experience should also include being mindful of our environment. Simple practices such as reducing food waste, avoiding unnecessary packaging, and making responsible choices can contribute to a better future.</p><p>We also encourage our guests to make thoughtful choices whenever possible. Even small actions, when repeated every day, can have a positive impact.</p><p>Together, cafés and communities can take meaningful steps toward a cleaner and more sustainable future.</p>	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787467766/blog/aiswyqeiwbibsctjtpeu.jpg	Sustainability	{}	PUBLISHED	Sustainability at Cherdung Café | Small Choices	Learn how small responsible choices can contribute to a more sustainable and environmentally conscious café experience.	1	1	2026-08-23 06:50:28.293	2026-08-23 06:50:28.297	2026-08-23 06:50:28.297
\.


--
-- Data for Name: Enquiry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enquiry" (id, name, email, phone, type, subject, message, status, "createdAt", "updatedAt") FROM stdin;
1	Test User	test@example.com	1234567890	general	Test Enquiry	This is a test enquiry to verify the data flow	IN_PROGRESS	2026-08-21 10:05:58.584	2026-08-21 10:06:50.675
4	kinjan Gharti	kinjangharti@gmail.com	+977 9849988348	general	what is this website is about	Cherdung Café storing my enquiry details and contacting me regarding my enquiry.	RESOLVED	2026-08-21 10:13:51.995	2026-08-21 10:16:32.169
3	Jane Smith	jane@yahoo.com	5551234567	events	Private event booking	I want to book your private event space for a birthday party	IN_PROGRESS	2026-08-21 10:12:54.692	2026-08-21 10:17:12.978
5	Test Customer	testuser@gmail.com	9876543210	general	Email Test	Testing email functionality with real email address	NEW	2026-08-21 10:19:02.358	2026-08-21 10:19:02.358
6	Test Customer	testuser@gmail.com	9876543210	general	Email Test	Testing email functionality with real email address	NEW	2026-08-21 10:19:27.598	2026-08-21 10:19:27.598
7	Test Email	testuser@gmail.com	9876543210	general	Email Configuration Test	Testing email configuration and logging	NEW	2026-08-21 10:20:46.314	2026-08-21 10:20:46.314
2	John Doe	john@gmail.com	9876543210	catering	Catering for wedding	I need catering for 200 people next month	IN_PROGRESS	2026-08-21 10:12:54.23	2026-08-23 07:21:45.93
\.


--
-- Data for Name: EnquiryReply; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EnquiryReply" (id, "enquiryId", message, "sentAt") FROM stdin;
1	1	Thank you for your enquiry. We will get back to you soon.	2026-08-21 10:06:50.642
2	4	Dear Kinjan,\n\nThank you for contacting Cherdung Cafe.\n\nWe have received your enquiry and our team will get back to you shortly with the required information.\n\nIf you have any additional questions, please feel free to let us know.\n\nBest regards,\nCherdung Cafe Team\nSankhamul, Kathmandu\ncherdungcafe@gmail.com	2026-08-21 10:14:25.512
3	2	Subject: Catering Enquiry – 200 Guests\n\nHello,\n\nThank you for contacting Cherdung Café. We’d be happy to provide catering for your event of approximately 200 guests next month.\n\nPlease share your event date, location, preferred menu, and serving time so we can prepare a suitable menu and quotation for you.\n\nWe look forward to making your event special.\n\nBest regards,\nCherdung Café Team	2026-08-23 07:21:45.88
\.


--
-- Data for Name: GalleryImage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GalleryImage" (id, url, caption, category, "sortOrder", "createdAt", "updatedAt") FROM stdin;
2	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312060/gallery/d8paisajsi46sjwm1hkw.jpg	A warm and cozy view of Cherdung Cafe interior.	Interior	1	2026-08-21 11:34:26.629	2026-08-21 11:34:26.629
3	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312108/gallery/nkkkcrv4iihmzfqypz55.jpg	Freshly brewed coffee prepared by our baristas.	Food & Coffee	2	2026-08-21 11:34:51.117	2026-08-21 11:35:12.635
4	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312155/gallery/xoxeluyt1gir1fbrbya6.jpg	Our team crafting your favorite coffee with care.	Behind the Scenes	3	2026-08-21 11:36:18.942	2026-08-21 11:36:18.942
5	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312206/gallery/lwfjkyzvlbxwn8knili3.jpg	Memorable moments from a special event at Cherdung Cafe.	Interior	4	2026-08-21 11:36:57.055	2026-08-21 11:36:57.055
6	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312271/gallery/cuo4swustbltbo7jhy3a.jpg	The welcoming exterior view of Cherdung Cafe.	Exterior	4	2026-08-21 11:37:27.885	2026-08-21 11:37:55.063
7	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312304/gallery/hon340xhxqz4f27sq1cw.jpg	Freshly brewed coffee prepared by our baristas.	Food & Coffee	5	2026-08-21 11:38:34.298	2026-08-21 11:38:34.298
8	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787312341/gallery/tn6dgtvdenk2qezqec6g.jpg	A warm and cozy view of Cherdung Cafe interior.	Interior	6	2026-08-21 11:39:14.167	2026-08-21 11:39:14.167
\.


--
-- Data for Name: MenuItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MenuItem" (id, title, description, image, price, category, "isPopular", "isAvailable", "sortOrder", "createdAt", "updatedAt") FROM stdin;
20	Espresso	Rich and bold freshly brewed espresso with a smooth, intense flavor.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397218/menu/ptqouedbaxbz6bf7apmg.jpg	Rs 120	Coffee	f	t	19	2026-08-22 11:13:41.765	2026-08-22 11:13:41.765
1	Classic Cappuccino	Rich espresso topped with steamed milk and creamy foam.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787370023/menu/rk65xtiiasid7tfy6nzv.jpg	Rs 280	Coffee	t	t	0	2026-08-22 03:40:31.392	2026-08-22 11:14:41.029
5	Crispy French Fries	Golden and crispy potato fries served with a delicious dipping sauce.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787373322/menu/stytnqrtcsioymdq9gcl.jpg	Rs 180	Snacks	f	t	4	2026-08-22 04:35:28.884	2026-08-22 05:10:16.72
2	Grilled Chicken Sandwich	Grilled chicken with fresh vegetables and creamy sauce served in toasted bread.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787370072/menu/ocvj3ldm83mug0jo8wnw.jpg	Rs 350	Sandwiches	t	t	1	2026-08-22 03:41:18.476	2026-08-22 05:10:31.269
3	Classic Chicken Burger	Juicy grilled chicken patty with fresh lettuce, tomato, cheese, and special sauce served in a soft burger bun.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787370132/menu/korrvpapmwxldxwgscxp.jpg	Rs 350	Burgers	t	t	2	2026-08-22 03:42:16.923	2026-08-22 05:10:41.321
7	Masala Tea	Aromatic black tea brewed with milk and traditional spices.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394098/menu/brtqczcrstpssqqdkccb.jpg	Rs 120	Tea	f	t	6	2026-08-22 10:21:43.293	2026-08-22 10:21:43.293
8	Milk Tea	Classic Nepali-style tea prepared with rich milk and tea leaves.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394156/menu/jia5x16xjspqcemkmdeu.jpg	Rs 100	Tea	f	t	7	2026-08-22 10:22:40.622	2026-08-22 10:22:40.622
9	Green Tea	Light and refreshing green tea with a delicate natural flavor.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394218/menu/klym0joehn0y3ptajrf5.jpg	Rs 100	Tea	f	t	8	2026-08-22 10:23:41.345	2026-08-22 10:23:41.345
10	Lemon Tea	Refreshing black tea infused with fresh lemon.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394263/menu/et0vp5xkuoh09blu0ivy.jpg	Rs 110	Tea	f	t	9	2026-08-22 10:24:27.361	2026-08-22 10:24:27.361
12	Coca-Cola	Chilled Coca-Cola served refreshing and cold.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394452/menu/lz2ue48fweh40fup4292.jpg	Rs 70	Mocktails	f	t	11	2026-08-22 10:27:43.043	2026-08-22 10:27:43.043
13	Fried chicken momo	Crispy fried chicken momos with a delicious spicy coating.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394761/menu/jvgsjggrb7sjb6afjipk.jpg	Rs 220	Momo	f	t	12	2026-08-22 10:32:44.4	2026-08-22 10:32:44.4
14	C-Momo	Fried chicken momos tossed in a creamy, spicy and tangy sauce.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787394805/menu/i17f8jpsht9t6lk7jkxg.jpg	Rs 230	Momo	f	t	13	2026-08-22 10:33:28.925	2026-08-22 10:33:28.925
4	Chicken Momo	Juicy steamed chicken dumplings served with homemade spicy chutney.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787373262/menu/iu6ebolzo4b3fizw5b7e.jpg	Rs 250	Momo	t	t	3	2026-08-22 04:34:28.932	2026-08-22 10:33:43.98
6	Veg momo	Fresh vegetable dumplings served with homemade spicy chutney.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787395000/menu/kll4ocpve93cbhun9yd4.jpg	Rs 150	Momo	f	t	5	2026-08-22 05:09:17.977	2026-08-22 10:36:43.445
15	Chicken Chowmein	Fresh noodles stir-fried with chicken, seasonal vegetables, herbs, and flavorful spices.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787396779/menu/rhwrjwpus5mlpb6esslm.jpg	Rs 180	Snacks	f	t	14	2026-08-22 11:04:01.653	2026-08-22 11:06:22.18
16	Veg Chowmein	Stir-fried noodles with fresh vegetables, herbs, and flavorful spices.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787396802/menu/fjoypeqilahhwuknpeyl.jpg	Rs 160	Snacks	f	t	15	2026-08-22 11:05:00.225	2026-08-22 11:06:45.635
17	Chicken Thukpa	Comforting noodle soup with tender chicken, fresh vegetables, and aromatic herbs.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787396906/menu/f77oif6ulwdcwpp6amjj.jpg	Rs 240	Snacks	f	t	16	2026-08-22 11:08:30.953	2026-08-22 11:08:30.953
18	Veg Thukpa	\N	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397015/menu/jshvnstdx02gdihkyi6w.jpg	Rs 180	Snacks	f	t	17	2026-08-22 11:10:20.658	2026-08-22 11:10:20.658
19	Americano	Rich and bold freshly brewed espresso with a smooth, intense flavor.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397153/menu/hchapbjodeylxobwcyaj.jpg	Rs 120	Coffee	f	t	18	2026-08-22 11:11:51.054	2026-08-22 11:12:34.993
21	Strawberry Milshake	Rich and creamy chocolate milkshake topped with smooth chocolate flavor.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397621/menu/k1qkzy3xdaamqqt1atra.jpg	Rs 220	Milkshakes	f	t	20	2026-08-22 11:20:25.514	2026-08-22 11:20:25.514
11	Choclate Milshakes	Rich and creamy chocolate milkshake topped with a smooth chocolate flavor.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397697/menu/tsztuihumvu4ks9m9dyq.jpg	Rs 220	Milkshakes	f	t	10	2026-08-22 10:26:08.985	2026-08-22 11:21:39.705
22	Oreo Milshakes	Thick and creamy milkshake blended with crunchy Oreo cookies.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787397744/menu/p5r4g0w0vjrj4ydxrifo.jpg	Rs 250	Milkshakes	f	t	21	2026-08-22 11:22:28.272	2026-08-22 11:22:28.272
\.


--
-- Data for Name: Offer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Offer" (id, title, description, image, discount, "promoCode", "startsAt", "endsAt", "isFeatured", terms, "createdAt", "updatedAt") FROM stdin;
1	Morning Coffee Special	Start your day with freshly brewed coffee at a special price.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787311656/offers/rpbkquxcgl7oax5d9w9s.jpg	20%	MORNING20	2026-08-21 11:28:00	2026-08-23 11:28:00	t	Valid from 7 AM to 11 AM. One offer per customer.	2026-08-21 11:28:35.877	2026-08-21 11:28:35.877
2	Weekend Family Deal	Enjoy delicious food and refreshing beverages with your family this weekend.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787311762/offers/oag5usfsvtmbtuuwphdh.jpg	15%	FAMILY15	2026-08-21 11:29:00	2026-08-23 11:29:00	t	Valid on Saturday and Sunday only.	2026-08-21 11:29:56.311	2026-08-21 11:29:56.311
4	Student Special	Special discount for students enjoying coffee, snacks and meals at Cherdung Cafe.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787311951/offers/lgcf27pmxmgkcqem9vhn.jpg	25%	STUDENT10	2026-08-21 05:47:00	2026-08-31 05:47:00	t	Valid student ID required. Cannot be combined with other offers.	2026-08-21 11:33:04.935	2026-08-21 11:44:55.497
3	Coffee & Cake Combo	Get your favorite coffee with a delicious slice of cake at a special combo price.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787311868/offers/q4hjujg9epc2jyrbnugh.jpg	25%	CAKE25	2026-08-20 18:16:00	2026-08-22 18:16:00	t	Valid on selected coffee and cake items.	2026-08-21 11:31:52.842	2026-08-21 11:45:56.916
5	Weekend Breakfast Deal	Start your weekend with a delicious breakfast at Cherdung Café.	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787372995/offers/xm5blekpk0r5k1dnfkb2.jpg	30%	BREAKFAST15	2026-08-22 04:30:00	2026-08-23 04:30:00	t	Available every Saturday and Sunday.	2026-08-22 04:30:43.801	2026-08-22 04:30:43.801
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, title, description, icon, image, "priceNote", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
4	Meeting space	Small business meetings and group discussions.	coffee	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787395776/services/viiqe0q8zts3q1wochc6.jpg		3	t	2026-08-22 10:49:43.185	2026-08-22 10:49:43.185
6	Bakery and fresh Cakes	Fresh cakes, pastries, cookies, muffins, and other bakery treats.	utensils	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787395894/services/wnm22oyq7pcarvxnkcev.jpg		5	t	2026-08-22 10:51:36.736	2026-08-22 10:51:36.736
5	Corporate Catering	Office meetings and corporate events.	calendar	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787396209/services/gy3491skdqpagydswpog.jpg		4	t	2026-08-22 10:50:42.928	2026-08-22 10:56:53.367
7	Private Events	A cozy space for birthdays, celebrations, meetings, and gatherings.	calendar	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787396460/services/bwimeq6fyl3svdyrp5sz.jpg		6	t	2026-08-22 11:01:03.101	2026-08-22 11:01:03.101
2	Study and Work Space	Comfortable space with Wi-Fi for study/work.	utensils	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787369360/services/ms9dnqniflgyxcwmimik.jpg		0	t	2026-08-21 11:25:24.568	2026-08-23 07:23:19.761
3	Takeaway Service	Quick and convenient takeaway service for your favorite coffee, meals and snacks.	package	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787369391/services/jusdcz54laprooud8drl.jpg	Prices vary by item	0	t	2026-08-21 11:25:52.761	2026-08-23 07:23:19.858
1	Coffee & Beverages	Freshly brewed coffee, espresso, tea and refreshing beverages prepared with quality ingredients.	coffee	https://res.cloudinary.com/jfxhbjdx/image/upload/v1787369324/services/ddlaqlugxedwhtimuvsn.jpg	Starting from Rs. 150	1	t	2026-08-21 11:24:48.544	2026-08-23 07:23:19.892
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, "passwordHash", role, "createdAt", "updatedAt") FROM stdin;
1	Admin User	admin@cherdungcafe.com	$2b$10$68iC6J24V75M62//UAzUoeYgPYquxEmm/PuYjS3eyuHPnO3/R8rF.	ADMIN	2026-08-22 09:08:43.599	2026-08-22 09:08:43.599
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: BlogPost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."BlogPost_id_seq"', 7, true);


--
-- Name: EnquiryReply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."EnquiryReply_id_seq"', 3, true);


--
-- Name: Enquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Enquiry_id_seq"', 7, true);


--
-- Name: GalleryImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GalleryImage_id_seq"', 8, true);


--
-- Name: MenuItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MenuItem_id_seq"', 22, true);


--
-- Name: Offer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Offer_id_seq"', 5, true);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Service_id_seq"', 7, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: EnquiryReply EnquiryReply_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EnquiryReply"
    ADD CONSTRAINT "EnquiryReply_pkey" PRIMARY KEY (id);


--
-- Name: Enquiry Enquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enquiry"
    ADD CONSTRAINT "Enquiry_pkey" PRIMARY KEY (id);


--
-- Name: GalleryImage GalleryImage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_pkey" PRIMARY KEY (id);


--
-- Name: MenuItem MenuItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY (id);


--
-- Name: Offer Offer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Offer"
    ADD CONSTRAINT "Offer_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: BlogPost BlogPost_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EnquiryReply EnquiryReply_enquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EnquiryReply"
    ADD CONSTRAINT "EnquiryReply_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES public."Enquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 0BJX0ll9XAbE1C8pWEJkvPfMPgoDITO5XNtQnQqV1LjtOHSaHeUccukS6qwvU41

