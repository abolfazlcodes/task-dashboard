package utils

import (
	"errors"
	"strconv"
	"strings"
)

func GenerateUsername(email string) string {
	username := strings.Split(email, "@")[0]
	return username
}

// as our user id is int64 we have to convert it to int64
func ConvertStringToInt(value string) (*int64, error) {
	numInt, err := strconv.ParseInt(value, 10, 64)

	if err != nil {
		return nil, errors.New("Could not convert id to integer")
	}

	return &numInt, nil
}
