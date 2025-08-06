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
	Title        string    `json:"title" binding:"required,min=3"`
	Description  string    `json:"description"`
	Priority     Priority  `json:"priority" binding:"required"`
	Status       Status    `json:"status" binding:"required"`
	CreateAt     time.Time `json:"create_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DueDate      time.Time `json:"due_date" binding:"required"`
	AssigneesIDs []int64   `json:"assignees_ids" binding:"required"` // better to tell AssigneesIDs as we only get ids
}
