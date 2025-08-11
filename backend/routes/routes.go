package routes

import (
	"github.com/abolfazlcodes/task-dashboard/backend/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	// user and auth routes
	server.POST("/sign-up", signUpUser)
	server.POST("/login", login)

	authenticatedRoutes := server.Group("/")
	authenticatedRoutes.Use(middlewares.Authenticate)
	authenticatedRoutes.DELETE("/user/:id", deleteUserAccount)

	// get users list
	authenticatedRoutes.GET("/users", getUsers)

	// categories routes - it needs token
	server.GET("/category", getCategories)
	authenticatedRoutes.POST("/category", createCategory)
	authenticatedRoutes.PUT("/category/:id", updateCategory)
	authenticatedRoutes.DELETE("/category/:id", deleteCategory)

	// common routes
	authenticatedRoutes.GET("/status-options", getStatusOptions)
	authenticatedRoutes.GET("/priority-options", getPriorityOptions)

	// task routes
	authenticatedRoutes.POST("task", createTask)
}
