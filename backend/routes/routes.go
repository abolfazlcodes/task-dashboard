package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(server *gin.Engine) {
	// user and auth routes
	server.POST("/sign-up", signUpUser)
	server.POST("/login", login)
}
