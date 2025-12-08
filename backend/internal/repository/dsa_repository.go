package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/models"
)

// DSARepository handles DSA topic database operations
type DSARepository struct {
	db *database.DB
}

// NewDSARepository creates a new DSA repository
func NewDSARepository(db *database.DB) *DSARepository {
	return &DSARepository{db: db}
}

// GetAll retrieves all DSA topics
func (r *DSARepository) GetAll(ctx context.Context) ([]models.DSATopic, error) {
	query := `
		SELECT id, title, category, description, difficulty, progress, icon, color,
		       folder_path, problem_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		ORDER BY category, title
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA topics: %w", err)
	}
	defer rows.Close()

	var topics []models.DSATopic
	for rows.Next() {
		var topic models.DSATopic
		var subcomponentsJSON, contentJSON string

		err := rows.Scan(
			&topic.ID, &topic.Title, &topic.Category, &topic.Description,
			&topic.Difficulty, &topic.Progress, &topic.Icon, &topic.Color,
			&topic.FolderPath, &topic.ProblemCount, &subcomponentsJSON, &contentJSON,
			&topic.CreatedAt, &topic.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan DSA topic: %w", err)
		}

		// Parse JSON fields
		if subcomponentsJSON != "" {
			json.Unmarshal([]byte(subcomponentsJSON), &topic.Subcomponents)
		}
		if contentJSON != "" {
			json.Unmarshal([]byte(contentJSON), &topic.Content)
		}

		topics = append(topics, topic)
	}

	return topics, nil
}

// GetByID retrieves a DSA topic by ID
func (r *DSARepository) GetByID(ctx context.Context, id string) (*models.DSATopic, error) {
	query := `
		SELECT id, title, category, description, difficulty, progress, icon, color,
		       folder_path, problem_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		WHERE id = ?
	`

	var topic models.DSATopic
	var subcomponentsJSON, contentJSON string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&topic.ID, &topic.Title, &topic.Category, &topic.Description,
		&topic.Difficulty, &topic.Progress, &topic.Icon, &topic.Color,
		&topic.FolderPath, &topic.ProblemCount, &subcomponentsJSON, &contentJSON,
		&topic.CreatedAt, &topic.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA topic: %w", err)
	}

	// Parse JSON fields
	if subcomponentsJSON != "" {
		json.Unmarshal([]byte(subcomponentsJSON), &topic.Subcomponents)
	}
	if contentJSON != "" {
		json.Unmarshal([]byte(contentJSON), &topic.Content)
	}

	return &topic, nil
}

// GetByCategory retrieves DSA topics by category
func (r *DSARepository) GetByCategory(ctx context.Context, category string) ([]models.DSATopic, error) {
	query := `
		SELECT id, title, category, description, difficulty, progress, icon, color,
		       folder_path, problem_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		WHERE category = ?
		ORDER BY title
	`

	rows, err := r.db.QueryContext(ctx, query, category)
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA topics by category: %w", err)
	}
	defer rows.Close()

	var topics []models.DSATopic
	for rows.Next() {
		var topic models.DSATopic
		var subcomponentsJSON, contentJSON string

		err := rows.Scan(
			&topic.ID, &topic.Title, &topic.Category, &topic.Description,
			&topic.Difficulty, &topic.Progress, &topic.Icon, &topic.Color,
			&topic.FolderPath, &topic.ProblemCount, &subcomponentsJSON, &contentJSON,
			&topic.CreatedAt, &topic.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan DSA topic: %w", err)
		}

		// Parse JSON fields
		if subcomponentsJSON != "" {
			json.Unmarshal([]byte(subcomponentsJSON), &topic.Subcomponents)
		}
		if contentJSON != "" {
			json.Unmarshal([]byte(contentJSON), &topic.Content)
		}

		topics = append(topics, topic)
	}

	return topics, nil
}

// GetCategories retrieves all unique DSA categories
func (r *DSARepository) GetCategories(ctx context.Context) ([]models.DSACategory, error) {
	query := `
		SELECT category, COUNT(*) as count
		FROM dsa_topics
		GROUP BY category
		ORDER BY category
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA categories: %w", err)
	}
	defer rows.Close()

	var categories []models.DSACategory
	for rows.Next() {
		var category models.DSACategory
		if err := rows.Scan(&category.Name, &category.Count); err != nil {
			return nil, fmt.Errorf("failed to scan category: %w", err)
		}
		categories = append(categories, category)
	}

	return categories, nil
}
