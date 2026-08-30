-- Captures the dsa_topics shape that was previously created out of band, so
-- the schema is finally in version control. Existing databases are untouched.
CREATE TABLE IF NOT EXISTS dsa_topics (
    id            TEXT PRIMARY KEY,
    title         TEXT NOT NULL,
    category      TEXT NOT NULL DEFAULT '',
    description   TEXT NOT NULL DEFAULT '',
    difficulty    TEXT NOT NULL DEFAULT 'Medium',
    progress      INTEGER NOT NULL DEFAULT 0,
    icon          TEXT NOT NULL DEFAULT '',
    color         TEXT NOT NULL DEFAULT '',
    folder_path   TEXT NOT NULL DEFAULT '',
    problem_count INTEGER NOT NULL DEFAULT 0,
    subcomponents TEXT NOT NULL DEFAULT '[]',
    content       TEXT NOT NULL DEFAULT '{}',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
