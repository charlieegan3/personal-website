package middlewares

import (
	"crypto/subtle"
	"fmt"
	"net/http"
)

func InitMiddlewareAuth(username, password string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			u, p, ok := r.BasicAuth()
			if !ok ||
				subtle.ConstantTimeCompare([]byte(username), []byte(u)) != 1 ||
				subtle.ConstantTimeCompare([]byte(password), []byte(p)) != 1 {
				w.Header().Set(
					"WWW-Authenticate",
					fmt.Sprintf(`Basic realm="%s"`, "charlieegan3.com"),
				)
				w.WriteHeader(401)
				w.Write([]byte("unauthorised"))
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
