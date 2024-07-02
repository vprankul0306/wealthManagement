INSERT INTO role (name) VALUES ('ROLE_USER');
INSERT INTO role (name) VALUES ('ROLE_ADMIN');

INSERT INTO user (username, password, email, role_id) VALUES ('user1', 'password1', 'user1@example.com', 1);
INSERT INTO user (username, password, email, role_id) VALUES ('admin', 'adminpass', 'admin@example.com', 2);