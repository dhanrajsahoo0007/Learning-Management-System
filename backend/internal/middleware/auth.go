package middleware

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
)

// AuthMiddleware creates a JWT authentication middleware
func AuthMiddleware(jwtSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return utils.Unauthorized(c, "Missing authorization header")
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return utils.Unauthorized(c, "Invalid authorization header format")
		}

		tokenString := parts[1]

		// Parse and validate token
		token, err := jwt.ParseWithClaims(tokenString, &models.JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			return utils.Unauthorized(c, "Invalid or expired token")
		}

		// Extract claims
		claims, ok := token.Claims.(*models.JWTClaims)
		if !ok {
			return utils.Unauthorized(c, "Invalid token claims")
		}

		// Check expiration
		if claims.ExpiresAt != nil && claims.ExpiresAt.Time.Before(time.Now()) {
			return utils.Unauthorized(c, "Token has expired")
		}

		// Store user info in context
		c.Locals("userID", claims.UserID)
		c.Locals("userEmail", claims.Email)

		return c.Next()
	}
}

// GetUserID extracts user ID from context
func GetUserID(c *fiber.Ctx) (int64, bool) {
	userID, ok := c.Locals("userID").(int64)
	return userID, ok
}

// GetUserEmail extracts user email from context
func GetUserEmail(c *fiber.Ctx) (string, bool) {
	email, ok := c.Locals("userEmail").(string)
	return email, ok
}
