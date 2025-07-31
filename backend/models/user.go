package models

type User struct {
	ID        int64
	FirstName string `json:"first_name" binding:"required,min=3"`
	LastName  string `json:"last_name" binding:"required,min=3"`
	UserName  string `json:"username"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}
