package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/ai-system-design/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

// AISystemDesignHandler handles AI system design topic requests
type AISystemDesignHandler struct {
	aiSystemDesignRepo *repository.AISystemDesignRepository
}

// NewAISystemDesignHandler creates a new AI system design handler
func NewAISystemDesignHandler(aiSystemDesignRepo *repository.AISystemDesignRepository) *AISystemDesignHandler {
	return &AISystemDesignHandler{aiSystemDesignRepo: aiSystemDesignRepo}
}

// GetAll handles GET /topics
func (h *AISystemDesignHandler) GetAll(c *fiber.Ctx) error {
	topics, err := h.aiSystemDesignRepo.GetAll(c.Context())
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, topics)
}

// GetByID handles GET /topics/:id
func (h *AISystemDesignHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Topic ID is required")
	}

	topic, err := h.aiSystemDesignRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if topic == nil {
		return utils.NotFoundResponse(c, "AI system design topic")
	}

	return utils.SuccessResponse(c, topic)
}
