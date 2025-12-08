package models

import "time"

// GamificationStats represents user gamification statistics
type GamificationStats struct {
	UserID           int64         `json:"userId" db:"user_id"`
	Level            int           `json:"level" db:"level"`
	XP               int           `json:"xp" db:"xp"`
	XPToNextLevel    int           `json:"xpToNextLevel" db:"xp_to_next_level"`
	Streak           int           `json:"streak" db:"streak"`
	TotalPoints      int           `json:"totalPoints" db:"total_points"`
	LastActivityDate *time.Time    `json:"lastActivityDate,omitempty" db:"last_activity_date"`
	Achievements     []Achievement `json:"achievements,omitempty"` // Loaded separately
	CreatedAt        time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt        time.Time     `json:"updated_at" db:"updated_at"`
}

// Achievement represents an unlocked achievement
type Achievement struct {
	ID            int64     `json:"id" db:"id"`
	UserID        int64     `json:"userId" db:"user_id"`
	AchievementID string    `json:"achievementId" db:"achievement_id"`
	Title         string    `json:"title" db:"title"`
	Description   string    `json:"description" db:"description"`
	Icon          string    `json:"icon" db:"icon"`
	Rarity        string    `json:"rarity" db:"rarity"` // common, rare, epic, legendary
	UnlockedAt    time.Time `json:"unlockedAt" db:"unlocked_at"`
}

// UserProgress represents user progress on a topic
type UserProgress struct {
	ID          int64      `json:"id" db:"id"`
	UserID      int64      `json:"userId" db:"user_id"`
	TopicID     string     `json:"topicId" db:"topic_id"`
	TopicType   string     `json:"topicType" db:"topic_type"` // dsa, system_design, certification
	Progress    int        `json:"progress" db:"progress"`
	Completed   bool       `json:"completed" db:"completed"`
	CompletedAt *time.Time `json:"completedAt,omitempty" db:"completed_at"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

// AddXPRequest represents a request to add XP
type AddXPRequest struct {
	Amount int `json:"amount"`
}

// UnlockAchievementRequest represents a request to unlock an achievement
type UnlockAchievementRequest struct {
	AchievementID string `json:"achievementId"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	Icon          string `json:"icon"`
	Rarity        string `json:"rarity"`
}

// UpdateProgressRequest represents a request to update progress
type UpdateProgressRequest struct {
	TopicID   string `json:"topicId"`
	TopicType string `json:"topicType"`
	Progress  int    `json:"progress"`
}

// CalculateLevel calculates level based on XP
func CalculateLevel(xp int) int {
	// Simple formula: level = floor(sqrt(xp / 100)) + 1
	level := 1
	requiredXP := 100
	currentXP := xp

	for currentXP >= requiredXP {
		currentXP -= requiredXP
		level++
		requiredXP = level * 100 // Each level requires more XP
	}

	return level
}

// CalculateXPToNextLevel calculates XP needed for next level
func CalculateXPToNextLevel(xp, level int) int {
	// Calculate total XP needed for current level
	totalXPForCurrentLevel := 0
	for i := 1; i < level; i++ {
		totalXPForCurrentLevel += i * 100
	}

	// Calculate total XP needed for next level
	totalXPForNextLevel := totalXPForCurrentLevel + (level * 100)

	// Return remaining XP needed
	return totalXPForNextLevel - xp
}
