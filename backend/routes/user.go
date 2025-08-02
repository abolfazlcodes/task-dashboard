package routes

import (
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/abolfazlcodes/task-dashboard/backend/models"
	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func signUpUser(context *gin.Context) {
	var user models.User

	err := context.ShouldBindJSON(&user)

	if err != nil {

		var validationErrors validator.ValidationErrors

		if errors.As(err, &validationErrors) {
			errorsOutput := make(map[string]string)

			reflected := reflect.TypeOf(user)

			for _, fe := range validationErrors {
				field, ok := reflected.FieldByName(fe.StructField())

				if !ok {
					continue
				}

				jsonTag := field.Tag.Get("json")
				fieldName := strings.Split(jsonTag, ",")[0] // delete other setting like: "first_name,omitempty"

				switch fe.Tag() {
				case "required":
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s is required", fieldName)
				case "min":
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s must be at least %s characters", fieldName, fe.Param())
				case "email":
					errorsOutput[strings.ToLower(fieldName)] = "Invalid email format."
				default:
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s is not valid", fieldName)
				}
			}

			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Request validation errors.",
				"errors":  errorsOutput,
			})

			return
		}

		// any unexpected error
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body",
		})
		return
	}

	// save the user in db
	err = user.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Something went wrong. Please try again later.",
		})
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

	if err != nil {
		var validationErrors validator.ValidationErrors

		if errors.As(err, &validationErrors) {
			errorsOutput := make(map[string]string)

			reflected := reflect.TypeOf(user)

			for _, fe := range validationErrors {
				field, ok := reflected.FieldByName(fe.StructField())

				if !ok {
					continue
				}

				jsonTag := field.Tag.Get("json")
				fieldName := strings.Split(jsonTag, ",")[0] // delete other setting like: "first_name,omitempty"

				switch fe.Tag() {
				case "required":
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s is required", fieldName)
				case "min":
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s must be at least %s characters", fieldName, fe.Param())
				case "email":
					errorsOutput[strings.ToLower(fieldName)] = "Invalid email format."
				default:
					errorsOutput[strings.ToLower(fieldName)] = fmt.Sprintf("%s is not valid", fieldName)
				}
			}

			context.JSON(http.StatusBadRequest, gin.H{
				"message": "Request validation errors.",
				"errors":  errorsOutput,
			})

			return
		}

		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Wrong format. Could not parse the request.",
			"error":   err,
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
