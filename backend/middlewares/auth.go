package middlewares

import (
	"net/http"
	"strings"

	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
)

func Authenticate(context *gin.Context) {
	// 1. check if the request has token
	token := context.Request.Header.Get("Authorization")

	if token == "" {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Not authorized for this action.",
		})
		return
	}

	// remove Bearer from token :
	tokenParts := strings.Split(token, " ")

	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Wrong Authorization header for token",
		})
		return
	}

	// 2. if token existed ==> check if we can verify the token
	userId, err := utils.VerifyToken(tokenParts[1])

	if err != nil {
		context.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"message": "Not authorized",
		})
		return
	}

	context.Set("userId", userId)

	context.Next()
}
