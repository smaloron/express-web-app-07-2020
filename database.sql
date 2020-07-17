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
    title VARCHAR(80),
    created_at DATE NOT NULL,
    user_id SMALLINT UNSIGNED NOT NULL,
    parent_id INT UNSIGNED,
    picture VARCHAR(80),
    PRIMARY KEY (id),
    CONSTRAINT messages_to_users
        FOREIGN KEY (user_id)
        REFERENCES users(id),
    CONSTRAINT messages_to_parent
        FOREIGN KEY (parent_id)
        REFERENCES messages(id)
);

-- Insertion d'un utilisateur
INSERT INTO users (user_name, email, user_password)
VALUES
('Seb', 'seb@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Seve', 'sev@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Maev', 'maev@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa'),
('Alice', 'alice@mail.com', '$2b$04$sUu6pzV8bcfW3dotEABxp.BvEZWifd36kTyizmHnTRsTcsZh2QqNa');

INSERT INTO messages (title, content, created_at, user_id, parent_id)
VALUES
('Un premier message', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque gravida dui in sodales porttitor. Proin bibendum tellus tortor, sed laoreet tellus dapibus at. Sed ultrices erat ut arcu lobortis malesuada. Ut volutpat suscipit nisi in lobortis. Proin feugiat tincidunt purus.', '2020-07-06', 1, null),
(NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque gravida dui in sodales porttitor. Proin bibendum tellus tortor, sed laoreet tellus dapibus at. Sed ultrices erat ut arcu lobortis malesuada. Ut volutpat suscipit nisi in lobortis. Proin feugiat tincidunt purus.', '2020-07-06', 2, 1),
(NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque gravida dui in sodales porttitor. Proin bibendum tellus tortor, sed laoreet tellus dapibus at. Sed ultrices erat ut arcu lobortis malesuada. Ut volutpat suscipit nisi in lobortis. Proin feugiat tincidunt purus.', '2020-07-06', 3, 1),
('Un autre message', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque gravida dui in sodales porttitor. Proin bibendum tellus tortor, sed laoreet tellus dapibus at. Sed ultrices erat ut arcu lobortis malesuada. Ut volutpat suscipit nisi in lobortis. Proin feugiat tincidunt purus.', '2020-07-06', 4, null);

-- Création de la vue
CREATE OR REPLACE VIEW view_message AS 
    SELECT 
    m.*, 
    DATE_FORMAT(m.created_at, '%d/%m/%Y') as date_fr,
    u.user_name as author,
    COUNT(answers.id) as answer_count
    FROM messages as m
    INNER JOIN users as u ON u.id = m.user_id
    LEFT JOIN messages as answers ON m.id = answers.parent_id
    GROUP BY m.id;
