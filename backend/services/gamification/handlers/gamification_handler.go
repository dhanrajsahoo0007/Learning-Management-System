package handlers

import (
	"log"

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
	clerkUserID, ok := middleware.GetClerkUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := h.gamificationRepo.GetInternalUserID(c.Context(), clerkUserID)
	if err != nil {
		log.Printf("❌ GetInternalUserID Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to resolve user")
	}

	stats, err := h.gamificationRepo.GetStats(c.Context(), userID)
	if err != nil {
		log.Printf("❌ GetStats Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to fetch gamification stats")
	}

	return utils.SuccessResponse(c, stats)
}

// AddXP handles POST /api/gamification/xp (protected)
func (h *GamificationHandler) AddXP(c *fiber.Ctx) error {
	clerkUserID, ok := middleware.GetClerkUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := h.gamificationRepo.GetInternalUserID(c.Context(), clerkUserID)
	if err != nil {
		log.Printf("❌ GetInternalUserID Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to resolve user")
	}

	var req models.AddXPRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.Amount <= 0 {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Amount must be positive")
	}

	stats, err := h.gamificationRepo.AddXP(c.Context(), userID, req.Amount)
	if err != nil {
		log.Printf("❌ AddXP Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to add XP")
	}

	return utils.SuccessResponse(c, stats)
}

// UnlockAchievement handles POST /api/gamification/achievements (protected)
func (h *GamificationHandler) UnlockAchievement(c *fiber.Ctx) error {
	clerkUserID, ok := middleware.GetClerkUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := h.gamificationRepo.GetInternalUserID(c.Context(), clerkUserID)
	if err != nil {
		log.Printf("❌ GetInternalUserID Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to resolve user")
	}

	var req models.UnlockAchievementRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.AchievementID == "" || req.Title == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Achievement ID and title are required")
	}

	achievement := &models.Achievement{
		UserID:        userID,
		AchievementID: req.AchievementID,
		Title:         req.Title,
		Description:   req.Description,
		Icon:          req.Icon,
		Rarity:        req.Rarity,
	}

	if err := h.gamificationRepo.UnlockAchievement(c.Context(), achievement); err != nil {
		log.Printf("❌ UnlockAchievement Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to unlock achievement")
	}

	return utils.SuccessResponse(c, achievement)
}

// UpdateStreak handles POST /api/gamification/streak (protected)
func (h *GamificationHandler) UpdateStreak(c *fiber.Ctx) error {
	clerkUserID, ok := middleware.GetClerkUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := h.gamificationRepo.GetInternalUserID(c.Context(), clerkUserID)
	if err != nil {
		log.Printf("❌ GetInternalUserID Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to resolve user")
	}

	stats, err := h.gamificationRepo.UpdateStreak(c.Context(), userID)
	if err != nil {
		log.Printf("❌ UpdateStreak Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update streak")
	}

	return utils.SuccessResponse(c, stats)
}

// UpdateProgress handles POST /api/progress (protected)
func (h *GamificationHandler) UpdateProgress(c *fiber.Ctx) error {
	clerkUserID, ok := middleware.GetClerkUserID(c)
	if !ok {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "User not authenticated")
	}

	userID, err := h.gamificationRepo.GetInternalUserID(c.Context(), clerkUserID)
	if err != nil {
		log.Printf("❌ GetInternalUserID Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to resolve user")
	}

	var req models.UpdateProgressRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	if req.TopicID == "" || req.TopicType == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Topic ID and type are required")
	}

	progress := &models.UserProgress{
		UserID:    userID,
		TopicID:   req.TopicID,
		TopicType: req.TopicType,
		Progress:  req.Progress,
		Completed: req.Progress >= 100,
	}

	if err := h.gamificationRepo.UpdateProgress(c.Context(), progress); err != nil {
		log.Printf("❌ UpdateProgress Error: %v", err)
		return utils.ErrorResponse(c, fiber.StatusInternalServerError, "Failed to update progress")
	}

	return utils.SuccessResponse(c, progress)
}
