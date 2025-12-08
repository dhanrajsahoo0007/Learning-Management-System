package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for a microservice
type Config struct {
	Service  ServiceConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
}

// ServiceConfig holds service-specific configuration
type ServiceConfig struct {
	Name string
	Port string
	Env  string
}

// DatabaseConfig holds database connection configuration
type DatabaseConfig struct {
	URL       string
	AuthToken string
}

// JWTConfig holds JWT configuration
type JWTConfig struct {
	Secret string
	Expiry time.Duration
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// Load loads configuration from environment variables
func Load(serviceName string) (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load()

	cfg := &Config{
		Service: ServiceConfig{
			Name: serviceName,
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENVIRONMENT", "development"),
		},
		Database: DatabaseConfig{
			URL:       getEnv("DATABASE_URL", ""),
			AuthToken: getEnv("DATABASE_AUTH_TOKEN", ""),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
			Expiry: getDurationEnv("JWT_EXPIRY", 24*time.Hour),
		},
		CORS: CORSConfig{
			AllowedOrigins: getCORSOrigins(),
		},
	}

	// Validate required fields
	if cfg.Database.URL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getDurationEnv gets a duration from environment variable or returns default
func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
		// Try parsing as hours
		if hours, err := strconv.Atoi(value); err == nil {
			return time.Duration(hours) * time.Hour
		}
	}
	return defaultValue
}

// getCORSOrigins gets CORS allowed origins from environment variable
// Supports comma-separated list of origins
func getCORSOrigins() []string {
	originsStr := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
	// Split by comma and trim spaces
	origins := []string{}
	for _, origin := range strings.Split(originsStr, ",") {
		trimmed := strings.TrimSpace(origin)
		if trimmed != "" {
			origins = append(origins, trimmed)
		}
	}
	return origins
}
