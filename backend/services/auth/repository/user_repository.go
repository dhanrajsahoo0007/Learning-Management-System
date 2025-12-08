package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/auth/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
)

// UserRepository handles user database operations
type UserRepository struct {
	db *database.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *database.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create creates a new user
func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (email, password_hash, name, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?)
		RETURNING id
	`

	now := time.Now()
	err := r.db.QueryRowContext(
		ctx, query,
		user.Email, user.PasswordHash, user.Name, now, now,
	).Scan(&user.ID)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	user.CreatedAt = now
	user.UpdatedAt = now
	return nil
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE email = ?
	`

	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.Name,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	return user, nil
}

// FindByID finds a user by ID
func (r *UserRepository) FindByID(ctx context.Context, id int64) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, updated_at
		FROM users
		WHERE id = ?
	`

	user := &models.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.Name,
		&user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	return user, nil
}

// Update updates a user
func (r *UserRepository) Update(ctx context.Context, user *models.User) error {
	query := `
		UPDATE users
		SET name = ?, updated_at = ?
		WHERE id = ?
	`

	now := time.Now()
	_, err := r.db.ExecContext(ctx, query, user.Name, now, user.ID)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	user.UpdatedAt = now
	return nil
}
