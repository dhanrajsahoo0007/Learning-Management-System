package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/auth/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/auth/repository"
	sharedMiddleware "github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

// AuthHandler handles authentication requests
type AuthHandler struct {
	userRepo  *repository.UserRepository
	jwtSecret string
	jwtExpiry time.Duration
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(userRepo *repository.UserRepository, jwtSecret string, jwtExpiry time.Duration) *AuthHandler {
	return &AuthHandler{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
		jwtExpiry: jwtExpiry,
	}
}

// Register handles POST /register
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req models.UserRegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate input
	if !models.IsValidEmail(req.Email) {
		return utils.ValidationErrorResponse(c, map[string]string{"email": "Invalid email format"})
	}

	if valid, msg := models.IsValidPassword(req.Password); !valid {
		return utils.ValidationErrorResponse(c, map[string]string{"password": msg})
	}

	if valid, msg := models.IsValidName(req.Name); !valid {
		return utils.ValidationErrorResponse(c, map[string]string{"name": msg})
	}

	// Check if user already exists
	existing, err := h.userRepo.FindByEmail(c.Context(), req.Email)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if existing != nil {
		return utils.ErrorResponse(c, fiber.StatusConflict, "User with this email already exists")
	}

	// Hash password
	passwordHash, err := models.HashPassword(req.Password)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	// Create user
	user := &models.User{
		Email:        req.Email,
		PasswordHash: passwordHash,
		Name:         req.Name,
	}

	if err := h.userRepo.Create(c.Context(), user); err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	// Generate JWT token
	token, err := h.generateToken(user)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, fiber.Map{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Login handles POST /login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.UserLoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate input
	if !models.IsValidEmail(req.Email) {
		return utils.ValidationErrorResponse(c, map[string]string{"email": "Invalid email format"})
	}

	// Find user
	user, err := h.userRepo.FindByEmail(c.Context(), req.Email)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if user == nil {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid email or password")
	}

	// Check password
	if !models.CheckPassword(req.Password, user.PasswordHash) {
		return utils.ErrorResponse(c, fiber.StatusUnauthorized, "Invalid email or password")
	}

	// Generate JWT token
	token, err := h.generateToken(user)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, fiber.Map{
		"user":  user.ToResponse(),
		"token": token,
	})
}

// Me handles GET /me (protected)
func (h *AuthHandler) Me(c *fiber.Ctx) error {
	userID, ok := sharedMiddleware.GetUserID(c)
	if !ok {
		return utils.UnauthorizedResponse(c)
	}

	user, err := h.userRepo.FindByID(c.Context(), int64(userID))
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if user == nil {
		return utils.NotFoundResponse(c, "User")
	}

	return utils.SuccessResponse(c, user.ToResponse())
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
