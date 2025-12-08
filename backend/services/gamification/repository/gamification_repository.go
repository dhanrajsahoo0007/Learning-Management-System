package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/gamification/models"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
)

// GamificationRepository handles gamification database operations
type GamificationRepository struct {
	db *database.DB
}

// NewGamificationRepository creates a new gamification repository
func NewGamificationRepository(db *database.DB) *GamificationRepository {
	return &GamificationRepository{db: db}
}

// GetInternalUserID retrieves the internal integer user ID from a Clerk user ID
func (r *GamificationRepository) GetInternalUserID(ctx context.Context, clerkUserID string) (int64, error) {
	query := `SELECT id FROM users WHERE clerk_user_id = ?`
	var id int64
	err := r.db.QueryRowContext(ctx, query, clerkUserID).Scan(&id)
	if err == sql.ErrNoRows {
		// If user not found, we might want to create them if this is a first-time access
		// For now, let's try to create a placeholder user if they don't exist
		// This handles the case where webhook hasn't fired yet
		return r.createInternalUser(ctx, clerkUserID)
	}
	if err != nil {
		return 0, fmt.Errorf("failed to get internal user ID: %w", err)
	}
	return id, nil
}

// createInternalUser creates a new internal user record from Clerk ID
func (r *GamificationRepository) createInternalUser(ctx context.Context, clerkUserID string) (int64, error) {
	// Simple user creation with placeholder email/name since we only need ID for stats
	// Webhook will update details later or we can fetch from Clerk API
	query := `INSERT INTO users (clerk_user_id, email, name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`
	// Using placeholder email as clerk_ID@placeholder.local to avoid constraint violations if email is unique
	placeholderEmail := fmt.Sprintf("%s@placeholder.local", clerkUserID)
	placeholderName := "New User"
	placeholderHash := "clerk_auth_placeholder"
	now := time.Now()

	result, err := r.db.ExecContext(ctx, query, clerkUserID, placeholderEmail, placeholderName, placeholderHash, now, now)
	if err != nil {
		return 0, fmt.Errorf("failed to create internal user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("failed to get last insert ID: %w", err)
	}

	return id, nil
}

// GetStats retrieves gamification stats for a user
func (r *GamificationRepository) GetStats(ctx context.Context, userID int64) (*models.GamificationStats, error) {
	// Get or create stats
	query := `
		SELECT user_id, level, xp, xp_to_next_level, streak, total_points,
		       last_activity_date, created_at, updated_at
		FROM gamification_stats
		WHERE user_id = ?
	`

	stats := &models.GamificationStats{}
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&stats.UserID, &stats.Level, &stats.XP, &stats.XPToNextLevel,
		&stats.Streak, &stats.TotalPoints, &stats.LastActivityDate,
		&stats.CreatedAt, &stats.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		// Create new stats for user
		return r.createStats(ctx, userID)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query gamification stats: %w", err)
	}

	// Load achievements
	achievements, err := r.GetAchievements(ctx, userID)
	if err != nil {
		return nil, err
	}
	stats.Achievements = achievements

	return stats, nil
}

// createStats creates initial gamification stats for a user
func (r *GamificationRepository) createStats(ctx context.Context, userID int64) (*models.GamificationStats, error) {
	query := `
		INSERT INTO gamification_stats (user_id, level, xp, xp_to_next_level, streak, total_points)
		VALUES (?, 1, 0, 100, 0, 0)
	`

	_, err := r.db.ExecContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to create gamification stats: %w", err)
	}

	return &models.GamificationStats{
		UserID:        userID,
		Level:         1,
		XP:            0,
		XPToNextLevel: 100,
		Streak:        0,
		TotalPoints:   0,
		Achievements:  []models.Achievement{},
	}, nil
}

