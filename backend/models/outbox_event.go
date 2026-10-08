package models

import "time"

type OutboxEvent struct {
	ID          uint      `gorm:"primaryKey"`
	EventType   string    `gorm:"not null"`
	AggregateID uint      `gorm:"not null"`
	UserID      uint      `gorm:"not null"`
	Payload     string    `gorm:"type:text;not null"`
	Published   bool      `gorm:"default:false;index"`
	CreatedAt   time.Time
	PublishedAt *time.Time
}