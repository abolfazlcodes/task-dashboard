package models

import "github.com/abolfazlcodes/task-dashboard/backend/db"

type Category struct {
	ID          int64
	Title       string `json:"title" binding:"required,min=3"`
	Description string `json:"description"`
}

func (category Category) Save() error {
	query := `INSERT INTO categories(title, description) VALUES(?, ?)`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(category.Title, category.Description)

	if err != nil {
		return err
	}

	return nil
}
