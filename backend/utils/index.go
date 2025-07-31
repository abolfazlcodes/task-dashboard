package utils

import "strings"

func GenerateUsername(email string) string {
	username := strings.Split(email, "@")[0]
	return username
}
