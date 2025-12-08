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

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gamification/handlers"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gamification/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

func main() {
	// Load configuration
	cfg, err := config.Load("gamification-service")
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

	log.Println("✅ Gamification Service connected to database")

	// Run migration to add clerk_user_id if missing
	log.Println("🔄 Checking/Running migration for clerk_user_id...")
	// We ignore errors here as the column might already exist
	_, err = db.Exec("ALTER TABLE users ADD COLUMN clerk_user_id TEXT")
	if err != nil {
		log.Printf("ℹ️ Migration note (users): %v", err)
	}
	_, err = db.Exec("CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id)")
	if err != nil {
		log.Printf("⚠️ Migration warning (index): %v", err)
	}

	// DEBUG: Print users table info
	rows, err := db.Query("PRAGMA table_info(users)")
	if err == nil {
		log.Println("📊 Users Table Schema:")
		var cid int
		var name, type_ string
		var notnull, pk int
		var dflt_value *string
		for rows.Next() {
			rows.Scan(&cid, &name, &type_, &notnull, &dflt_value, &pk)
			log.Printf("Col: %s (%s) NN:%d PK:%d", name, type_, notnull, pk)
		}
		rows.Close()
	} else {
		log.Printf("❌ Failed to query table info: %v", err)
	}

	// Initialize repository
	gamificationRepo := repository.NewGamificationRepository(db)

	// Initialize handler
	gamificationHandler := handlers.NewGamificationHandler(gamificationRepo)

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Gamification Service",
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
			Service:  "gamification-service",
			Status:   "healthy",
			Database: "connected",
			Version:  "1.0.0",
		})
	})

	// Auth middleware
	authMiddleware := middleware.ClerkAuth()

	// Gamification routes (protected)
	app.Get("/stats", authMiddleware, gamificationHandler.GetStats)
	app.Post("/xp", authMiddleware, gamificationHandler.AddXP)
	app.Post("/achievements", authMiddleware, gamificationHandler.UnlockAchievement)
	app.Post("/streak", authMiddleware, gamificationHandler.UpdateStreak)
	app.Post("/progress", authMiddleware, gamificationHandler.UpdateProgress)

	// Start server in a goroutine
	go func() {
		addr := fmt.Sprintf(":%s", cfg.Service.Port)
		log.Printf("🚀 Gamification Service starting on http://localhost%s", addr)
		log.Printf("📝 Environment: %s", cfg.Service.Env)

		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down Gamification Service...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ Gamification Service exited gracefully")
}
