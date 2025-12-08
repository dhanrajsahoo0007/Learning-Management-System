package models

import "time"

// Certification represents a cloud certification
type Certification struct {
	ID               string        `json:"id" db:"id"`
	Title            string        `json:"title" db:"title"`
	Provider         string        `json:"provider" db:"provider"` // AWS, Azure, GCP, Kubernetes, Terraform, Docker
	Level            string        `json:"level" db:"level"`       // Foundational, Associate, Professional, Expert
	Description      string        `json:"description" db:"description"`
	Logo             string        `json:"logo" db:"logo"`
	Color            string        `json:"color" db:"color"`
	CompletedModules int           `json:"completedModules" db:"completed_modules"`
	TotalModules     int           `json:"totalModules" db:"total_modules"`
	EstimatedHours   int           `json:"estimatedHours" db:"estimated_hours"`
	Difficulty       string        `json:"difficulty" db:"difficulty"` // Beginner, Intermediate, Advanced
	Roadmap          []RoadmapItem `json:"roadmap"`                    // Stored as JSON in DB
	CreatedAt        time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time     `json:"updated_at" db:"updated_at"`
}

// RoadmapItem represents an item in the certification roadmap
type RoadmapItem struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Type      string `json:"type"` // video, reading, practice, exam
	Duration  string `json:"duration"`
	Completed bool   `json:"completed"`
	Content   string `json:"content,omitempty"`
}

// Progress represents the progress structure for frontend
type Progress struct {
	CompletedModules int `json:"completedModules"`
	TotalModules     int `json:"totalModules"`
}

// GetProgress returns the progress structure
func (c *Certification) GetProgress() Progress {
	return Progress{
		CompletedModules: c.CompletedModules,
		TotalModules:     c.TotalModules,
	}
}

// CertificationProvider represents a certification provider
type CertificationProvider struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}
