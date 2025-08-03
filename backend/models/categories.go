package models

type Category struct {
	ID          int64
	Title       string `json:"title" binding:"required,min=3"`
	Description string `json:"description"`
}
