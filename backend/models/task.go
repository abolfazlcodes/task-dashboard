package models

import (
	"time"

	"github.com/abolfazlcodes/task-dashboard/backend/db"
)

// A task has these data:
// title / description / priority / status / due_date ? created_at / updated_at / assignees / category /
type Priority string

const (
	PriorityLow    Priority = "low"
	PriorityMedium Priority = "medium"
	PriorityHigh   Priority = "high"
)

type Status string

const (
	StatusDone       Status = "done"
	StatusInProgress Status = "in-progress"
	StatusTodo       Status = "todo"
)

type Task struct {
	ID           int64
	Title        string    `json:"title" binding:"required,min=3"`
	Description  string    `json:"description"`
	Priority     Priority  `json:"priority" binding:"required"`
	Status       Status    `json:"status" binding:"required"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DueDate      time.Time `json:"due_date" binding:"required"`
	CategoryID   int64     `json:"category_id"`
	AssigneesIDs []int64   `json:"assignees_ids" binding:"required"` // better to tell AssigneesIDs as we only get ids
}

func (task Task) Save() error {
	query := `INSERT INTO tasks(title, description, priority, status, created_at, updated_at, due_date, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
	`

	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(task.Title, task.Description, task.Priority, task.Status, task.CreatedAt, task.UpdatedAt, task.DueDate, task.CategoryID)

	if err != nil {
		return err
	}

	// we have to insert the task and the users id as assignees
	taskId, err := result.LastInsertId()

	if err != nil {
		return err
	}

	if len(task.AssigneesIDs) > 0 {
		taskUserQuery := `INSERT INTO tasks_assignees(task_id, user_id) VALUES(?, ?)`

		assigneeStmt, err := db.DB.Prepare(taskUserQuery)

		if err != nil {
			return err
		}

		defer assigneeStmt.Close()

		for _, userId := range task.AssigneesIDs {
			_, err := assigneeStmt.Exec(taskId, userId)

			if err != nil {
				return err
			}
		}
	}

	return nil
}
