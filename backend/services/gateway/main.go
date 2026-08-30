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

	featureconfig "github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gateway/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/config"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/middleware"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
)

var (
	dsaServiceURL            = getEnv("DSA_SERVICE_URL", "http://localhost:8082")
	systemDesignServiceURL   = getEnv("SYSTEM_DESIGN_SERVICE_URL", "http://localhost:8083")
	aiSystemDesignServiceURL = getEnv("AI_SYSTEM_DESIGN_SERVICE_URL", "http://localhost:8084")
	certificationsServiceURL = getEnv("CERTIFICATIONS_SERVICE_URL", "http://localhost:8085")
	gamificationServiceURL   = getEnv("GAMIFICATION_SERVICE_URL", "http://localhost:8086")
)

func main() {
	cfg, err := config.Load("api-gateway")
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	features := featureconfig.LoadFeatures()

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

	app.Use(recover.New())
	app.Use(middleware.Logger())
	app.Use(middleware.CORS(cfg.CORS.AllowedOrigins))
	app.Use(middleware.RateLimiter(100, 1*time.Minute))

	app.Get("/", func(c *fiber.Ctx) error {
		return utils.SuccessResponse(c, fiber.Map{
			"service": "System Design Hub API Gateway",
			"version": "1.0.0",
			"status":  "running",
			"features": fiber.Map{
				"dsa":            features.DSAEnabled,
				"systemDesign":   features.SystemDesignEnabled,
				"aiSystemDesign": features.AISystemDesignEnabled,
				"certifications": features.CertificationsEnabled,
				"gamification":   features.GamificationEnabled,
			},
		})
	})

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return utils.SuccessResponse(c, models.HealthStatus{
			Service: "api-gateway",
			Status:  "healthy",
			Version: "1.0.0",
		})
	})

	api := app.Group("/api")

	if features.DSAEnabled {
		api.All("/dsa/*", func(c *fiber.Ctx) error {
			url := dsaServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/dsa")
			return proxy.Do(c, url)
		})
	} else {
		api.All("/dsa/*", featureDisabledHandler("dsa"))
	}

	if features.SystemDesignEnabled {
		api.All("/system-design/*", func(c *fiber.Ctx) error {
			url := systemDesignServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/system-design")
			return proxy.Do(c, url)
		})
	} else {
		api.All("/system-design/*", featureDisabledHandler("system-design"))
	}

	if features.AISystemDesignEnabled {
		api.All("/ai-system-design/*", func(c *fiber.Ctx) error {
			url := aiSystemDesignServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/ai-system-design")
			return proxy.Do(c, url)
		})
	} else {
		api.All("/ai-system-design/*", featureDisabledHandler("ai-system-design"))
	}

	if features.CertificationsEnabled {
		api.All("/certifications/*", func(c *fiber.Ctx) error {
			url := certificationsServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/certifications")
			return proxy.Do(c, url)
		})
	} else {
		api.All("/certifications/*", featureDisabledHandler("certifications"))
	}

	protected := api.Group("", middleware.ClerkAuth())

	if features.GamificationEnabled {
		protected.All("/gamification/*", func(c *fiber.Ctx) error {
			url := gamificationServiceURL + strings.TrimPrefix(c.OriginalURL(), "/api/gamification")
			if err := proxy.Do(c, url); err != nil {
				log.Printf("❌ Gateway Proxy Error (Gamification): %v | URL: %s", err, url)
				return err
			}
			return nil
		})

		protected.All("/progress", func(c *fiber.Ctx) error {
			url := gamificationServiceURL + "/progress"
			return proxy.Do(c, url)
		})
	} else {
		protected.All("/gamification/*", featureDisabledHandler("gamification"))
		protected.All("/progress", featureDisabledHandler("gamification"))
	}

	go func() {
		addr := fmt.Sprintf(":%s", cfg.Service.Port)
		log.Printf("🚀 API Gateway starting on http://localhost%s", addr)
		log.Printf("📝 Environment: %s", cfg.Service.Env)
		log.Printf("🔗 Routing to microservices:")
		if features.DSAEnabled {
			log.Printf("   - DSA: %s", dsaServiceURL)
		} else {
			log.Printf("   - DSA: disabled")
		}
		if features.SystemDesignEnabled {
			log.Printf("   - System Design: %s", systemDesignServiceURL)
		} else {
			log.Printf("   - System Design: disabled")
		}
		if features.AISystemDesignEnabled {
			log.Printf("   - AI System Design: %s", aiSystemDesignServiceURL)
		} else {
			log.Printf("   - AI System Design: disabled")
		}
		if features.CertificationsEnabled {
			log.Printf("   - Certifications: %s", certificationsServiceURL)
		} else {
			log.Printf("   - Certifications: disabled")
		}
		if features.GamificationEnabled {
			log.Printf("   - Gamification: %s (Protected)", gamificationServiceURL)
		} else {
			log.Printf("   - Gamification: disabled")
		}

		if err := app.Listen(addr); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down API Gateway...")
	if err := app.Shutdown(); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("✅ API Gateway exited gracefully")
}

func featureDisabledHandler(feature string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return utils.ErrorResponse(c, fiber.StatusNotFound, fmt.Sprintf("feature %s is disabled", feature))
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
