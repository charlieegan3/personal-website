package utils

import (
	"net/http"
	"os"
)

func SetCacheControl(w http.ResponseWriter, cacheControl string) {
	if os.Getenv("GO_ENV") == "dev" {
		return
	}
	w.Header().Set("Cache-Control", cacheControl)
}
