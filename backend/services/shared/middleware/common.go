package middleware

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// CORS creates a CORS middleware with allowed origins
func CORS(allowedOrigins []string) fiber.Handler {
	// For development, allow all localhost origins
	allowOriginsStr := strings.Join(allowedOrigins, ",")
	// if len(allowedOrigins) > 0 && strings.Contains(allowedOrigins[0], "localhost") {
	// 	allowOriginsStr = "http://localhost:*"
	// }

	return cors.New(cors.Config{
		AllowOrigins:     allowOriginsStr,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
		MaxAge:           86400,
	})
}

// Logger creates a request logger middleware
func Logger() fiber.Handler {
	return logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${latency} ${method} ${path}\n",
		TimeFormat: "2006-01-02 15:04:05",
		TimeZone:   "Local",
	})
}

// RateLimiter creates a rate limiting middleware
func RateLimiter(max int, window time.Duration) fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        max,
		Expiration: window,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"success": false,
				"error": fiber.Map{
					"message": "Rate limit exceeded",
				},
			})
		},
	})
}
