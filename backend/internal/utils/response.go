package utils

import "github.com/gofiber/fiber/v2"

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
}

// ErrorInfo represents error details
type ErrorInfo struct {
	Message string                 `json:"message"`
	Code    string                 `json:"code,omitempty"`
	Details map[string]interface{} `json:"details,omitempty"`
}

// Success sends a success response
func Success(c *fiber.Ctx, data interface{}) error {
	return c.JSON(Response{
		Success: true,
		Data:    data,
	})
}

// Error sends an error response
func Error(c *fiber.Ctx, statusCode int, message string) error {
	return c.Status(statusCode).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: message,
		},
	})
}

// ErrorWithCode sends an error response with error code
func ErrorWithCode(c *fiber.Ctx, statusCode int, message, code string) error {
	return c.Status(statusCode).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: message,
			Code:    code,
		},
	})
}

// ValidationError sends a validation error response
func ValidationError(c *fiber.Ctx, details map[string]interface{}) error {
	return c.Status(fiber.StatusBadRequest).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: "Validation failed",
			Code:    "VALIDATION_ERROR",
			Details: details,
		},
	})
}

// Unauthorized sends an unauthorized error response
func Unauthorized(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Unauthorized"
	}
	return c.Status(fiber.StatusUnauthorized).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: message,
			Code:    "UNAUTHORIZED",
		},
	})
}

// NotFound sends a not found error response
func NotFound(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Resource not found"
	}
	return c.Status(fiber.StatusNotFound).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: message,
			Code:    "NOT_FOUND",
		},
	})
}

// InternalError sends an internal server error response
func InternalError(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Internal server error"
	}
	return c.Status(fiber.StatusInternalServerError).JSON(Response{
		Success: false,
		Error: &ErrorInfo{
			Message: message,
			Code:    "INTERNAL_ERROR",
		},
	})
}
