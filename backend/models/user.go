package models

type User struct {
	ID        int64
	FirstName string `binding:"required"`
	LastName  string `binding:"required"`
	UserName  string `binding:"username"`
	Email     string `binding:"required"`
	Password  string `binding:"required"`
}
