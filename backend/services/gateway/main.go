package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

// Service URLs
var (
	dsaServiceURL            = getEnv("DSA_SERVICE_URL", "http://localhost:8082")
	systemDesignServiceURL   = getEnv("SYSTEM_DESIGN_SERVICE_URL", "http://localhost:8083")
	aiSystemDesignServiceURL = getEnv("AI_SYSTEM_DESIGN_SERVICE_URL", "http://localhost:8084")
	certificationsServiceURL = getEnv("CERTIFICATIONS_SERVICE_URL", "http://localhost:8085")
	gamificationServiceURL   = getEnv("GAMIFICATION_SERVICE_URL", "http://localhost:8086")
)

func main() {
	// Load configuration
	cfg, err := config.Load("api-gateway")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "API Gateway",
		ServerHeader: "Fiber",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return utils.ErrorResponse(c, code, err.Error())
		},
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS(cfg.CORS.AllowedOrigins))
	app.Use(middleware.RateLimiter(100, 1*time.Minute))

	// Root endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return utils.SuccessResponse(c, fiber.Map{
			"service": "Learning Management API Gateway",
			"version": "1.0.0",
			"status":  "running",
		})
	})

	// Aggregated health check
	app.Get("/api/health", func(c *fiber.Ctx) error {
		return utils.SuccessResponse(c, models.HealthStatus{
			Service: "api-gateway",
			Status:  "healthy",
			Version: "1.0.0",
		})
	})

	// API routes with proxy
	api := app.Group("/api")

	// Public routes (no authentication required)
	// DSA routes -> DSA Service
	api.All("/dsa/*", func(c *fiber.Ctx) error {
		url := dsaServiceURL + c.OriginalURL()[8:] // Remove "/api/dsa" (8 chars)
		return proxy.Do(c, url)
	})

	// System Design routes -> System Design Service
	api.All("/system-design/*", func(c *fiber.Ctx) error {
		url := systemDesignServiceURL + c.OriginalURL()[18:] // Remove "/api/system-design" (18 chars)
		return proxy.Do(c, url)
	})

	// AI System Design routes -> AI System Design Service
	api.All("/ai-system-design/*", func(c *fiber.Ctx) error {
		url := aiSystemDesignServiceURL + c.OriginalURL()[21:] // Remove "/api/ai-system-design" (21 chars)
		return proxy.Do(c, url)
	})

	// Certifications routes -> Certifications Service
	api.All("/certifications/*", func(c *fiber.Ctx) error {
		url := certificationsServiceURL + c.OriginalURL()[19:] // Remove "/api/certifications" (19 chars)
		return proxy.Do(c, url)
	})

	// Protected routes (require Clerk authentication)
	protected := api.Group("", middleware.ClerkAuth())

	// Gamification routes -> Gamification Service (Protected)
	protected.All("/gamification/*", func(c *fiber.Ctx) error {
		url := gamificationServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/gamification")
		if err := proxy.Do(c, url); err != nil {
			log.Printf("❌ Gateway Proxy Error (Gamification): %v | URL: %s", err, url)
			return err
		}
		return nil
	})

	// Progress tracking -> Gamification Service (Protected)
	protected.All("/progress", func(c *fiber.Ctx) error {
		url := gamificationServiceURL + "/progress"
		return proxy.Do(c, url)
	})

	// Start server in a goroutine
	go func() {
		addr := fmt.Sprintf(":%s", cfg.Service.Port)
		log.Printf("🚀 API Gateway starting on http://localhost%s", addr)
		log.Printf("📝 Environment: %s", cfg.Service.Env)
		log.Printf("🔗 Routing to microservices:")
		log.Printf("   - DSA: %s", dsaServiceURL)
		log.Printf("   - System Design: %s", systemDesignServiceURL)
		log.Printf("   - AI System Design: %s", aiSystemDesignServiceURL)
		log.Printf("   - Certifications: %s", certificationsServiceURL)
		log.Printf("   - Gamification: %s (Protected)", gamificationServiceURL)

		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down API Gateway...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ API Gateway exited gracefully")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
