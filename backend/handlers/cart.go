package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

type AddToCartRequest struct {
	ProductID uint `json:"product_id"`
	Quantity  int  `json:"quantity"`
}

func AddToCart(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	var request AddToCartRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	if request.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Quantity must be greater than zero",
		})
		return
	}

	// Check product
	var product models.Product

	if err := config.DB.First(&product, request.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	if product.Stock < request.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Insufficient stock",
		})
		return
	}

	// Check existing cart item
	var cartItem models.CartItem

	result := config.DB.Where(
		"user_id = ? AND product_id = ?",
		userID,
		request.ProductID,
	).First(&cartItem)

	if result.Error == nil {

		cartItem.Quantity += request.Quantity

		config.DB.Save(&cartItem)

	} else {

		cartItem = models.CartItem{
			UserID:    userID,
			ProductID: request.ProductID,
			Quantity:  request.Quantity,
		}

		config.DB.Create(&cartItem)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Product added to cart",
	})
}

func GetCart(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	var cartItems []models.CartItem

	if err := config.DB.
		Preload("Product").
		Where("user_id = ?", userID).
		Find(&cartItems).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch cart",
		})
		return
	}

	c.JSON(http.StatusOK, cartItems)
}

func RemoveFromCart(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	productID := c.Param("productId")

	result := config.DB.
		Where("user_id = ? AND product_id = ?", userID, productID).
		Delete(&models.CartItem{})

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Cart item not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item removed from cart",
	})
}

func UpdateCartQuantity(c *gin.Context) {

	var cartItem models.CartItem

	productID := c.Param("productId")

	// Get user ID from middleware
	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	var input struct {
		Quantity int `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	if input.Quantity < 1 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Quantity must be at least 1",
		})
		return
	}

	result := config.DB.
		Where(
			"user_id = ? AND product_id = ?",
			userID,
			productID,
		).
		First(&cartItem)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Cart item not found",
		})
		return
	}

	cartItem.Quantity = input.Quantity

	if err := config.DB.Save(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update cart",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Cart updated successfully",
	})
}