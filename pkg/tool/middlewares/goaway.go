package middlewares

import (
	"net/http"
	"regexp"
)

var goAwayPaths = []string{
	"/wp-login.php",
	"/.git/config",
	"/.env",
}

var goAwayPatterns = []string{
	`.php$`,
	`\/wp-includes\/`,
	`\/wp-admin\/`,
	`\/wp-content\/`,
	`wlwmanifest.xml$`,
	`^\/laravel\/`,
	`^\/.vscode\/`,
	`^\/.remote\/`,
	`^\/uploads\/`,
}

func BuildGoAwayMiddleware() func(http.Handler) http.Handler {

	pathMap := make(map[string]bool)
	for _, path := range goAwayPaths {
		pathMap[path] = true
	}

	var patterns []regexp.Regexp
	for _, pattern := range goAwayPatterns {
		patterns = append(patterns, *regexp.MustCompile(pattern))
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			if pathMap[r.URL.Path] {
				w.WriteHeader(404)
				return
			}

			for _, pattern := range patterns {
				if pattern.MatchString(r.URL.Path) {
					w.WriteHeader(404)
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
