-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.3-beta1
-- PostgreSQL version: 13.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: postgres | type: DATABASE --
-- DROP DATABASE IF EXISTS postgres;
CREATE DATABASE postgres
	ENCODING = 'UTF8'
	LC_COLLATE = 'en_US.utf8'
	LC_CTYPE = 'en_US.utf8'
	TABLESPACE = pg_default
	OWNER = postgres;
-- ddl-end --
COMMENT ON DATABASE postgres IS E'default administrative connection database';
-- ddl-end --


-- object: perfilme | type: SCHEMA --
-- DROP SCHEMA IF EXISTS perfilme CASCADE;
CREATE SCHEMA perfilme;
-- ddl-end --
ALTER SCHEMA perfilme OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,perfilme;
-- ddl-end --

-- object: perfilme.user_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS perfilme.user_id_seq CASCADE;
CREATE SEQUENCE perfilme.user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE perfilme.user_id_seq OWNER TO postgres;
-- ddl-end --

-- object: perfilme."user" | type: TABLE --
-- DROP TABLE IF EXISTS perfilme."user" CASCADE;
CREATE TABLE perfilme."user" (
	id integer NOT NULL DEFAULT nextval('perfilme.user_id_seq'::regclass),
	name character varying(80) NOT NULL,
	description character varying(255),
	photo_path character varying(500),
	password character varying(100) NOT NULL,
	email character varying(80) NOT NULL,
	username character varying(60) NOT NULL,
	created_at timestamp NOT NULL,
	update_at timestamp,
	CONSTRAINT user_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE perfilme."user" OWNER TO postgres;
-- ddl-end --

-- object: perfilme.links_id_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS perfilme.links_id_seq CASCADE;
CREATE SEQUENCE perfilme.links_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE perfilme.links_id_seq OWNER TO postgres;
-- ddl-end --

-- object: perfilme.links | type: TABLE --
-- DROP TABLE IF EXISTS perfilme.links CASCADE;
CREATE TABLE perfilme.links (
	id integer NOT NULL DEFAULT nextval('perfilme.links_id_seq'::regclass),
	custom_name character varying(100) NOT NULL,
	id_user integer NOT NULL,
	link varchar(400) NOT NULL,
	photo_url varchar(500) NOT NULL,
	CONSTRAINT links_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE perfilme.links OWNER TO postgres;
-- ddl-end --

-- object: perfilme.type_link_code_seq | type: SEQUENCE --
-- DROP SEQUENCE IF EXISTS perfilme.type_link_code_seq CASCADE;
CREATE SEQUENCE perfilme.type_link_code_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START WITH 1
	CACHE 1
	NO CYCLE
	OWNED BY NONE;

-- ddl-end --
ALTER SEQUENCE perfilme.type_link_code_seq OWNER TO postgres;
-- ddl-end --

-- object: user_fk | type: CONSTRAINT --
-- ALTER TABLE perfilme.links DROP CONSTRAINT IF EXISTS user_fk CASCADE;
ALTER TABLE perfilme.links ADD CONSTRAINT user_fk FOREIGN KEY (id_user)
REFERENCES perfilme."user" (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "grant_CU_eb94f049ac" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO postgres;
-- ddl-end --

-- object: "grant_CU_cd8e46e7b6" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA public
   TO PUBLIC;
-- ddl-end --


