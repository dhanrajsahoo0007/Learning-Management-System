package database

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"github.com/tursodatabase/libsql-client-go/libsql"
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

// Connect establishes a connection to the database
func Connect(cfg Config) (*DB, error) {
	var db *sql.DB
	var err error

	// Check if using Turso (remote) or local SQLite
	if cfg.AuthToken != "" {
		// Turso connection
		connector, err := libsql.NewConnector(cfg.URL, libsql.WithAuthToken(cfg.AuthToken))
		if err != nil {
			return nil, fmt.Errorf("failed to create connector: %w", err)
		}
		db = sql.OpenDB(connector)
	} else {
		// Local SQLite connection
		db, err = sql.Open("sqlite3", cfg.URL)
		if err != nil {
			return nil, fmt.Errorf("failed to open database: %w", err)
		}
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DB{db}, nil
}

// ExecContext executes a query without returning any rows
func (db *DB) ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return db.DB.ExecContext(ctx, query, args...)
}

// QueryContext executes a query that returns rows
func (db *DB) QueryContext(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return db.DB.QueryContext(ctx, query, args...)
}

// QueryRowContext executes a query that returns at most one row
func (db *DB) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return db.DB.QueryRowContext(ctx, query, args...)
}

// Close closes the database connection
func (db *DB) Close() error {
	return db.DB.Close()
}

// HealthCheck verifies the database connection is healthy
func (db *DB) HealthCheck(ctx context.Context) error {
	return db.DB.PingContext(ctx)
}
