package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
)

// DSAHandler handles DSA topic requests
type DSAHandler struct {
	dsaRepo *repository.DSARepository
}

// NewDSAHandler creates a new DSA handler
func NewDSAHandler(dsaRepo *repository.DSARepository) *DSAHandler {
	return &DSAHandler{dsaRepo: dsaRepo}
}

// GetAll handles GET /api/dsa/topics
func (h *DSAHandler) GetAll(c *fiber.Ctx) error {
	topics, err := h.dsaRepo.GetAll(c.Context())
	if err != nil {
		return utils.InternalError(c, "Failed to fetch DSA topics")
	}

	return utils.Success(c, topics)
}

// GetByID handles GET /api/dsa/topics/:id
func (h *DSAHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Topic ID is required")
	}

	topic, err := h.dsaRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch DSA topic")
	}
	if topic == nil {
		return utils.NotFound(c, "DSA topic not found")
	}

	return utils.Success(c, topic)
}

// GetCategories handles GET /api/dsa/categories
func (h *DSAHandler) GetCategories(c *fiber.Ctx) error {
	categories, err := h.dsaRepo.GetCategories(c.Context())
	if err != nil {
		return utils.InternalError(c, "Failed to fetch DSA categories")
	}

	return utils.Success(c, categories)
}
