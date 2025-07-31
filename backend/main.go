package main

import (
	"github.com/abolfazlcodes/task-dashboard/backend/db"
	"github.com/abolfazlcodes/task-dashboard/backend/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()

	// create a http server
	server := gin.Default()
	// server.Use(gin.Logger())
	routes.RegisterRoutes(server)

	server.Run(":8080")
}
