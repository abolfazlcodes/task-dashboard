package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	// create a http server
	server := gin.Default()

	server.Run(":8080")

}
