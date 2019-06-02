CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    materials TEXT[],
    steps TEXT []
);