package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error

	DB, err = sql.Open("sqlite3", "api.db")

	if err != nil {
		panic(fmt.Sprintf("Could not connect to database: %v", err))
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTables()
}

func createTables() {
	// users table
	createUserTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		first_name VARCHAR(40) NOT NULL,
		last_name VARCHAR(40) NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		username TEXT NOT NULL
	)
	`

	_, err := DB.Exec(createUserTable)

	if err != nil {
		panic(fmt.Sprintf("Could not create users table %v", err))
	}

	createCategoriesTable := `
		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title VARCHAR(40) NOT NULL,
			description VARCHAR(40) NOT NULL
		)
	`

	_, err = DB.Exec(createCategoriesTable)

	if err != nil {
		panic(fmt.Sprintf("Could not create categories table %v", err))
	}

}
