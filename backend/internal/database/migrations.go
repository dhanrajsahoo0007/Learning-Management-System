package database

import (
	"context"
	"fmt"
)

// RunMigrations executes all database migrations
func (db *DB) RunMigrations() error {
	ctx := context.Background()

	migrations := []string{
		createUsersTable,
		createDSATopicsTable,
		createSystemDesignTopicsTable,
		createCertificationsTable,
		createUserProgressTable,
		createGamificationStatsTable,
		createAchievementsTable,
		createIndexes,
	}

	for i, migration := range migrations {
		if _, err := db.ExecContext(ctx, migration); err != nil {
			return fmt.Errorf("migration %d failed: %w", i+1, err)
		}
	}

	return nil
}

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	name TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

const createDSATopicsTable = `
CREATE TABLE IF NOT EXISTS dsa_topics (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	category TEXT NOT NULL,
	description TEXT NOT NULL,
	difficulty TEXT NOT NULL,
	progress INTEGER DEFAULT 0,
	icon TEXT NOT NULL,
	color TEXT NOT NULL,
	folder_path TEXT NOT NULL,
	problem_count INTEGER NOT NULL,
	subcomponents TEXT, -- JSON array
	content TEXT NOT NULL, -- JSON object with explanation, examples, codeTemplates, etc.
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

const createSystemDesignTopicsTable = `
CREATE TABLE IF NOT EXISTS system_design_topics (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	difficulty TEXT NOT NULL,
	progress INTEGER DEFAULT 0,
	icon TEXT NOT NULL,
	color TEXT NOT NULL,
	content TEXT NOT NULL, -- JSON object with overview, concepts, steps, examples
	is_ai_topic BOOLEAN DEFAULT FALSE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

const createCertificationsTable = `
CREATE TABLE IF NOT EXISTS certifications (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	provider TEXT NOT NULL,
	level TEXT NOT NULL,
	description TEXT NOT NULL,
	logo TEXT NOT NULL,
	color TEXT NOT NULL,
	completed_modules INTEGER DEFAULT 0,
	total_modules INTEGER NOT NULL,
	estimated_hours INTEGER NOT NULL,
	difficulty TEXT NOT NULL,
	roadmap TEXT NOT NULL, -- JSON array of roadmap items
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`

const createUserProgressTable = `
CREATE TABLE IF NOT EXISTS user_progress (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	topic_id TEXT NOT NULL,
	topic_type TEXT NOT NULL, -- 'dsa', 'system_design', 'certification'
	progress INTEGER DEFAULT 0,
	completed BOOLEAN DEFAULT FALSE,
	completed_at DATETIME,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(user_id, topic_id, topic_type)
);
`

const createGamificationStatsTable = `
CREATE TABLE IF NOT EXISTS gamification_stats (
	user_id INTEGER PRIMARY KEY,
	level INTEGER DEFAULT 1,
	xp INTEGER DEFAULT 0,
	xp_to_next_level INTEGER DEFAULT 100,
	streak INTEGER DEFAULT 0,
	total_points INTEGER DEFAULT 0,
	last_activity_date DATE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`

const createAchievementsTable = `
CREATE TABLE IF NOT EXISTS achievements (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	achievement_id TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	icon TEXT NOT NULL,
	rarity TEXT NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
	unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	UNIQUE(user_id, achievement_id)
);
`

const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_dsa_topics_category ON dsa_topics(category);
CREATE INDEX IF NOT EXISTS idx_system_design_topics_difficulty ON system_design_topics(difficulty);
CREATE INDEX IF NOT EXISTS idx_certifications_provider ON certifications(provider);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic ON user_progress(topic_id, topic_type);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
`
