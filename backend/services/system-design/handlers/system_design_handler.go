package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/system-design/repository"
)

// SystemDesignHandler handles system design topic requests
type SystemDesignHandler struct {
	systemDesignRepo *repository.SystemDesignRepository
}

// NewSystemDesignHandler creates a new system design handler
func NewSystemDesignHandler(systemDesignRepo *repository.SystemDesignRepository) *SystemDesignHandler {
	return &SystemDesignHandler{systemDesignRepo: systemDesignRepo}
}

// GetAll handles GET /topics
func (h *SystemDesignHandler) GetAll(c *fiber.Ctx) error {
	topics, err := h.systemDesignRepo.GetAll(c.Context())
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, topics)
}

// GetByID handles GET /topics/:id
func (h *SystemDesignHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Topic ID is required")
	}

	topic, err := h.systemDesignRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if topic == nil {
		return utils.NotFoundResponse(c, "System design topic")
	}

	return utils.SuccessResponse(c, topic)
}
