package workers

import (
	"log"

	"ecommerce-backend/config"
)

func StartOrderWorker() {

	messages, err := config.RabbitChannel.Consume(
		config.OrderQueue,
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal("Failed to start order worker:", err)
	}

	go func() {

		log.Println("Order worker started...")

		for message := range messages {

			log.Printf(
				"Order worker received event: %s\n",
				string(message.Body),
			)

			// Background processing can happen here.
			// Example:
			// - Send order confirmation email
			// - Send notification
			// - Generate invoice
			// - Update analytics

			err := message.Ack(false)

			if err != nil {
				log.Println("Failed to acknowledge message:", err)
			}
		}
	}()
}