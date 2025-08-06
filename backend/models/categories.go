package models

import (
	"github.com/abolfazlcodes/task-dashboard/backend/db"
)

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

func (category Category) Delete() error {
	query := `DELETE FROM categories WHERE id = ?`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(category.ID)

	if err != nil {
		return err
	}

	return nil
}

func (category Category) Update() error {
	query := `UPDATE categories SET title = ?, description = ? WHERE id = ?`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(category.Title, category.Description, category.ID)

	return err
}

func GetCategory(id int64) (*Category, error) {
	query := `SELECT * FROM categories WHERE id = ?`

	row := db.DB.QueryRow(query, id)

	var category Category

	err := row.Scan(&category.ID, &category.Title, &category.Description)

	if err != nil {
		return nil, err
	}

	return &category, nil

}

func GetAllCategories() ([]Category, error) {
	query := "SELECT * FROM categories"

	rows, err := db.DB.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var allCategories []Category

	for rows.Next() {
		var category Category

		err := rows.Scan(&category.ID, &category.Title, &category.Description)

		if err != nil {
			return nil, err
		}

		allCategories = append(allCategories, category)
	}

	return allCategories, nil
}
