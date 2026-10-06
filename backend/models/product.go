package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model

	Name        string  `json:"name" gorm:"not null;index"`
	Description string  `json:"description"`
	Price       float64 `json:"price" gorm:"not null"`
	Stock       int     `json:"stock" gorm:"not null"`
	ImageURL    string  `json:"image_url"`

	CategoryID uint     `json:"category_id" gorm:"index"`
	Category   Category `json:"category"`
}