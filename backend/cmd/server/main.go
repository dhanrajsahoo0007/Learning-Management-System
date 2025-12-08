package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/handlers"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/routes"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
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

	log.Println("✅ Connected to Turso database")

	// Run migrations
	if err := db.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("✅ Database migrations completed")

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	dsaRepo := repository.NewDSARepository(db)
	systemDesignRepo := repository.NewSystemDesignRepository(db)
	certificationRepo := repository.NewCertificationRepository(db)
	gamificationRepo := repository.NewGamificationRepository(db)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(db)
	authHandler := handlers.NewAuthHandler(userRepo, gamificationRepo, cfg.JWT.Secret, cfg.JWT.Expiry)
	dsaHandler := handlers.NewDSAHandler(dsaRepo)
	systemDesignHandler := handlers.NewSystemDesignHandler(systemDesignRepo)
	certificationHandler := handlers.NewCertificationHandler(certificationRepo)
	gamificationHandler := handlers.NewGamificationHandler(gamificationRepo)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Learning Management API",
		ServerHeader: "Fiber",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error": fiber.Map{
					"message": err.Error(),
				},
			})
		},
	})

	// Global middleware
	app.Use(recover.New())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS(cfg.CORS.AllowedOrigins))
	app.Use(middleware.RateLimiter(cfg.RateLimit.Max, cfg.RateLimit.Window))

	// Setup routes
	authMiddleware := middleware.AuthMiddleware(cfg.JWT.Secret)
	routes.SetupRoutes(
		app,
		healthHandler,
		authHandler,
		dsaHandler,
		systemDesignHandler,
		certificationHandler,
		gamificationHandler,
		authMiddleware,
	)

	// Root endpoint
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service": "Learning Management API",
			"version": "1.0.0",
			"status":  "running",
		})
	})

	// Start server in a goroutine
	go func() {
		addr := fmt.Sprintf(":%s", cfg.Server.Port)
		log.Printf("🚀 Server starting on http://localhost%s", addr)
		log.Printf("📝 Environment: %s", cfg.Server.Env)
		log.Printf("🔗 API Documentation: http://localhost%s/api/health", addr)

		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ Server exited gracefully")
}
