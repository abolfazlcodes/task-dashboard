package models

import (
	"errors"

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

type LoginUser struct {
	ID       int64
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
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

func (user LoginUser) ValidateCredentials() error {
	query := `SELECT id, password FROM users WHERE email = ?`

	row := db.DB.QueryRow(query, user.Email)

	var retrievedUserPassword string
	err := row.Scan(&user.ID, &retrievedUserPassword)

	if err != nil {
		return errors.New("Invalid email or password.")
	}

	// check if the password is valid
	isPasswordValid := utils.CheckPasswordHash(user.Password, retrievedUserPassword)

	if !isPasswordValid {
		return errors.New("Invalid email or password!")
	}

	return nil
}

func (user User) Delete() error {
	query := "DELETE FROM users WHERE id = ?"
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(user.ID)
	return err
}

func GetUser(userId int64) (*User, error) {
	query := `SELECT * FROM users WHERE id = ?`
	row := db.DB.QueryRow(query, userId)

	var user User

	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Password, &user.UserName, &user.Email)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
