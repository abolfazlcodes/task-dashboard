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
			title VARCHAR(40) UNIQUE NOT NULL,
			description VARCHAR(40)
		)
	`

	_, err = DB.Exec(createCategoriesTable)

	if err != nil {
		panic(fmt.Sprintf("Could not create categories table %v", err))
	}

	createTasksTable := `
		CREATE TABLE IF NOT EXISTS tasks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title VARCHAR(40) NOT NULL,
			description VARCHAR(250),
			create_at DATE DEFAULT CURRENT_TIMESTAMP,
			updated_at DATE DEFAULT CURRENT_TIMESTAMP,
			due_date DATE NOT NULL,
			priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
			status TEXT NOT NULL CHECK(status IN ('todo', 'in-progress', 'done')),
			category_id INTEGER,
			FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
		)
	`

	_, err = DB.Exec(createTasksTable)

	if err != nil {
		panic(fmt.Sprintf("Could not create tasks table %v", err))
	}

	createTasksAssignees := `
		CREATE TABLE IF NOT EXISTS tasks_assignees (
			task_id INTEGER NOT NULL,
			user_id INTEGER NOT NULL,
			PRIMARY KEY (task_id, user_id),
			FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		)
	`
	_, err = DB.Exec(createTasksAssignees)

	if err != nil {
		panic(fmt.Sprintf("Could not create tasks_assignees table %v", err))
	}

}
