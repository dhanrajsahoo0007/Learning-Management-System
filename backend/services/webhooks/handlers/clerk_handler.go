package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/database"
	"github.com/gofiber/fiber/v2"
)

type ClerkWebhookHandler struct {
	db *database.DB
}

func NewClerkWebhookHandler(db *database.DB) *ClerkWebhookHandler {
	return &ClerkWebhookHandler{db: db}
}

// HandleWebhook processes incoming Clerk webhook events
func (h *ClerkWebhookHandler) HandleWebhook(c *fiber.Ctx) error {
	// Parse the webhook payload
	var payload map[string]interface{}
	if err := json.Unmarshal(c.Body(), &payload); err != nil {
		log.Printf("Failed to parse webhook payload: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid payload",
		})
	}

	// Get event type
	eventType, ok := payload["type"].(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Missing event type",
		})
	}

	log.Printf("Received Clerk webhook: %s", eventType)

	// Handle different event types
	switch eventType {
	case "user.created":
		return h.handleUserCreated(c.Context(), payload)
	case "user.updated":
		return h.handleUserUpdated(c.Context(), payload)
	case "user.deleted":
		return h.handleUserDeleted(c.Context(), payload)
	default:
		log.Printf("Unhandled webhook event type: %s", eventType)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Webhook processed",
	})
}

func (h *ClerkWebhookHandler) handleUserCreated(ctx context.Context, payload map[string]interface{}) error {
	data, ok := payload["data"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid user data")
	}

	// Extract user information
	clerkUserID := data["id"].(string)

	var email string
	if emailAddresses, ok := data["email_addresses"].([]interface{}); ok && len(emailAddresses) > 0 {
		if emailData, ok := emailAddresses[0].(map[string]interface{}); ok {
			email = emailData["email_address"].(string)
		}
	}

	var name string
	if firstName, ok := data["first_name"].(string); ok {
		name = firstName
		if lastName, ok := data["last_name"].(string); ok && lastName != "" {
			name += " " + lastName
		}
	}

	// Insert user into database
	query := `
		INSERT INTO users (clerk_user_id, email, name, created_at, updated_at)
		VALUES (?, ?, ?, datetime('now'), datetime('now'))
	`

	_, err := h.db.ExecContext(ctx, query, clerkUserID, email, name)
	if err != nil {
		log.Printf("Failed to create user in database: %v", err)
		return err
	}

	log.Printf("✅ Created user in database: %s (%s)", name, email)
	return nil
}

func (h *ClerkWebhookHandler) handleUserUpdated(ctx context.Context, payload map[string]interface{}) error {
	data, ok := payload["data"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid user data")
	}

	clerkUserID := data["id"].(string)

	var email string
	if emailAddresses, ok := data["email_addresses"].([]interface{}); ok && len(emailAddresses) > 0 {
		if emailData, ok := emailAddresses[0].(map[string]interface{}); ok {
			email = emailData["email_address"].(string)
		}
	}

	var name string
	if firstName, ok := data["first_name"].(string); ok {
		name = firstName
		if lastName, ok := data["last_name"].(string); ok && lastName != "" {
			name += " " + lastName
		}
	}

	// Update user in database
	query := `
		UPDATE users 
		SET email = ?, name = ?, updated_at = datetime('now')
		WHERE clerk_user_id = ?
	`

	_, err := h.db.ExecContext(ctx, query, email, name, clerkUserID)
	if err != nil {
		log.Printf("Failed to update user in database: %v", err)
		return err
	}

	log.Printf("✅ Updated user in database: %s", clerkUserID)
	return nil
}

func (h *ClerkWebhookHandler) handleUserDeleted(ctx context.Context, payload map[string]interface{}) error {
	data, ok := payload["data"].(map[string]interface{})
	if !ok {
		return fmt.Errorf("invalid user data")
	}

	clerkUserID := data["id"].(string)

	// Soft delete or hard delete based on your requirements
	// Here we'll do a hard delete
	query := `DELETE FROM users WHERE clerk_user_id = ?`

	_, err := h.db.ExecContext(ctx, query, clerkUserID)
	if err != nil {
		log.Printf("Failed to delete user from database: %v", err)
		return err
	}

	log.Printf("✅ Deleted user from database: %s", clerkUserID)
	return nil
}
