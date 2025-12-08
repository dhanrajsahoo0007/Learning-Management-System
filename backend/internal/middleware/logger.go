package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

// Logger returns a logging middleware
func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Process request
		err := c.Next()

		// Log request details
		duration := time.Since(start)
		status := c.Response().StatusCode()
		method := c.Method()
		path := c.Path()

		// Color codes for status
		statusColor := getStatusColor(status)
		methodColor := getMethodColor(method)

		log.Printf("%s %3d %s | %13v | %s %-7s %s %s",
			statusColor, status, resetColor,
			duration,
			methodColor, method, resetColor,
			path,
		)

		return err
	}
}

// ANSI color codes
const (
	resetColor  = "\033[0m"
	redColor    = "\033[31m"
	greenColor  = "\033[32m"
	yellowColor = "\033[33m"
	blueColor   = "\033[34m"
	cyanColor   = "\033[36m"
)

func getStatusColor(status int) string {
	switch {
	case status >= 200 && status < 300:
		return greenColor
	case status >= 300 && status < 400:
		return cyanColor
	case status >= 400 && status < 500:
		return yellowColor
	default:
		return redColor
	}
}

func getMethodColor(method string) string {
	switch method {
	case "GET":
		return blueColor
	case "POST":
		return greenColor
	case "PUT":
		return yellowColor
	case "DELETE":
		return redColor
	default:
		return resetColor
	}
}
