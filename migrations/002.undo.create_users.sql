ALTER TABLE projects
    DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS users;