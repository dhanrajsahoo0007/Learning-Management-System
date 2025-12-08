package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/models"
)

// CertificationRepository handles certification database operations
type CertificationRepository struct {
	db *database.DB
}

// NewCertificationRepository creates a new certification repository
func NewCertificationRepository(db *database.DB) *CertificationRepository {
	return &CertificationRepository{db: db}
}

// GetAll retrieves all certifications
func (r *CertificationRepository) GetAll(ctx context.Context) ([]models.Certification, error) {
	query := `
		SELECT id, title, provider, level, description, logo, color,
		       completed_modules, total_modules, estimated_hours, difficulty,
		       roadmap, created_at, updated_at
		FROM certifications
		ORDER BY provider, title
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query certifications: %w", err)
	}
	defer rows.Close()

	var certifications []models.Certification
	for rows.Next() {
		var cert models.Certification
		var roadmapJSON string

		err := rows.Scan(
			&cert.ID, &cert.Title, &cert.Provider, &cert.Level, &cert.Description,
			&cert.Logo, &cert.Color, &cert.CompletedModules, &cert.TotalModules,
			&cert.EstimatedHours, &cert.Difficulty, &roadmapJSON,
			&cert.CreatedAt, &cert.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan certification: %w", err)
		}

		// Parse JSON roadmap
		if roadmapJSON != "" {
			json.Unmarshal([]byte(roadmapJSON), &cert.Roadmap)
		}

		certifications = append(certifications, cert)
	}

	return certifications, nil
}

// GetByID retrieves a certification by ID
func (r *CertificationRepository) GetByID(ctx context.Context, id string) (*models.Certification, error) {
	query := `
		SELECT id, title, provider, level, description, logo, color,
		       completed_modules, total_modules, estimated_hours, difficulty,
		       roadmap, created_at, updated_at
		FROM certifications
		WHERE id = ?
	`

	var cert models.Certification
	var roadmapJSON string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&cert.ID, &cert.Title, &cert.Provider, &cert.Level, &cert.Description,
		&cert.Logo, &cert.Color, &cert.CompletedModules, &cert.TotalModules,
		&cert.EstimatedHours, &cert.Difficulty, &roadmapJSON,
		&cert.CreatedAt, &cert.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query certification: %w", err)
	}

	// Parse JSON roadmap
	if roadmapJSON != "" {
		json.Unmarshal([]byte(roadmapJSON), &cert.Roadmap)
	}

	return &cert, nil
}

// GetProviders retrieves all unique certification providers
func (r *CertificationRepository) GetProviders(ctx context.Context) ([]models.CertificationProvider, error) {
	query := `
		SELECT provider, COUNT(*) as count
		FROM certifications
		GROUP BY provider
		ORDER BY provider
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query providers: %w", err)
	}
	defer rows.Close()

	var providers []models.CertificationProvider
	for rows.Next() {
		var provider models.CertificationProvider
		if err := rows.Scan(&provider.Name, &provider.Count); err != nil {
			return nil, fmt.Errorf("failed to scan provider: %w", err)
		}
		providers = append(providers, provider)
	}

	return providers, nil
}
