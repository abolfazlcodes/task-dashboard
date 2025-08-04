package utils

import (
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

func CheckValidationErrors(context *gin.Context, err error, model interface{}) bool {
	var validationErrors validator.ValidationErrors

	if errors.As(err, &validationErrors) {
		errorsOutput := make(map[string]string)

		reflected := reflect.TypeOf(model)

		for _, fe := range validationErrors {
			field, ok := reflected.FieldByName(fe.StructField())

			if !ok {
				continue
			}

			jsonTag := field.Tag.Get("json")
			fieldName := strings.Split(jsonTag, ",")[0]

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

		return true
	}

	context.JSON(http.StatusBadRequest, gin.H{
		"message": "Invalid request body.",
	})
	return false
}
