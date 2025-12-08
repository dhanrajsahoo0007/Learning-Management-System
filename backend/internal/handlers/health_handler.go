package handlers

import (
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
	"github.com/gofiber/fiber/v2"
)

// HealthHandler handles health check requests
type HealthHandler struct {
	db *database.DB
}

// NewHealthHandler creates a new health handler
func NewHealthHandler(db *database.DB) *HealthHandler {
	return &HealthHandler{db: db}
}

// Check handles GET /api/health
func (h *HealthHandler) Check(c *fiber.Ctx) error {
	// Check database health
	dbHealthy := true
	if err := h.db.Health(); err != nil {
		dbHealthy = false
	}

	status := "healthy"
	if !dbHealthy {
		status = "degraded"
	}

	return utils.Success(c, fiber.Map{
		"status":   status,
		"database": dbHealthy,
		"service":  "learning-management-backend",
		"version":  "1.0.0",
	})
}
