-- Tracks how many of a topic's problems actually have a solution, so the UI can
-- show "10 / 32" without counting rows on every request. Kept separate from
-- 000 so databases created before this column also pick it up.
ALTER TABLE dsa_topics ADD COLUMN solved_count INTEGER NOT NULL DEFAULT 0;
