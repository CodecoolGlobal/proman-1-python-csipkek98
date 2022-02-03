--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop constraints
---

ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_cards_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_cards_status_id CASCADE;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS archive;

---
--- create tables
---
CREATE TABLE board_columns (
    board_id    INTEGER 	     NOT NULL,
    status_id   INTEGER	     NOT NULL,
);

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

CREATE TABLE archive (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

CREATE TABLE users (
    id          SERIAL PRIMARY KEY NOT NULL,
    name        TEXT,
    password    TEXT,
    registered  timestamp without time zone,
    email       TEXT
);
---
--- insert data
---

INSERT INTO users VALUES (nextval('users_id_seq'), 'admin', '$2b$12$Rp1a9lkPt5dTtgZTUH4GxOHMJ.3BB5lCg/Ao5C18q/dAsjiJk70uK', '1000-01-01 00:00:00', 'admin@mail.com');

INSERT INTO board_columns VALUES (1, 1);
INSERT INTO board_columns VALUES (1, 2);
INSERT INTO board_columns VALUES (1, 3);
INSERT INTO board_columns VALUES (1, 4);
INSERT INTO board_columns VALUES (2, 1);
INSERT INTO board_columns VALUES (2, 2);
INSERT INTO board_columns VALUES (2, 3);
INSERT INTO board_columns VALUES (2, 4);


INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');
INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 2);

INSERT INTO archive VALUES (13, 2, 8, 'done card 1', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
    
ALTER TABLE ONLY board_columns
    ADD CONSTRAINT fk_board_columns_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY board_columns
    ADD CONSTRAINT fk_board_columns_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;
    
