package config

import (
	"encoding/json"
	"log"
	"os"
	"strconv"

	amqp "github.com/rabbitmq/amqp091-go"
)

var RabbitConn *amqp.Connection
var RabbitChannel *amqp.Channel

const OrderQueue = "order_queue"

func ConnectRabbitMQ() {

	rabbitURL := os.Getenv("RABBITMQ_URL")

	if rabbitURL == "" {
		rabbitURL = "amqp://guest:guest@localhost:5672/"
	}

	var err error

	RabbitConn, err = amqp.Dial(rabbitURL)
	if err != nil {
		log.Fatal("Failed to connect to RabbitMQ:", err)
	}

	RabbitChannel, err = RabbitConn.Channel()
	if err != nil {
		log.Fatal("Failed to create RabbitMQ channel:", err)
	}

	_, err = RabbitChannel.QueueDeclare(
		OrderQueue,
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatal("Failed to declare RabbitMQ queue:", err)
	}

	log.Println("RabbitMQ connected successfully!")
}

func PublishOrderCreated(orderID uint, userID uint) {

	message := map[string]string{
		"event":    "order.created",
		"order_id": strconv.Itoa(int(orderID)),
		"user_id":  strconv.Itoa(int(userID)),
	}

	body, err := json.Marshal(message)

	if err != nil {
		log.Println("Failed to create RabbitMQ message:", err)
		return
	}

	err = RabbitChannel.Publish(
		"",
		OrderQueue,
		false,
		false,
		amqp.Publishing{
			ContentType:  "application/json",
			DeliveryMode: amqp.Persistent,
			Body:         body,
		},
	)

	if err != nil {
		log.Println("Failed to publish order event:", err)
		return
	}

	log.Printf(
		"Order event published: order_id=%d user_id=%d\n",
		orderID,
		userID,
	)
}