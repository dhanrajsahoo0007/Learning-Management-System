package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/internal/utils"
)

// CertificationHandler handles certification requests
type CertificationHandler struct {
	certRepo *repository.CertificationRepository
}

// NewCertificationHandler creates a new certification handler
func NewCertificationHandler(certRepo *repository.CertificationRepository) *CertificationHandler {
	return &CertificationHandler{certRepo: certRepo}
}

// GetAll handles GET /api/certifications
func (h *CertificationHandler) GetAll(c *fiber.Ctx) error {
	certifications, err := h.certRepo.GetAll(c.Context())
	if err != nil {
		return utils.InternalError(c, "Failed to fetch certifications")
	}

	return utils.Success(c, certifications)
}

// GetByID handles GET /api/certifications/:id
func (h *CertificationHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.Error(c, fiber.StatusBadRequest, "Certification ID is required")
	}

	certification, err := h.certRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalError(c, "Failed to fetch certification")
	}
	if certification == nil {
		return utils.NotFound(c, "Certification not found")
	}

	return utils.Success(c, certification)
}

// GetProviders handles GET /api/certifications/providers
func (h *CertificationHandler) GetProviders(c *fiber.Ctx) error {
	providers, err := h.certRepo.GetProviders(c.Context())
	if err != nil {
		return utils.InternalError(c, "Failed to fetch providers")
	}

	return utils.Success(c, providers)
}
