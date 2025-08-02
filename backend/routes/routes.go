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
}
