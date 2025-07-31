package models

import (
	"github.com/abolfazlcodes/task-dashboard/backend/db"
	"github.com/abolfazlcodes/task-dashboard/backend/utils"
)

type User struct {
	ID        int64
	FirstName string `json:"first_name" binding:"required,min=3"`
	LastName  string `json:"last_name" binding:"required,min=3"`
	UserName  string `json:"username"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

func (user User) Save() error {
	query := `INSERT INTO users(first_name, last_name, username, email, password) VALUES(?, ?, ?, ?, ?)`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}

	generatedUsername := utils.GenerateUsername(user.Email)

	result, err := stmt.Exec(user.FirstName, user.LastName, generatedUsername, user.Email, hashedPassword)

	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()

	if err != nil {
		return err
	}
	// set the user id to the id created by DB
	user.ID = userId

	return nil
}
