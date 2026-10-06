package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

type ProductRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	ImageURL    string  `json:"image_url"`
	CategoryID  uint    `json:"category_id"`
}

func GetProducts(c *gin.Context) {

	var products []models.Product

	query := config.DB.Preload("Category")

	search := c.Query("search")
	categoryID := c.Query("category_id")

	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}

	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}

	if err := query.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch products",
		})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetProduct(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	ctx := context.Background()

	// Redis key
	cacheKey := "product:" + strconv.Itoa(id)

	// 1. Check Redis
	cachedProduct, err := config.RedisClient.Get(ctx, cacheKey).Result()

	if err == nil {

		var product models.Product

		if json.Unmarshal([]byte(cachedProduct), &product) == nil {
			c.JSON(http.StatusOK, product)
			return
		}
	}

	// 2. Redis MISS → get from PostgreSQL
	var product models.Product

	if err := config.DB.Preload("Category").First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	// 3. Convert product to JSON
	productJSON, err := json.Marshal(product)

	if err == nil {

		// 4. Store in Redis for 5 minutes
		config.RedisClient.Set(
			ctx,
			cacheKey,
			productJSON,
			5*time.Minute,
		)
	}

	// 5. Return product
	c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {

	var request ProductRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	product := models.Product{
		Name:        request.Name,
		Description: request.Description,
		Price:       request.Price,
		Stock:       request.Stock,
		ImageURL:    request.ImageURL,
		CategoryID:  request.CategoryID,
	}

	if err := config.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create product",
		})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	var request ProductRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	product.Name = request.Name
	product.Description = request.Description
	product.Price = request.Price
	product.Stock = request.Stock
	product.ImageURL = request.ImageURL
	product.CategoryID = request.CategoryID

	config.DB.Save(&product)

	// Remove old cached product
	cacheKey := "product:" + strconv.Itoa(id)
	config.RedisClient.Del(context.Background(), cacheKey)

	c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID",
		})
		return
	}

	result := config.DB.Delete(&models.Product{}, id)

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Product not found",
		})
		return
	}

	// Remove cached product
	cacheKey := "product:" + strconv.Itoa(id)
	config.RedisClient.Del(context.Background(), cacheKey)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}