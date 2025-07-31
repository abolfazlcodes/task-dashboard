package utils

import "time"

func GenerateTokenExpiryTimeInHour(hour time.Duration) int64 {
	expires_at := time.Now().Add(time.Hour * hour).Unix()
	return expires_at
}
