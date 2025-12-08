package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/system-design/handlers"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/system-design/repository"
)

func main() {
	// Load configuration
	cfg, err := config.Load("system-design-service")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Connect to database
	db, err := database.Connect(database.Config{
		URL:       cfg.Database.URL,
		AuthToken: cfg.Database.AuthToken,
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	log.Println("✅ System Design Service connected to database")

	// Initialize repository
	systemDesignRepo := repository.NewSystemDesignRepository(db)

	// Initialize handler
	systemDesignHandler := handlers.NewSystemDesignHandler(systemDesignRepo)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "System Design Service",
		ServerHeader: "Fiber",
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

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		if err := db.HealthCheck(context.Background()); err != nil {
			return utils.ErrorResponse(c, fiber.StatusServiceUnavailable, "Database unhealthy")
		}
		return utils.SuccessResponse(c, models.HealthStatus{
			Service:  "system-design-service",
			Status:   "healthy",
			Database: "connected",
			Version:  "1.0.0",
		})
	})

	// System Design routes
	app.Get("/topics", systemDesignHandler.GetAll)
	app.Get("/topics/:id", systemDesignHandler.GetByID)

	// Start server in a goroutine
	go func() {
		addr := fmt.Sprintf(":%s", cfg.Service.Port)
		log.Printf("🚀 System Design Service starting on http://localhost%s", addr)
		log.Printf("📝 Environment: %s", cfg.Service.Env)

		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down System Design Service...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ System Design Service exited gracefully")
}
