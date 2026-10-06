package models

import "gorm.io/gorm"

type User struct {
	gorm.Model

	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique;index"`
	Password string `json:"-"`
	Role     string `json:"role" gorm:"default:customer"`
}