DROP DATABASE IF EXISTS forum;

CREATE DATABASE forum DEFAULT CHARACTER SET utf8;

USE forum;

CREATE TABLE users (
    id SMALLINT UNSIGNED AUTO_INCREMENT,
    user_name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    user_password VARCHAR(128) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE messages (
    id INT UNSIGNED AUTO_INCREMENT,
    content TEXT NOT NULL,
    title VARCHAR(80) NOT NULL,
    created_at DATE NOT NULL,
    user_id SMALLINT UNSIGNED NOT NULL,
    picture VARCHAR(80),
    PRIMARY KEY (id),
    CONSTRAINT messages_to_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- Insertion d'un utilisateur
INSERT INTO users (user_name, email, user_password)
VALUES
('Seb', 'seb@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa');

-- Création de la vue
CREATE OR REPLACE VIEW view_message AS 
    SELECT 
    m.*, 
    DATE_FORMAT(m.created_at, '%d/%m/%Y') as date_fr,
    u.user_name as author
    FROM messages as m
    INNER JOIN users as u ON u.id = m.user_id;
