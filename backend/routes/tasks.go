package routes

import (
	"net/http"
	"time"

	"github.com/abolfazlcodes/task-dashboard/backend/models"
	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
)

func createTask(context *gin.Context) {
	var task models.Task

	err := context.ShouldBindJSON(&task)

	if utils.CheckValidationErrors(context, err, task) {

		return
	}

	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	err = task.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not create task.",
		})

		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Task created successfully",
	})
}

func getStatusOptions(context *gin.Context) {
	statusOptions := []utils.Option{
		{
			Value: 1,
			Label: "done",
		},
		{
			Value: 2,
			Label: "in-progress",
		},
		{
			Value: 3,
			Label: "todo",
		},
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "successful",
		"data":    statusOptions,
	})
}

func getPriorityOptions(context *gin.Context) {
	priorityOptions := []utils.Option{
		{
			Value: 1,
			Label: "low",
		},
		{
			Value: 2,
			Label: "medium",
		},
		{
			Value: 3,
			Label: "high",
		},
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "successful",
		"data":    priorityOptions,
	})
}
