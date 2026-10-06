package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	dsn := os.Getenv("DATABASE_URL")

	// Local development fallback
	if dsn == "" {
		dsn = "host=localhost user=postgres password=0000 dbname=abb_ecommerce port=5432 sslmode=disable"
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Get the underlying database/sql connection
	sqlDB, err := database.DB()

	if err != nil {
		log.Fatal("Failed to get database connection:", err)
	}

	// Connection pool settings
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetConnMaxLifetime(30 * time.Minute)

	DB = database

	fmt.Println("Database connected successfully!")
	fmt.Println("Database connection pool configured!")
}