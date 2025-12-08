package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	RateLimit RateLimitConfig
}

// ServerConfig holds server-specific configuration
type ServerConfig struct {
	Port string
	Env  string
}

// DatabaseConfig holds Turso database configuration
type DatabaseConfig struct {
	URL       string
	AuthToken string
}

// JWTConfig holds JWT authentication configuration
type JWTConfig struct {
	Secret string
	Expiry time.Duration
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
}

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	Max    int
	Window time.Duration
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (ignore error in production)
	_ = godotenv.Load()

	config := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			URL:       getEnv("TURSO_DATABASE_URL", ""),
			AuthToken: getEnv("TURSO_AUTH_TOKEN", ""),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", ""),
			Expiry: parseDuration(getEnv("JWT_EXPIRY", "24h"), 24*time.Hour),
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{
				getEnv("FRONTEND_URL", "http://localhost:5173"),
			},
		},
		RateLimit: RateLimitConfig{
			Max:    parseInt(getEnv("RATE_LIMIT_MAX", "100"), 100),
			Window: parseDuration(getEnv("RATE_LIMIT_WINDOW", "1m"), time.Minute),
		},
	}

	// Validate required fields
	if err := config.Validate(); err != nil {
		return nil, err
	}

	return config, nil
}

// Validate checks if all required configuration is present
func (c *Config) Validate() error {
	if c.Database.URL == "" {
		return fmt.Errorf("TURSO_DATABASE_URL is required")
	}
	if c.Database.AuthToken == "" {
		return fmt.Errorf("TURSO_AUTH_TOKEN is required")
	}
	if c.JWT.Secret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}
	return nil
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Server.Env == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Server.Env == "production"
}

// Helper functions

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDuration(value string, defaultValue time.Duration) time.Duration {
	duration, err := time.ParseDuration(value)
	if err != nil {
		return defaultValue
	}
	return duration
}

func parseInt(value string, defaultValue int) int {
	var result int
	_, err := fmt.Sscanf(value, "%d", &result)
	if err != nil {
		return defaultValue
	}
	return result
}
