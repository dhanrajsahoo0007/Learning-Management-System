package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
)

// AuthHandler handles authentication requests
type AuthHandler struct {
	userRepo         *repository.UserRepository
	gamificationRepo *repository.GamificationRepository
	jwtSecret        string
	jwtExpiry        time.Duration
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(userRepo *repository.UserRepository, gamificationRepo *repository.GamificationRepository, jwtSecret string, jwtExpiry time.Duration) *AuthHandler {
	return &AuthHandler{
		userRepo:         userRepo,
		gamificationRepo: gamificationRepo,
		jwtSecret:        jwtSecret,
		jwtExpiry:        jwtExpiry,
	}
}

// Register handles POST /api/auth/register
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req models.UserRegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate input
	if !utils.IsValidEmail(req.Email) {
		return utils.ValidationError(c, fiber.Map{"email": "Invalid email format"})
	}

	if valid, msg := utils.IsValidPassword(req.Password); !valid {
		return utils.ValidationError(c, fiber.Map{"password": msg})
	}

	if valid, msg := utils.IsValidName(req.Name); !valid {
		return utils.ValidationError(c, fiber.Map{"name": msg})
	}

	// Check if user already exists
	existing, err := h.userRepo.FindByEmail(c.Context(), req.Email)
	if err != nil {
		return utils.InternalError(c, "Failed to check existing user")
	}
	if existing != nil {
		return utils.Error(c, fiber.StatusConflict, "User with this email already exists")
	}

	// Hash password
	passwordHash, err := models.HashPassword(req.Password)
	if err != nil {
		return utils.InternalError(c, "Failed to hash password")
	}

	// Create user
	user := &models.User{
		Email:        req.Email,
		PasswordHash: passwordHash,
		Name:         req.Name,
	}

	if err := h.userRepo.Create(c.Context(), user); err != nil {
		return utils.InternalError(c, "Failed to create user")
	}

	// Initialize gamification stats for new user
	_, err = h.gamificationRepo.GetStats(c.Context(), user.ID)
	if err != nil {
		// Log error but don't fail registration
		// Stats will be created on first access
	}

	// Generate JWT token
	token, err := h.generateToken(user)
	if err != nil {
		return utils.InternalError(c, "Failed to generate token")
	}

	return utils.Success(c, fiber.Map{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Login handles POST /api/auth/login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.UserLoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate input
	if !utils.IsValidEmail(req.Email) {
		return utils.ValidationError(c, fiber.Map{"email": "Invalid email format"})
	}

	// Find user
	user, err := h.userRepo.FindByEmail(c.Context(), req.Email)
	if err != nil {
		return utils.InternalError(c, "Failed to find user")
	}
	if user == nil {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid email or password")
	}

	// Check password
	if !models.CheckPassword(req.Password, user.PasswordHash) {
		return utils.Error(c, fiber.StatusUnauthorized, "Invalid email or password")
	}

	// Generate JWT token
	token, err := h.generateToken(user)
	if err != nil {
		return utils.InternalError(c, "Failed to generate token")
	}

	return utils.Success(c, fiber.Map{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Me handles GET /api/auth/me (protected)
func (h *AuthHandler) Me(c *fiber.Ctx) error {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return utils.Unauthorized(c, "User not authenticated")
	}

	user, err := h.userRepo.FindByID(c.Context(), userID)
	if err != nil {
		return utils.InternalError(c, "Failed to find user")
	}
	if user == nil {
		return utils.NotFound(c, "User not found")
	}

	return utils.Success(c, user.ToResponse())
}

// generateToken generates a JWT token for a user
func (h *AuthHandler) generateToken(user *models.User) (string, error) {
	claims := &models.JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(h.jwtExpiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.jwtSecret))
}