// AddXP adds XP to a user and updates level if necessary
func (r *GamificationRepository) AddXP(ctx context.Context, userID int64, amount int) (*models.GamificationStats, error) {
	stats, err := r.GetStats(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Add XP
	stats.XP += amount
	stats.TotalPoints += amount

	// Calculate new level
	newLevel := models.CalculateLevel(stats.XP)
	stats.Level = newLevel
	stats.XPToNextLevel = models.CalculateXPToNextLevel(stats.XP, newLevel)

	// Update database
	query := `
		UPDATE gamification_stats
		SET xp = ?, level = ?, xp_to_next_level = ?, total_points = ?, updated_at = ?
		WHERE user_id = ?
	`

	now := time.Now()
	_, err = r.db.ExecContext(ctx, query, stats.XP, stats.Level, stats.XPToNextLevel, stats.TotalPoints, now, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to update XP: %w", err)
	}

	stats.UpdatedAt = now
	return stats, nil
}

// UnlockAchievement unlocks an achievement for a user
func (r *GamificationRepository) UnlockAchievement(ctx context.Context, achievement *models.Achievement) error {
	query := `
		INSERT INTO achievements (user_id, achievement_id, title, description, icon, rarity, unlocked_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	_, err := r.db.ExecContext(
		ctx, query,
		achievement.UserID, achievement.AchievementID, achievement.Title,
		achievement.Description, achievement.Icon, achievement.Rarity, now,
	)

	if err != nil {
		return fmt.Errorf("failed to unlock achievement: %w", err)
	}

	achievement.UnlockedAt = now
	return nil
}

// GetAchievements retrieves all achievements for a user
func (r *GamificationRepository) GetAchievements(ctx context.Context, userID int64) ([]models.Achievement, error) {
	query := `
		SELECT id, user_id, achievement_id, title, description, icon, rarity, unlocked_at
		FROM achievements
		WHERE user_id = ?
		ORDER BY unlocked_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query achievements: %w", err)
	}
	defer rows.Close()

	var achievements []models.Achievement
	for rows.Next() {
		var achievement models.Achievement
		err := rows.Scan(
			&achievement.ID, &achievement.UserID, &achievement.AchievementID,
			&achievement.Title, &achievement.Description, &achievement.Icon,
			&achievement.Rarity, &achievement.UnlockedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan achievement: %w", err)
		}
		achievements = append(achievements, achievement)
	}

	return achievements, nil
}

// UpdateStreak updates the user's daily streak
func (r *GamificationRepository) UpdateStreak(ctx context.Context, userID int64) (*models.GamificationStats, error) {
	stats, err := r.GetStats(ctx, userID)
	if err != nil {
		return nil, err
	}

	today := time.Now().Truncate(24 * time.Hour)

	// Check if last activity was yesterday
	if stats.LastActivityDate != nil {
		lastActivity := stats.LastActivityDate.Truncate(24 * time.Hour)
		daysSince := int(today.Sub(lastActivity).Hours() / 24)

		if daysSince == 1 {
			// Consecutive day - increment streak
			stats.Streak++
		} else if daysSince > 1 {
			// Streak broken - reset to 1
			stats.Streak = 1
		}
		// If daysSince == 0, it's the same day, don't change streak
	} else {
		// First activity
		stats.Streak = 1
	}

	// Update database
	query := `
		UPDATE gamification_stats
		SET streak = ?, last_activity_date = ?, updated_at = ?
		WHERE user_id = ?
	`

	now := time.Now()
	_, err = r.db.ExecContext(ctx, query, stats.Streak, today, now, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to update streak: %w", err)
	}

	stats.LastActivityDate = &today
	stats.UpdatedAt = now
	return stats, nil
}

// UpdateProgress updates user progress on a topic
func (r *GamificationRepository) UpdateProgress(ctx context.Context, progress *models.UserProgress) error {
	// Check if progress exists
	existingQuery := `
		SELECT id FROM user_progress
		WHERE user_id = ? AND topic_id = ? AND topic_type = ?
	`

	var existingID int64
	err := r.db.QueryRowContext(ctx, existingQuery, progress.UserID, progress.TopicID, progress.TopicType).Scan(&existingID)

	now := time.Now()

	if err == sql.ErrNoRows {
		// Create new progress
		insertQuery := `
			INSERT INTO user_progress (user_id, topic_id, topic_type, progress, completed, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`
		_, err = r.db.ExecContext(
			ctx, insertQuery,
			progress.UserID, progress.TopicID, progress.TopicType,
			progress.Progress, progress.Completed, now, now,
		)
		if err != nil {
			return fmt.Errorf("failed to create progress: %w", err)
		}
	} else {
		// Update existing progress
		updateQuery := `
			UPDATE user_progress
			SET progress = ?, completed = ?, completed_at = ?, updated_at = ?
			WHERE id = ?
		`

		var completedAt *time.Time
		if progress.Completed {
			completedAt = &now
		}

		_, err = r.db.ExecContext(
			ctx, updateQuery,
			progress.Progress, progress.Completed, completedAt, now, existingID,
		)
		if err != nil {
			return fmt.Errorf("failed to update progress: %w", err)
		}
	}

	return nil
}
