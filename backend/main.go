package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce-backend/config"
	"ecommerce-backend/handlers"
	"ecommerce-backend/middleware"
	"ecommerce-backend/models"

	"github.com/gin-contrib/cors"

	"fmt"

	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

func createAdmin() {
	var admin models.User

	result := config.DB.Where(
		"email = ?",
		"admin@abbstore.com",
	).First(&admin)

	if result.Error == gorm.ErrRecordNotFound {
		hashedPassword, _ := bcrypt.GenerateFromPassword(
			[]byte("Admin@123"),
			bcrypt.DefaultCost,
		)

		admin = models.User{
			Name:     "ABB Admin",
			Email:    "admin@abbstore.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}

		config.DB.Create(&admin)

		fmt.Println("Admin account created")
	}
}

func main() {

	config.ConnectDatabase()
	createAdmin()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Product{},
		&models.CartItem{},
		&models.Address{},
		&models.Order{},
		&models.OrderItem{},
	)

	seedDatabase()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Health check
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "E-commerce API is running",
		})
	})

	// =========================
	// Authentication
	// =========================

	router.POST("/api/auth/register", handlers.Register)
	router.POST("/api/auth/login", handlers.Login)

	// =========================
	// Protected routes
	// =========================

	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())

	// Profile
	protected.GET("/profile", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "You are authenticated!",
			"user_id": c.GetString("user_id"),
			"role":    c.GetString("role"),
		})
	})

	// Cart
	protected.POST("/cart", handlers.AddToCart)
	protected.GET("/cart", handlers.GetCart)
	protected.DELETE("/cart/:productId", handlers.RemoveFromCart)
	protected.PUT("/cart/:productId", handlers.UpdateCartQuantity)

	// Addresses
	// Addresses
	protected.POST("/addresses", handlers.CreateAddress)
	protected.GET("/addresses", handlers.GetAddresses)
	protected.DELETE("/addresses/:id", handlers.DeleteAddress)

	// =========================
	// Products
	// =========================

	router.GET("/api/products", handlers.GetProducts)
	router.GET("/api/products/:id", handlers.GetProduct)

	admin := router.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Use(middleware.AdminMiddleware())

	admin.POST("/products", handlers.CreateProduct)
	admin.PUT("/products/:id", handlers.UpdateProduct)
	admin.DELETE("/products/:id", handlers.DeleteProduct)

	admin.GET("/orders", handlers.GetAllOrders)
	admin.PUT("/orders/:id/status", handlers.UpdateOrderStatus)

	admin.POST("/categories", handlers.CreateCategory)

	// =========================
	// Categories
	// =========================

	router.GET("/api/categories", handlers.GetCategories)
	// router.POST("/api/categories", handlers.CreateCategory)

	// Orders
	protected.POST("/orders", handlers.CreateOrder)
	protected.GET("/orders", handlers.GetMyOrders)

	// Start server
	router.Run(":8080")

}
