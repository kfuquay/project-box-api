CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

ALTER TABLE projects
    ADD COLUMN 
    user_id INTEGER REFERENCES users
    (id)
    ON DELETE SET NULL;