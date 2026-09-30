package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

// =========================
// Create Address
// =========================

func CreateAddress(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID, err := getUserID(userIDValue)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	var request models.Address

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid address",
		})
		return
	}

	request.UserID = userID

	if err := config.DB.Create(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save address",
		})
		return
	}

	c.JSON(http.StatusCreated, request)
}

// =========================
// Get Addresses
// =========================

func GetAddresses(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID, err := getUserID(userIDValue)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	var addresses []models.Address

	if err := config.DB.
		Where("user_id = ?", userID).
		Find(&addresses).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch addresses",
		})
		return
	}

	c.JSON(http.StatusOK, addresses)
}

// =========================
// Delete Address
// =========================

func DeleteAddress(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID, err := getUserID(userIDValue)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	addressID := c.Param("id")

	var address models.Address

	result := config.DB.
		Where("id = ? AND user_id = ?", addressID, userID).
		First(&address)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Address not found",
		})
		return
	}

	if err := config.DB.Delete(&address).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete address",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Address deleted successfully",
	})
}

// =========================
// Convert User ID
// =========================

func getUserID(value interface{}) (uint, error) {

	switch v := value.(type) {

	case float64:
		return uint(v), nil

	case int:
		return uint(v), nil

	case uint:
		return v, nil

	case string:
		id, err := strconv.ParseUint(v, 10, 64)

		if err != nil {
			return 0, err
		}

		return uint(id), nil

	default:
		return 0, strconv.ErrSyntax
	}
}