package models

import "gorm.io/gorm"

type Address struct {
	gorm.Model

	UserID  uint   `json:"user_id" gorm:"index"`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	House   string `json:"house"`
	Street  string `json:"street"`
	City    string `json:"city"`
	Pincode string `json:"pincode"`
}