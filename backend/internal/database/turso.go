package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// DB wraps the database connection
type DB struct {
	*sql.DB
}

// Config holds database configuration
type Config struct {
	URL       string
	AuthToken string
}

// Connect establishes a connection to Turso database or local SQLite
func Connect(cfg Config) (*DB, error) {
	var db *sql.DB
	var err error

	// Check if using local SQLite (for testing)
	if cfg.URL == "file:local.db" || cfg.URL == "" {
		db, err = sql.Open("sqlite3", "./local.db")
	} else {
		// Turso connection
		connStr := fmt.Sprintf("%s?authToken=%s", cfg.URL, cfg.AuthToken)
		db, err = sql.Open("libsql", connStr)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetConnMaxIdleTime(10 * time.Minute)

	// Verify connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{db}, nil
}

// Close closes the database connection
func (db *DB) Close() error {
	return db.DB.Close()
}

// Health checks database health
func (db *DB) Health() error {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	return db.PingContext(ctx)
}
