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

func createCategory(context *gin.Context) {
	var category models.Category

	err := context.ShouldBindJSON(&category) // a pinter as we do not need a copy to cause a bug

	if err != nil {

		var validationErrors validator.ValidationErrors

		if errors.As(err, &validationErrors) {
			errorsOutput := make(map[string]string)

			reflected := reflect.TypeOf(category)

			for first, fe := range validationErrors {
				fmt.Println(first, fe, "---- errors log loop ------")
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

			return
		}

		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body.",
		})
		return
	}

	// save the category in db

	err = category.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not create the category",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Category was created successfully!",
	})
}

func updateCategory(context *gin.Context) {
	categoryId, err := utils.ConvertStringToInt(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Category id could not be parsed.",
		})

		return
	}

	// get category if exists
	_, err = models.GetCategory(*categoryId)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "No category was found!",
		})

		return
	}

	var updatedCategory models.Category

	err = context.ShouldBindJSON(&updatedCategory)
	if err != nil {

		var validationErrors validator.ValidationErrors

		if errors.As(err, &validationErrors) {
			errorsOutput := make(map[string]string)

			reflected := reflect.TypeOf(updatedCategory)

			for first, fe := range validationErrors {
				fmt.Println(first, fe, "---- errors log loop ------")
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

			return
		}

		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request body.",
		})
		return
	}

	updatedCategory.ID = *categoryId

	err = updatedCategory.Update()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"message": "Could not update the category",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Category was updated successfully!",
	})
}

func deleteCategory(context *gin.Context) {
	categoryId, err := utils.ConvertStringToInt(context.Param("id"))

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Category id could not be parsed.",
		})

		return
	}

	// get the category
	category, err := models.GetCategory(*categoryId)

	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{
			"message": "No category was found!",
		})

		return
	}

	// delete the category
	err = category.Delete()

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{
			"message": "Could not delete the category",
		})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"message": "Category was deleted successfully!",
	})
}
