package config

import (
	"context"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client

func ConnectRedis() {
	redisURL := os.Getenv("REDIS_URL")

	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	options, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatal("Invalid REDIS_URL:", err)
	}

	RedisClient = redis.NewClient(options)

	_, err = RedisClient.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}

	log.Println("Redis connected successfully!")
}