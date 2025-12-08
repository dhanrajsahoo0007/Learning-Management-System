package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
)

// SystemDesignHandler handles system design topic requests
type SystemDesignHandler struct {
	systemDesignRepo *repository.SystemDesignRepository
}

// NewSystemDesignHandler creates a new system design handler
func NewSystemDesignHandler(systemDesignRepo *repository.SystemDesignRepository) *SystemDesignHandler {
	return &SystemDesignHandler{systemDesignRepo: systemDesignRepo}
}

// GetAll handles GET /api/system-design/topics
func (h *SystemDesignHandler) GetAll(c *fiber.Ctx) error {
	topics, err := h.systemDesignRepo.GetAll(c.Context(), false)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch system design topics")
	}

	return utils.Success(c, topics)
}

// GetAllAI handles GET /api/ai-system-design/topics
func (h *SystemDesignHandler) GetAllAI(c *fiber.Ctx) error {
	topics, err := h.systemDesignRepo.GetAll(c.Context(), true)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch AI system design topics")
	}

	return utils.Success(c, topics)
}

// GetByID handles GET /api/system-design/topics/:id
func (h *SystemDesignHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Topic ID is required")
	}

	topic, err := h.systemDesignRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch system design topic")
	}
	if topic == nil {
		return utils.NotFound(c, "System design topic not found")
	}

	return utils.Success(c, topic)
}
