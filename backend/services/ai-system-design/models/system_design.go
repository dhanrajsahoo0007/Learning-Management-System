package models

import "time"

// SystemDesignTopic represents a System Design or AI System Design topic
type SystemDesignTopic struct {
	ID          string              `json:"id" db:"id"`
	Title       string              `json:"title" db:"title"`
	Description string              `json:"description" db:"description"`
	Difficulty  string              `json:"difficulty" db:"difficulty"` // Beginner, Intermediate, Advanced
	Progress    int                 `json:"progress" db:"progress"`
	Icon        string              `json:"icon" db:"icon"`
	Color       string              `json:"color" db:"color"`
	Content     SystemDesignContent `json:"content"` // Stored as JSON in DB
	IsAITopic   bool                `json:"isAITopic" db:"is_ai_topic"`
	CreatedAt   time.Time           `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time           `json:"updated_at" db:"updated_at"`
}

// SystemDesignContent represents the detailed content of a system design topic
type SystemDesignContent struct {
	Overview string             `json:"overview"`
	Concepts []string           `json:"concepts"`
	Steps    []SystemDesignStep `json:"steps"`
	Examples []string           `json:"examples"`
}

// SystemDesignStep represents a step in the system design process
type SystemDesignStep struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Diagram     string `json:"diagram,omitempty"`
}
