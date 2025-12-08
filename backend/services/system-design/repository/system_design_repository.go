package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/system-design/models"
)

// SystemDesignRepository handles system design topic database operations
type SystemDesignRepository struct {
	db *database.DB
}

// NewSystemDesignRepository creates a new system design repository
func NewSystemDesignRepository(db *database.DB) *SystemDesignRepository {
	return &SystemDesignRepository{db: db}
}

// GetAll retrieves all system design topics (non-AI topics)
func (r *SystemDesignRepository) GetAll(ctx context.Context) ([]models.SystemDesignTopic, error) {
	query := `
		SELECT id, title, description, difficulty, progress, icon, color,
		       content, is_ai_topic, created_at, updated_at
		FROM system_design_topics
		WHERE is_ai_topic = false
		ORDER BY title
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query system design topics: %w", err)
	}
	defer rows.Close()

	var topics []models.SystemDesignTopic
	for rows.Next() {
		var topic models.SystemDesignTopic
		var contentJSON string

		err := rows.Scan(
			&topic.ID, &topic.Title, &topic.Description, &topic.Difficulty,
			&topic.Progress, &topic.Icon, &topic.Color, &contentJSON,
			&topic.IsAITopic, &topic.CreatedAt, &topic.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan system design topic: %w", err)
		}

		// Parse JSON content
		if contentJSON != "" {
			json.Unmarshal([]byte(contentJSON), &topic.Content)
		}

		topics = append(topics, topic)
	}

	return topics, nil
}

// GetByID retrieves a system design topic by ID
func (r *SystemDesignRepository) GetByID(ctx context.Context, id string) (*models.SystemDesignTopic, error) {
	query := `
		SELECT id, title, description, difficulty, progress, icon, color,
		       content, is_ai_topic, created_at, updated_at
		FROM system_design_topics
		WHERE id = ?
	`

	var topic models.SystemDesignTopic
	var contentJSON string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&topic.ID, &topic.Title, &topic.Description, &topic.Difficulty,
		&topic.Progress, &topic.Icon, &topic.Color, &contentJSON,
		&topic.IsAITopic, &topic.CreatedAt, &topic.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query system design topic: %w", err)
	}

	// Parse JSON content
	if contentJSON != "" {
		json.Unmarshal([]byte(contentJSON), &topic.Content)
	}

	return &topic, nil
}
