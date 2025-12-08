package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/handlers"
)

// SetupRoutes registers all application routes
func SetupRoutes(
	app *fiber.App,
	healthHandler *handlers.HealthHandler,
	authHandler *handlers.AuthHandler,
	dsaHandler *handlers.DSAHandler,
	systemDesignHandler *handlers.SystemDesignHandler,
	certificationHandler *handlers.CertificationHandler,
	gamificationHandler *handlers.GamificationHandler,
	authMiddleware fiber.Handler,
) {
	// API group
	api := app.Group("/api")

	// Health check (public)
	api.Get("/health", healthHandler.Check)

	// Auth routes (public)
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", authMiddleware, authHandler.Me)

	// DSA routes (public for reading)
	dsa := api.Group("/dsa")
	dsa.Get("/topics", dsaHandler.GetAll)
	dsa.Get("/topics/:id", dsaHandler.GetByID)
	dsa.Get("/categories", dsaHandler.GetCategories)

	// System Design routes (public for reading)
	systemDesign := api.Group("/system-design")
	systemDesign.Get("/topics", systemDesignHandler.GetAll)
	systemDesign.Get("/topics/:id", systemDesignHandler.GetByID)

	// AI System Design routes (public for reading)
	aiSystemDesign := api.Group("/ai-system-design")
	aiSystemDesign.Get("/topics", systemDesignHandler.GetAllAI)

	// Certification routes (public for reading)
	certifications := api.Group("/certifications")
	certifications.Get("/", certificationHandler.GetAll)
	certifications.Get("/:id", certificationHandler.GetByID)
	certifications.Get("/providers", certificationHandler.GetProviders)

	// Gamification routes (protected)
	gamification := api.Group("/gamification", authMiddleware)
	gamification.Get("/stats", gamificationHandler.GetStats)
	gamification.Post("/xp", gamificationHandler.AddXP)
	gamification.Post("/achievements", gamificationHandler.UnlockAchievement)
	gamification.Post("/streak", gamificationHandler.UpdateStreak)

	// Progress tracking (protected)
	api.Post("/progress", authMiddleware, gamificationHandler.UpdateProgress)
}
