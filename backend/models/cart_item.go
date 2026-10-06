package models

import "gorm.io/gorm"

type CartItem struct {
	gorm.Model

	UserID    uint `json:"user_id" gorm:"index"`
	ProductID uint `json:"product_id" gorm:"index"`
	Quantity  int  `json:"quantity"`

	Product Product `json:"product"`
}