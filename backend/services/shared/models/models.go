package models

import "time"

// User represents a user in the system
type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// HealthStatus represents the health status of a service
type HealthStatus struct {
	Service  string `json:"service"`
	Status   string `json:"status"`
	Database string `json:"database,omitempty"`
	Version  string `json:"version,omitempty"`
}
