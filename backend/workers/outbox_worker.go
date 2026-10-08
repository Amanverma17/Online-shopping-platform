package workers

import (
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

func StartOutboxWorker() {

	go func() {

		log.Println("Outbox worker started...")

		for {

			var events []models.OutboxEvent

			err := config.DB.
				Where("published = ?", false).
				Order("id ASC").
				Limit(10).
				Find(&events).Error

			if err != nil {
				log.Println("Outbox worker database error:", err)
				time.Sleep(2 * time.Second)
				continue
			}

			for _, event := range events {

				err := config.RabbitChannel.Publish(
					"",
					config.OrderQueue,
					false,
					false,
					amqp.Publishing{
						ContentType:  "application/json",
						DeliveryMode: amqp.Persistent,
						Body:         []byte(event.Payload),
					},
				)

				if err != nil {
					log.Println(
						"Failed to publish outbox event:",
						event.ID,
						err,
					)
					continue
				}

				now := time.Now()

				err = config.DB.
					Model(&models.OutboxEvent{}).
					Where("id = ? AND published = ?", event.ID, false).
					Updates(map[string]interface{}{
						"published":    true,
						"published_at": now,
					}).Error

				if err != nil {
					log.Println(
						"Failed to mark outbox event as published:",
						event.ID,
						err,
					)
					continue
				}

				log.Printf(
					"Outbox event published: id=%d type=%s\n",
					event.ID,
					event.EventType,
				)
			}

			time.Sleep(2 * time.Second)
		}
	}()
}
