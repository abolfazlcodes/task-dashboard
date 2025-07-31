package models

import "time"

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
	Title        string    `binding:"title"`
	Description  string    `binding:"description"`
	Priority     Priority  `binding:"priority"`
	Status       Status    `binding:"status"`
	CreateAt     time.Time `binding:"created_at"`
	UpdatedAt    time.Time `binding:"updated_at"`
	DueDate      time.Time `binding:"due_date"`
	AssigneesIDs []int64   `binding:"assignees_ids"` // better to tell AssigneesIDs as we only get ids
}
