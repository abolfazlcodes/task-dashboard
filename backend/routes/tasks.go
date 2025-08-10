package routes

import (
	"net/http"

	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
)

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
