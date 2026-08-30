-- One row per file in backend/services/dsa/content, including files that are
-- still empty (status 'pending'), so the curriculum order stays visible.
CREATE TABLE IF NOT EXISTS dsa_problems (
    -- Slug of the path relative to the content root, e.g.
    -- graphs/dfs-story-based/introduction-to-graph-traversal/number-of-provinces
    id           TEXT PRIMARY KEY,
    topic_id     TEXT NOT NULL,
    title        TEXT NOT NULL,
    -- JSON array of folder titles between the topic and the file.
    section_path TEXT NOT NULL DEFAULT '[]',
    statement    TEXT NOT NULL DEFAULT '',
    constraints  TEXT NOT NULL DEFAULT '',
    notes        TEXT NOT NULL DEFAULT '',
    examples     TEXT NOT NULL DEFAULT '[]',
    solutions    TEXT NOT NULL DEFAULT '[]',
    -- Denormalised so the list endpoint never has to read solution bodies.
    solution_count INTEGER NOT NULL DEFAULT 0,
    difficulty   TEXT NOT NULL DEFAULT '',
    status       TEXT NOT NULL DEFAULT 'pending',
    source_file  TEXT NOT NULL DEFAULT '',
    -- Zero-padded per-segment key; ORDER BY sort_key reproduces disk order.
    sort_key     TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dsa_problems_topic ON dsa_problems (topic_id, sort_key);
