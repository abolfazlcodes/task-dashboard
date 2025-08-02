package utils

import (
	"errors"
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

func verifyTokenCallback(token *jwt.Token) (interface{}, error) {

	_, ok := token.Method.(*jwt.SigningMethodHMAC)

	if !ok {
		return nil, errors.New("Unexpected signing method.")
	}

	return []byte(secretKey), nil
}

func VerifyToken(token string) (int64, error) {
	parsedToken, err := jwt.Parse(token, verifyTokenCallback)

	if err != nil {
		return 0, errors.New("Couldn't parse token")
	}

	isTokenValid := parsedToken.Valid

	if !isTokenValid {
		return 0, errors.New("Token is invalid")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims) // claims that we set when creating the token / email / userId
	if !ok {
		return 0, errors.New("Token claims is invalid")
	}

	userId := int64(claims["userId"].(float64))

	return userId, nil
}
