package middleware

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"ecommerce-backend/config"

	"github.com/gin-gonic/gin"
)

func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		ip := c.ClientIP()

		key := "rate_limit:" + ip

		ctx := context.Background()

		count, err := config.RedisClient.Incr(ctx, key).Result()

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Rate limiter error",
			})
			c.Abort()
			return
		}

		// First request starts a 10-second window
		if count == 1 {
			config.RedisClient.Expire(ctx, key, 10*time.Second)
		}

		// Allow maximum 5 requests per 10 seconds
		if count > 5 {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Header("X-RateLimit-Limit", "5")
		c.Header("X-RateLimit-Remaining", strconv.FormatInt(5-count, 10))

		c.Next()
	}
}