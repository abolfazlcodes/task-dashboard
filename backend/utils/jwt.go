package utils

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = os.Getenv("JWT_SECRET")

func GenerateToken(email string, userId int64) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":      email,
		"userId":     userId,
		"expires_at": GenerateTokenExpiryTimeInHour(2),
	})

	return token.SignedString([]byte(secretKey))
}
