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

}
