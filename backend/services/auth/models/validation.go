package models

import (
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

// IsValidEmail validates email format
func IsValidEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// IsValidPassword validates password strength
func IsValidPassword(password string) (bool, string) {
	if len(password) < 8 {
		return false, "Password must be at least 8 characters long"
	}
	if len(password) > 72 {
		return false, "Password must be at most 72 characters long"
	}
	return true, ""
}

// IsValidName validates user name
func IsValidName(name string) (bool, string) {
	name = strings.TrimSpace(name)
	if len(name) < 2 {
		return false, "Name must be at least 2 characters long"
	}
	if len(name) > 100 {
		return false, "Name must be at most 100 characters long"
	}
	return true, ""
}
