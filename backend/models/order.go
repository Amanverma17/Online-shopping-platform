package models

import "gorm.io/gorm"

type Order struct {
	gorm.Model

	UserID uint   `json:"user_id" gorm:"index"`
	User   User   `json:"user"`

	Total  float64 `json:"total"`
	Status string  `json:"status" gorm:"index"`

	Items []OrderItem `json:"items"`
}

type OrderItem struct {
	gorm.Model

	OrderID   uint    `json:"order_id" gorm:"index"`
	ProductID uint    `json:"product_id" gorm:"index"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`

	Product Product `json:"product"`
}