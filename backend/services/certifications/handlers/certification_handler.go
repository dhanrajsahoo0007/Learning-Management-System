package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/certifications/repository"
	"github.com/dhanrajsahoo0007/Learning-Management-System/backend/services/shared/utils"
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
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, certifications)
}

// GetByID handles GET /api/certifications/:id
func (h *CertificationHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return utils.ErrorResponse(c, fiber.StatusBadRequest, "Certification ID is required")
	}

	certification, err := h.certRepo.GetByID(c.Context(), id)
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}
	if certification == nil {
		return utils.NotFoundResponse(c, "Certification")
	}

	return utils.SuccessResponse(c, certification)
}

// GetProviders handles GET /api/certifications/providers
func (h *CertificationHandler) GetProviders(c *fiber.Ctx) error {
	providers, err := h.certRepo.GetProviders(c.Context())
	if err != nil {
		return utils.InternalErrorResponse(c, err)
	}

	return utils.SuccessResponse(c, providers)
}
