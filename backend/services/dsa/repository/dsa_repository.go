package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/dsa/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
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
		       folder_path, problem_count, solved_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		ORDER BY folder_path
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
			&topic.FolderPath, &topic.ProblemCount, &topic.SolvedCount, &subcomponentsJSON, &contentJSON,
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
		       folder_path, problem_count, solved_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		WHERE id = ?
	`

	var topic models.DSATopic
	var subcomponentsJSON, contentJSON string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&topic.ID, &topic.Title, &topic.Category, &topic.Description,
		&topic.Difficulty, &topic.Progress, &topic.Icon, &topic.Color,
		&topic.FolderPath, &topic.ProblemCount, &topic.SolvedCount, &subcomponentsJSON, &contentJSON,
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
		       folder_path, problem_count, solved_count, subcomponents, content, created_at, updated_at
		FROM dsa_topics
		WHERE category = ?
		ORDER BY folder_path
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
			&topic.FolderPath, &topic.ProblemCount, &topic.SolvedCount, &subcomponentsJSON, &contentJSON,
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

// GetProblemsByTopic retrieves the ordered problem list for a topic. Statements
// and solution bodies are excluded so that a large topic such as Graphs, with
// 149 problems, stays a small response.
func (r *DSARepository) GetProblemsByTopic(ctx context.Context, topicID string) ([]models.DSAProblemSummary, error) {
	query := `
		SELECT id, topic_id, title, section_path, difficulty, status, sort_key,
		       solution_count, LENGTH(statement) > 0
		FROM dsa_problems
		WHERE topic_id = ?
		ORDER BY sort_key
	`

	rows, err := r.db.QueryContext(ctx, query, topicID)
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA problems: %w", err)
	}
	defer rows.Close()

	problems := []models.DSAProblemSummary{}
	for rows.Next() {
		var problem models.DSAProblemSummary
		var sectionPathJSON string
		var hasStatement int

		if err := rows.Scan(
			&problem.ID, &problem.TopicID, &problem.Title, &sectionPathJSON,
			&problem.Difficulty, &problem.Status, &problem.SortKey,
			&problem.SolutionCount, &hasStatement,
		); err != nil {
			return nil, fmt.Errorf("failed to scan DSA problem: %w", err)
		}

		problem.SectionPath = []string{}
		if sectionPathJSON != "" {
			json.Unmarshal([]byte(sectionPathJSON), &problem.SectionPath)
		}
		problem.HasSolution = problem.SolutionCount > 0
		problem.HasStatement = hasStatement == 1

		problems = append(problems, problem)
	}

	return problems, rows.Err()
}

// GetProblemByID retrieves a single problem with its statement and every
// solution variant.
func (r *DSARepository) GetProblemByID(ctx context.Context, id string) (*models.DSAProblem, error) {
	query := `
		SELECT id, topic_id, title, section_path, statement, constraints, notes,
		       examples, solutions, difficulty, status, source_file, sort_key
		FROM dsa_problems
		WHERE id = ?
	`

	var problem models.DSAProblem
	var sectionPathJSON, examplesJSON, solutionsJSON string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&problem.ID, &problem.TopicID, &problem.Title, &sectionPathJSON,
		&problem.Statement, &problem.Constraints, &problem.Notes,
		&examplesJSON, &solutionsJSON, &problem.Difficulty, &problem.Status,
		&problem.SourceFile, &problem.SortKey,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query DSA problem: %w", err)
	}

	problem.SectionPath = []string{}
	problem.Examples = []models.DSAExample{}
	problem.Solutions = []models.DSASolution{}
	if sectionPathJSON != "" {
		json.Unmarshal([]byte(sectionPathJSON), &problem.SectionPath)
	}
	if examplesJSON != "" {
		json.Unmarshal([]byte(examplesJSON), &problem.Examples)
	}
	if solutionsJSON != "" {
		json.Unmarshal([]byte(solutionsJSON), &problem.Solutions)
	}

	return &problem, nil
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
