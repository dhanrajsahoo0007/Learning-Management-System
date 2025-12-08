package middleware

import (
	"log"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
	"github.com/gofiber/fiber/v2"
)

// ErrorHandler is a global error handler middleware
func ErrorHandler() fiber.Handler {
	return func(c *fiber.Ctx) error {
		err := c.Next()

		if err != nil {
			// Log the error
			log.Printf("Error: %v", err)

			// Check if it's a Fiber error
			if e, ok := err.(*fiber.Error); ok {
				return c.Status(e.Code).JSON(fiber.Map{
					"success": false,
					"error": fiber.Map{
						"message": e.Message,
						"code":    "HTTP_ERROR",
					},
				})
			}

			// Default to internal server error
			return utils.InternalError(c, "An unexpected error occurred")
		}

		return nil
	}
}
