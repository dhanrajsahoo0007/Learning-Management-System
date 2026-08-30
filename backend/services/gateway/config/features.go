package config

import (
	"os"
	"strconv"
	"strings"
)

type FeatureConfig struct {
	DSAEnabled            bool
	SystemDesignEnabled   bool
	AISystemDesignEnabled bool
	CertificationsEnabled bool
	GamificationEnabled   bool
}

func LoadFeatures() FeatureConfig {
	return FeatureConfig{
		DSAEnabled:            envBool("FEATURE_DSA_ENABLED", false),
		SystemDesignEnabled:   envBool("FEATURE_SYSTEM_DESIGN_ENABLED", true),
		AISystemDesignEnabled: envBool("FEATURE_AI_SYSTEM_DESIGN_ENABLED", true),
		CertificationsEnabled: envBool("FEATURE_CERTIFICATIONS_ENABLED", false),
		GamificationEnabled:   envBool("FEATURE_GAMIFICATION_ENABLED", true),
	}
}

func envBool(key string, defaultValue bool) bool {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return defaultValue
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return defaultValue
	}
	return parsed
}
