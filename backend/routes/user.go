package routes

import (
	"fmt"
	"net/http"

	"github.com/abolfazlcodes/task-dashboard/backend/models"
	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
)

func signUpUser(context *gin.Context) {
	var user models.User

	err := context.ShouldBindJSON(&user)

	if utils.CheckValidationErrors(context, err, user) {
		return
	}
	// save the user in db
	err = user.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Something went wrong. Please try again later.",
		})
		return
	}

	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not authenticate user. Please try again later.",
		})
		return
	}

	context.JSON(http.StatusCreated, gin.H{
		"message": "User was successfully created!",
		"token":   token,
	})

}

func login(context *gin.Context) {
	var user models.LoginUser

	err := context.ShouldBindJSON(&user)

	if utils.CheckValidationErrors(context, err, user) {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	// validate users credentials
	err = user.ValidateCredentials()

	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})

		return
	}

	// log the user and give the token
	token, err := utils.GenerateToken(user.Email, user.ID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not authenticate the user.",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Logged in successfully.",
		"token":   token,
	})
}

func deleteUserAccount(context *gin.Context) {
	userId, err := utils.ConvertStringToInt(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not parse user id.",
		})
		return
	}

	user, err := models.GetUser(*userId) // dereferencing the id

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not find the user.",
		})
		return
	}

	// delete the user:
	err = user.Delete()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not delete user. Try Again.",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "deleted successfully",
	})
}

func getUsers(context *gin.Context) {
	usersList, err := models.GetUsers()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not get users list.",
			"error":   err,
		})

		return
	}

	// format users options

	options := utils.FormatOptionsList(usersList, func(u models.User) int64 {
		return u.ID
	}, func(u models.User) string {
		return fmt.Sprintf("%v %v", u.FirstName, u.LastName)
	}, func(u models.User) string {
		return u.UserName
	})

	context.JSON(http.StatusOK, gin.H{
		"message": "Fetch users list was successful.",
		"data":    options,
	})

}
