package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model

	UserID uint `json:"user_id"`
	User   User `json:"user"`

	Total  float64 `json:"total"`
	Status string  `json:"status"`

	Items []OrderItem `json:"items"`
}

type OrderItem struct {
	gorm.Model

	OrderID   uint    `json:"order_id"`
	ProductID uint    `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`

	Product Product `json:"product"`
}