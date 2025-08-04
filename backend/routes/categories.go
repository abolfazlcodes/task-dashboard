package routes

import (
	"net/http"

	"github.com/abolfazlcodes/task-dashboard/backend/models"
	"github.com/abolfazlcodes/task-dashboard/backend/utils"
	"github.com/gin-gonic/gin"
)

func createCategory(context *gin.Context) {
	var category models.Category

	err := context.ShouldBindJSON(&category) // a pinter as we do not need a copy to cause a bug

	if utils.CheckValidationErrors(context, err, category) {
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

	if utils.CheckValidationErrors(context, err, updatedCategory) {
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
