package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/dsa/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

// DSAHandler handles DSA topic requests
type DSAHandler struct {
	dsaRepo *repository.DSARepository
}

// NewDSAHandler creates a new DSA handler
func NewDSAHandler(dsaRepo *repository.DSARepository) *DSAHandler {
	return &DSAHandler{dsaRepo: dsaRepo}
}

// GetAll handles GET /topics
func (h *DSAHandler) GetAll(c *fiber.Ctx) error {
	topics, err := h.dsaRepo.GetAll(c.Context())
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, topics)
}

// GetByID handles GET /topics/:id
func (h *DSAHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Topic ID is required")
	}

	topic, err := h.dsaRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if topic == nil {
		return utils.NotFoundResponse(c, "DSA topic")
	}

	return utils.SuccessResponse(c, topic)
}

// GetCategories handles GET /categories
func (h *DSAHandler) GetCategories(c *fiber.Ctx) error {
	categories, err := h.dsaRepo.GetCategories(c.Context())
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, categories)
}
