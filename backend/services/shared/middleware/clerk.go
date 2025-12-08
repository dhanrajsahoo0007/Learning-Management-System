package middleware

import (
	"os"
	"strings"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/gofiber/fiber/v2"
)

// ClerkAuth creates a middleware that validates Clerk JWT tokens
func ClerkAuth() fiber.Handler {
	// Initialize Clerk with secret key from environment
	clerkSecretKey := os.Getenv("CLERK_SECRET_KEY")
	if clerkSecretKey == "" {
		panic("CLERK_SECRET_KEY environment variable is required")
	}

	clerk.SetKey(clerkSecretKey)

	return func(c *fiber.Ctx) error {
		// Get Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error": fiber.Map{
					"message": "Missing authorization header",
				},
			})
		}

		// Remove "Bearer " prefix
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error": fiber.Map{
					"message": "Invalid authorization format. Expected: Bearer <token>",
				},
			})
		}

		// Verify the Clerk session token
		claims, err := jwt.Verify(c.Context(), &jwt.VerifyParams{
			Token: token,
		})
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"success": false,
				"error": fiber.Map{
					"message": "Invalid or expired token",
					"details": err.Error(),
				},
			})
		}

		// Store user ID in context for use in handlers
		c.Locals("userId", claims.Subject)
		c.Locals("clerkClaims", claims)

		return c.Next()
	}
}

// OptionalClerkAuth is similar to ClerkAuth but doesn't fail if no token is provided
// Useful for endpoints that work for both authenticated and unauthenticated users
func OptionalClerkAuth() fiber.Handler {
	clerkSecretKey := os.Getenv("CLERK_SECRET_KEY")
	if clerkSecretKey == "" {
		panic("CLERK_SECRET_KEY environment variable is required")
	}

	clerk.SetKey(clerkSecretKey)

	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			// No token provided, continue without user context
			return c.Next()
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			// Invalid format, but don't fail - just continue without user context
			return c.Next()
		}

		// Try to verify the token
		claims, err := jwt.Verify(c.Context(), &jwt.VerifyParams{
			Token: token,
		})
		if err == nil {
			// Valid token, store user info
			c.Locals("userId", claims.Subject)
			c.Locals("clerkClaims", claims)
		}
		// If verification fails, just continue without user context

		return c.Next()
	}
}
