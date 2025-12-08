package utils

import (
	"github.com/gofiber/fiber/v2"
)

// SuccessResponse sends a successful JSON response
func SuccessResponse(c *fiber.Ctx, data interface{}) error {
	return c.JSON(fiber.Map{
		"success": true,
		"data":    data,
	})
}

// ErrorResponse sends an error JSON response
func ErrorResponse(c *fiber.Ctx, statusCode int, message string) error {
	return c.Status(statusCode).JSON(fiber.Map{
		"success": false,
		"error": fiber.Map{
			"message": message,
		},
	})
}

// ValidationErrorResponse sends a validation error response
func ValidationErrorResponse(c *fiber.Ctx, errors map[string]string) error {
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"success": false,
		"error": fiber.Map{
			"message": "Validation failed",
			"fields":  errors,
		},
	})
}

// NotFoundResponse sends a not found error response
func NotFoundResponse(c *fiber.Ctx, resource string) error {
	return ErrorResponse(c, fiber.StatusNotFound, resource+" not found")
}

// UnauthorizedResponse sends an unauthorized error response
func UnauthorizedResponse(c *fiber.Ctx) error {
	return ErrorResponse(c, fiber.StatusUnauthorized, "Unauthorized")
}

// InternalErrorResponse sends an internal server error response
func InternalErrorResponse(c *fiber.Ctx, err error) error {
	return ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
}
