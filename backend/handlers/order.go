package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

func CreateOrder(c *gin.Context) {

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

	if len(cartItems) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cart is empty",
		})
		return
	}

	var total float64

	for _, item := range cartItems {

		if item.Quantity > item.Product.Stock {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Insufficient stock for " + item.Product.Name,
			})
			return
		}

		total += item.Product.Price * float64(item.Quantity)
	}

	order := models.Order{
		UserID: userID,
		Total:  total,
		Status: "placed",
	}

	if err := config.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create order",
		})
		return
	}

	for _, item := range cartItems {

		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
			Price:     item.Product.Price,
		}

		config.DB.Create(&orderItem)

		config.DB.Model(&models.Product{}).
			Where("id = ?", item.ProductID).
			Update("stock", item.Product.Stock-item.Quantity)
	}

	// Clear cart
	config.DB.
		Where("user_id = ?", userID).
		Delete(&models.CartItem{})

	c.JSON(http.StatusCreated, gin.H{
		"message": "Order placed successfully",
		"order":   order,
	})
}

func GetMyOrders(c *gin.Context) {

	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	var orders []models.Order

	if err := config.DB.
		Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&orders).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {

	var orders []models.Order

	if err := config.DB.
		Preload("Items.Product").
		Preload("User").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch orders",
		})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func UpdateOrderStatus(c *gin.Context) {

	orderID := c.Param("id")

	var request struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	allowedStatuses := map[string]bool{
		"placed":     true,
		"processing": true,
		"shipped":    true,
		"delivered": true,
		"cancelled": true,
	}

	if !allowedStatuses[request.Status] {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid order status",
		})
		return
	}

	var order models.Order

	if err := config.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Order not found",
		})
		return
	}

	order.Status = request.Status

	if err := config.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update order status",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order status updated",
		"order":   order,
	})
}

func CancelMyOrder(c *gin.Context) {

	orderID := c.Param("id")

	// Get logged-in user
	userIDValue, exists := c.Get("user_id")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	userID := uint(userIDValue.(float64))

	// Find order belonging to this user
	var order models.Order

	if err := config.DB.
		Preload("Items.Product").
		Where("id = ? AND user_id = ?", orderID, userID).
		First(&order).Error; err != nil {

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Order not found",
		})
		return
	}

	// Only placed and processing orders can be cancelled
	if order.Status != "placed" && order.Status != "processing" {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "This order cannot be cancelled",
		})
		return
	}

	// Restore product stock
	for _, item := range order.Items {

		config.DB.Model(&models.Product{}).
			Where("id = ?", item.ProductID).
			UpdateColumn(
				"stock",
				gorm.Expr("stock + ?", item.Quantity),
			)
	}

	// Change order status
	order.Status = "cancelled"

	if err := config.DB.Save(&order).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to cancel order",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Order cancelled successfully",
		"order":   order,
	})
}