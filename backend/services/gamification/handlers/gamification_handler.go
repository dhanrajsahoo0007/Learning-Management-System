package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gamification/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gamification/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

// GamificationHandler handles gamification requests
type GamificationHandler struct {
	gamificationRepo *repository.GamificationRepository
}

// NewGamificationHandler creates a new gamification handler
func NewGamificationHandler(gamificationRepo *repository.GamificationRepository) *GamificationHandler {
	return &GamificationHandler{gamificationRepo: gamificationRepo}
}

// GetStats handles GET /api/gamification/stats (protected)
func (h *GamificationHandler) GetStats(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	stats, err := h.gamificationRepo.GetStats(c.Context(), int64(userID))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch gamification stats")
	}

	return utils.SuccessResponse(c, stats)
}

// AddXP handles POST /api/gamification/xp (protected)
func (h *GamificationHandler) AddXP(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	var req models.AddXPRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Amount <= 0 {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Amount must be positive")
	}

	stats, err := h.gamificationRepo.AddXP(c.Context(), int64(userID), req.Amount)
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to add XP")
	}

	return utils.SuccessResponse(c, stats)
}

// UnlockAchievement handles POST /api/gamification/achievements (protected)
func (h *GamificationHandler) UnlockAchievement(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	var req models.UnlockAchievementRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.AchievementID == "" || req.Title == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Achievement ID and title are required")
	}

	achievement := &models.Achievement{
		UserID:        int64(userID),
		AchievementID: req.AchievementID,
		Title:         req.Title,
		Description:   req.Description,
		Icon:          req.Icon,
		Rarity:        req.Rarity,
	}

	if err := h.gamificationRepo.UnlockAchievement(c.Context(), achievement); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to unlock achievement")
	}

	return utils.SuccessResponse(c, achievement)
}

// UpdateStreak handles POST /api/gamification/streak (protected)
func (h *GamificationHandler) UpdateStreak(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	stats, err := h.gamificationRepo.UpdateStreak(c.Context(), int64(userID))
	if err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update streak")
	}

	return utils.SuccessResponse(c, stats)
}

// UpdateProgress handles POST /api/progress (protected)
func (h *GamificationHandler) UpdateProgress(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	var req models.UpdateProgressRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.TopicID == "" || req.TopicType == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Topic ID and type are required")
	}

	progress := &models.UserProgress{
		UserID:    int64(userID),
		TopicID:   req.TopicID,
		TopicType: req.TopicType,
		Progress:  req.Progress,
		Completed: req.Progress >= 100,
	}

	if err := h.gamificationRepo.UpdateProgress(c.Context(), progress); err != nil {
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update progress")
	}

	return utils.SuccessResponse(c, progress)
}
